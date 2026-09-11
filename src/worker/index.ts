import { Hono } from "hono";

type Blueprint = {
  id: number;
  slug: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  access_type: "Free" | "Paid" | "Pro";
  price_cents: number;
  price: number;
  storage_key: string | null;
  preview_key: string | null;
  downloads: number;
  created_at: string;
  updated_at: string;
};

type CreateBlueprintInput = {
  name: string;
  description: string;
  creator: string;
  category: string;
  access_type: "free" | "paid" | "pro";
  price: number;
};

const app = new Hono<{ Bindings: Env }>();

const publishedBlueprintsQuery = [
  "SELECT",
  "  id,",
  "  slug,",
  "  name,",
  "  description,",
  "  creator_name AS creator,",
  "  category,",
  "  CASE access_type",
  "    WHEN 'free' THEN 'Free'",
  "    WHEN 'paid' THEN 'Paid'",
  "    WHEN 'pro' THEN 'Pro'",
  "  END AS access_type,",
  "  price_cents,",
  "  price_cents / 100.0 AS price,",
  "  storage_key,",
  "  preview_key,",
  "  download_count AS downloads,",
  "  created_at,",
  "  updated_at",
  "FROM blueprints",
  "WHERE status = 'published'",
].join("\\n");

function readRequiredString(
  value: unknown,
  field: string,
): { value: string } | { error: string } {
  if (typeof value !== "string" || !value.trim()) {
    return { error: field + " is required." };
  }

  return { value: value.trim() };
}

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "blueprint";
}

async function createUniqueSlug(
  database: D1Database,
  name: string,
): Promise<string> {
  const baseSlug = slugify(name);
  let suffix = 1;

  while (true) {
    const slug = suffix === 1 ? baseSlug : baseSlug + "-" + suffix;
    const existing = await database
      .prepare("SELECT id FROM blueprints WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<{ id: number }>();

    if (!existing) {
      return slug;
    }

    suffix += 1;
  }
}

function parseCreateBlueprintInput(
  body: unknown,
): { value: CreateBlueprintInput } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "A JSON request body is required." };
  }

  const input = body as Record<string, unknown>;
  const name = readRequiredString(input.name, "name");
  if ("error" in name) return name;

  const description = readRequiredString(input.description, "description");
  if ("error" in description) return description;

  const creator = readRequiredString(input.creator, "creator");
  if ("error" in creator) return creator;

  const category = readRequiredString(input.category, "category");
  if ("error" in category) return category;

  const accessValue =
    typeof input.access_type === "string"
      ? input.access_type.trim().toLowerCase()
      : "";
  if (
    accessValue !== "free" &&
    accessValue !== "paid" &&
    accessValue !== "pro"
  ) {
    return { error: "access_type must be Free, Paid, or Pro." };
  }

  const price =
    typeof input.price === "number" || typeof input.price === "string"
      ? Number(input.price)
      : Number.NaN;
  if (!Number.isFinite(price) || price < 0) {
    return { error: "price must be a non-negative number." };
  }

  return {
    value: {
      name: name.value,
      description: description.value,
      creator: creator.value,
      category: category.value,
      access_type: accessValue,
      price,
    },
  };
}

app.get("/api/health", (c) => c.json({ success: true }));

app.get("/api/blueprints", async (c) => {
  const result = await c.env.DB
    .prepare(publishedBlueprintsQuery + " ORDER BY created_at DESC, id DESC")
    .all<Blueprint>();

  return c.json({
    success: true,
    blueprints: result.results,
  });
});

app.get("/api/blueprints/:slug", async (c) => {
  const blueprint = await c.env.DB
    .prepare(publishedBlueprintsQuery + " AND slug = ? LIMIT 1")
    .bind(c.req.param("slug"))
    .first<Blueprint>();

  if (!blueprint) {
    return c.json({ success: false, error: "Blueprint not found." }, 404);
  }

  return c.json({ success: true, blueprint });
});

app.post("/api/blueprints", async (c) => {
  const body = await c.req.json().catch(() => null);
  const input = parseCreateBlueprintInput(body);

  if ("error" in input) {
    return c.json({ success: false, error: input.error }, 400);
  }

  const slug = await createUniqueSlug(c.env.DB, input.value.name);
  const priceCents = Math.round(input.value.price * 100);

  await c.env.DB
    .prepare(
      "INSERT INTO blueprints (" +
        "slug, name, description, creator_name, category, access_type, price_cents" +
        ") VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      slug,
      input.value.name,
      input.value.description,
      input.value.creator,
      input.value.category,
      input.value.access_type,
      priceCents,
    )
    .run();

  const blueprint = await c.env.DB
    .prepare(publishedBlueprintsQuery + " AND slug = ? LIMIT 1")
    .bind(slug)
    .first<Blueprint>();

  return c.json({ success: true, blueprint }, 201);
});

export default app;
