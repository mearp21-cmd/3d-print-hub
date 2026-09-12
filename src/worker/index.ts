import { Hono } from "hono";

type ExistingBlueprintRow = {
  id: number;
  name: string;
  description: string;
  creator: string;
  category: string;
  file_key: string | null;
  preview_key: string | null;
  access_type: string;
  price: number;
  downloads: number;
  rating: number;
  created_at: string;
};

type Blueprint = ExistingBlueprintRow & {
  access_type: string;
};

type CreateBlueprintInput = {
  name: string;
  description: string;
  creator: string;
  category: string;
  access_type: string;
  price: number;
};

const app = new Hono<{ Bindings: Env }>();

const blueprintColumns = [
  "id,",
  "name,",
  "description,",
  "creator,",
  "category,",
  "file_key,",
  "preview_key,",
  "access_type,",
  "price,",
  "downloads,",
  "rating,",
  "created_at",
].join("\n");

function readRequiredString(
  value: unknown,
  field: string,
): { value: string } | { error: string } {
  if (typeof value !== "string" || !value.trim()) {
    return { error: field + " is required." };
  }

  return { value: value.trim() };
}

function normalizeAccessType(value: string): string {
  switch (value.toLowerCase()) {
    case "free":
      return "Free";
    case "paid":
      return "Paid";
    case "pro":
      return "Pro";
    default:
      return value;
  }
}

function toBlueprint(row: ExistingBlueprintRow): Blueprint {
  return {
    ...row,
    access_type: normalizeAccessType(row.access_type),
  };
}

function parseBlueprintId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
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

  const priceValue =
    typeof input.price === "string" ? input.price.trim() : input.price;
  const price =
    typeof priceValue === "number" || typeof priceValue === "string"
      ? Number(priceValue)
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
      access_type: normalizeAccessType(accessValue),
      price,
    },
  };
}

app.get("/api/health", (c) =>
  c.json({ success: true, service: "3d-print-hub-api" }),
);

app.get("/api/blueprints", async (c) => {
  const result = await c.env.DB
    .prepare(
      "SELECT " +
        blueprintColumns +
        " FROM blueprints ORDER BY created_at DESC, id DESC",
    )
    .all<ExistingBlueprintRow>();

  return c.json({
    success: true,
    blueprints: result.results.map(toBlueprint),
  });
});

app.get("/api/blueprints/:id", async (c) => {
  const id = parseBlueprintId(c.req.param("id"));
  if (!id) {
    return c.json({ success: false, error: "Blueprint not found." }, 404);
  }

  const blueprint = await c.env.DB
    .prepare("SELECT " + blueprintColumns + " FROM blueprints WHERE id = ?")
    .bind(id)
    .first<ExistingBlueprintRow>();

  if (!blueprint) {
    return c.json({ success: false, error: "Blueprint not found." }, 404);
  }

  return c.json({ success: true, blueprint: toBlueprint(blueprint) });
});

app.post("/api/blueprints", async (c) => {
  const body = await c.req.json().catch(() => null);
  const input = parseCreateBlueprintInput(body);

  if ("error" in input) {
    return c.json({ success: false, error: input.error }, 400);
  }

  try {
    const result = await c.env.DB
      .prepare(
        "INSERT INTO blueprints (" +
          "name, description, creator, category, file_key, preview_key, " +
          "access_type, price, downloads, rating, created_at" +
          ") VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 0, 0, CURRENT_TIMESTAMP)",
      )
      .bind(
        input.value.name,
        input.value.description,
        input.value.creator,
        input.value.category,
        "pending",
        input.value.access_type,
        input.value.price,
      )
      .run();

    const blueprint = await c.env.DB
      .prepare("SELECT " + blueprintColumns + " FROM blueprints WHERE id = ?")
      .bind(result.meta.last_row_id)
      .first<ExistingBlueprintRow>();

    return c.json(
      {
        success: true,
        blueprint: blueprint ? toBlueprint(blueprint) : null,
      },
      201,
    );
  } catch (error) {
    console.error(
      "Failed to create blueprint",
      error instanceof Error ? error.message : "Unknown database error",
    );
    return c.json(
      {
        success: false,
        error: "Unable to create blueprint. Please try again later.",
      },
      500,
    );
  }
});

export default app;
