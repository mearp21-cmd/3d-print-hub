import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { getCurrentUser } from "./auth";

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

const MAX_BLUEPRINT_FILE_SIZE = 50 * 1024 * 1024;
const MAX_PREVIEW_FILE_SIZE = 5 * 1024 * 1024;
const MAX_UPLOAD_SIZE = MAX_BLUEPRINT_FILE_SIZE + MAX_PREVIEW_FILE_SIZE;

const blueprintFileContentTypes = {
  ".stl": "model/stl",
  ".3mf": "model/3mf",
  ".obj": "model/obj",
  ".zip": "application/zip",
} as const;

const previewFileContentTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
} as const;

type BlueprintFileExtension = keyof typeof blueprintFileContentTypes;
type PreviewFileExtension = keyof typeof previewFileContentTypes;

type BlueprintFileReference = {
  id: number;
  file_key: string | null;
  user_id: number | null;
};

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


function getBlueprintFileExtension(
  filename: string,
): BlueprintFileExtension | null {
  const normalized = filename.trim().toLowerCase();
  const separator = normalized.lastIndexOf(".");

  if (separator <= 0 || separator === normalized.length - 1) {
    return null;
  }

  const extension = normalized.slice(separator);
  return extension in blueprintFileContentTypes
    ? (extension as BlueprintFileExtension)
    : null;
}

function getPreviewFileExtension(filename: string): PreviewFileExtension | null {
  const normalized = filename.trim().toLowerCase();
  const separator = normalized.lastIndexOf(".");

  if (separator <= 0 || separator === normalized.length - 1) {
    return null;
  }

  const extension = normalized.slice(separator);
  return extension in previewFileContentTypes
    ? (extension as PreviewFileExtension)
    : null;
}

function getSafeUploadFilename(
  filename: string,
  extension: BlueprintFileExtension,
): string {
  const baseName = filename
    .trim()
    .slice(0, -extension.length)
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return (baseName || "blueprint") + extension;
}

function getDownloadFilename(id: number, objectKey: string): string {
  const extension = getBlueprintFileExtension(objectKey) ?? ".bin";
  return "blueprint-" + id + extension;
}

function getContentType(objectKey: string): string {
  const extension = getBlueprintFileExtension(objectKey);
  return extension
    ? blueprintFileContentTypes[extension]
    : "application/octet-stream";
}

function logStorageError(operation: string, error: unknown): void {
  console.error(
    operation,
    error instanceof Error ? error.message : "Unknown storage error",
  );
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


app.post(
  "/api/blueprints/:id/upload",
  bodyLimit({
    maxSize: MAX_UPLOAD_SIZE,
    onError: (c) =>
      c.json(
        {
          success: false,
          error: "Blueprint uploads must be 55 MB or smaller.",
        },
        413,
      ),
  }),
  async (c) => {
    const user = await getCurrentUser(c.env.DB, c.req.raw);
    if (!user) {
      return c.json(
        {
          success: false,
          error: "Sign in to upload a blueprint file.",
          code: "AUTH_REQUIRED",
        },
        401,
      );
    }

    const id = parseBlueprintId(c.req.param("id"));
    if (!id) {
      return c.json({ success: false, error: "Blueprint not found." }, 404);
    }

    let blueprint: BlueprintFileReference | null;

    try {
      blueprint = await c.env.DB
        .prepare("SELECT id, file_key, user_id FROM blueprints WHERE id = ?")
        .bind(id)
        .first<BlueprintFileReference>();
    } catch (error) {
      logStorageError("Failed to look up blueprint for upload", error);
      return c.json(
        { success: false, error: "Unable to upload blueprint file." },
        500,
      );
    }

    if (!blueprint) {
      return c.json({ success: false, error: "Blueprint not found." }, 404);
    }

    if (blueprint.user_id !== user.id) {
      return c.json(
        {
          success: false,
          error: "You do not have permission to upload this blueprint file.",
          code: "BLUEPRINT_FORBIDDEN",
        },
        403,
      );
    }

    const currentFileKey = blueprint.file_key?.trim();
    if (currentFileKey && currentFileKey !== "pending") {
      return c.json(
        {
          success: false,
          error: "A blueprint file has already been stored for this blueprint.",
        },
        409,
      );
    }

    const requestContentType = c.req.header("content-type") ?? "";
    if (!requestContentType.toLowerCase().startsWith("multipart/form-data")) {
      return c.json(
        {
          success: false,
          error: "Upload requests must use multipart/form-data.",
        },
        415,
      );
    }

    let formData: FormData;

    try {
      formData = await c.req.formData();
    } catch (error) {
      logStorageError("Failed to read blueprint upload form data", error);
      return c.json(
        { success: false, error: "A valid blueprint file is required." },
        400,
      );
    }

    const fileValues = formData.getAll("file");
    const previewValues = formData.getAll("preview");
    const preview =
      previewValues.length === 1 && previewValues[0] instanceof File
        ? previewValues[0]
        : null;
    const invalidPreview =
      previewValues.length > 1 ||
      (previewValues.length === 1 && !(previewValues[0] instanceof File));
    let suppliedFileCount = 0;
    formData.forEach((value) => {
      if (value instanceof File) {
        suppliedFileCount += 1;
      }
    });

    if (
      fileValues.length !== 1 ||
      !(fileValues[0] instanceof File) ||
      invalidPreview ||
      suppliedFileCount !== (preview ? 2 : 1)
    ) {
      return c.json(
        {
          success: false,
          error: "Provide exactly one blueprint file using the file field.",
        },
        400,
      );
    }

    const file = fileValues[0];

    if (file.size === 0) {
      return c.json(
        { success: false, error: "Blueprint files cannot be empty." },
        400,
      );
    }

    if (file.size > MAX_BLUEPRINT_FILE_SIZE) {
      return c.json(
        {
          success: false,
          error: "Blueprint files must be 50 MB or smaller.",
        },
        413,
      );
    }

    const extension = getBlueprintFileExtension(file.name);
    if (!extension) {
      return c.json(
        {
          success: false,
          error: "Supported blueprint files are .stl, .3mf, .obj, and .zip.",
        },
        415,
      );
    }

    let previewExtension: PreviewFileExtension | null = null;
    if (preview) {
      if (preview.size === 0) {
        return c.json(
          { success: false, error: "Preview images cannot be empty." },
          400,
        );
      }

      if (preview.size > MAX_PREVIEW_FILE_SIZE) {
        return c.json(
          {
            success: false,
            error: "Preview images must be 5 MB or smaller.",
          },
          413,
        );
      }

      previewExtension = getPreviewFileExtension(preview.name);
      if (!previewExtension) {
        return c.json(
          {
            success: false,
            error: "Supported preview images are .png, .jpg, .jpeg, and .webp.",
          },
          415,
        );
      }
    }

    const filename = getSafeUploadFilename(file.name, extension);
    const storedKey =
      "blueprints/" + id + "/" + crypto.randomUUID() + extension;
    const storedPreviewKey = preview && previewExtension
      ? "blueprints/" + id + "/preview-" + crypto.randomUUID() + previewExtension
      : null;

    try {
      await c.env.BLUEPRINTS.put(storedKey, file.stream(), {
        httpMetadata: {
          contentType: blueprintFileContentTypes[extension],
        },
      });

      if (preview && previewExtension && storedPreviewKey) {
        await c.env.BLUEPRINTS.put(storedPreviewKey, preview.stream(), {
          httpMetadata: {
            contentType: previewFileContentTypes[previewExtension],
          },
        });
      }

      const updateResult = await c.env.DB
        .prepare(
          "UPDATE blueprints SET file_key = ?, preview_key = COALESCE(?, preview_key) WHERE id = ? AND " +
            "user_id = ? AND " +
            "(file_key IS NULL OR TRIM(file_key) = '' OR file_key = 'pending')",
        )
        .bind(storedKey, storedPreviewKey, id, user.id)
        .run();

      if (updateResult.meta.changes !== 1) {
        try {
          await c.env.BLUEPRINTS.delete(storedKey);
          if (storedPreviewKey) {
            await c.env.BLUEPRINTS.delete(storedPreviewKey);
          }
        } catch (cleanupError) {
          logStorageError(
            "Failed to remove unlinked blueprint object",
            cleanupError,
          );
        }

        return c.json(
          {
            success: false,
            error: "A blueprint file has already been stored for this blueprint.",
          },
          409,
        );
      }

      return c.json(
        {
          success: true,
          blueprint_id: id,
          filename,
          stored_key: storedKey,
          preview_key: storedPreviewKey,
        },
        201,
      );
    } catch (error) {
      logStorageError("Failed to store blueprint file", error);

      try {
        await c.env.BLUEPRINTS.delete(storedKey);
        if (storedPreviewKey) {
          await c.env.BLUEPRINTS.delete(storedPreviewKey);
        }
      } catch (cleanupError) {
        logStorageError(
          "Failed to remove unlinked blueprint object",
          cleanupError,
        );
      }

      return c.json(
        { success: false, error: "Unable to store blueprint file." },
        500,
      );
    }
  },
);

app.get("/api/blueprints/:id/download", async (c) => {
  const id = parseBlueprintId(c.req.param("id"));
  if (!id) {
    return c.json({ success: false, error: "Blueprint not found." }, 404);
  }

  try {
    const blueprint = await c.env.DB
      .prepare("SELECT id, file_key FROM blueprints WHERE id = ?")
      .bind(id)
      .first<BlueprintFileReference>();

    if (!blueprint) {
      return c.json({ success: false, error: "Blueprint not found." }, 404);
    }

    const fileKey = blueprint.file_key?.trim();
    if (!fileKey || fileKey === "pending") {
      return c.json(
        { success: false, error: "Blueprint file not found." },
        404,
      );
    }

    const object = await c.env.BLUEPRINTS.get(fileKey);
    if (!object) {
      return c.json(
        { success: false, error: "Blueprint file not found." },
        404,
      );
    }

    const filename = getDownloadFilename(id, fileKey);

    return new Response(object.body, {
      headers: {
        "Content-Type": getContentType(fileKey),
        "Content-Disposition": 'attachment; filename="' + filename + '"',
        "Content-Length": String(object.size),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    logStorageError("Failed to download blueprint file", error);
    return c.json(
      { success: false, error: "Unable to download blueprint file." },
      500,
    );
  }
});

app.post("/api/blueprints", async (c) => {
  const user = await getCurrentUser(c.env.DB, c.req.raw);
  if (!user) {
    return c.json(
      {
        success: false,
        error: "Sign in to publish a blueprint.",
        code: "AUTH_REQUIRED",
      },
      401,
    );
  }

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
          "access_type, price, downloads, rating, created_at, user_id" +
          ") VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 0, 0, CURRENT_TIMESTAMP, ?)",
      )
      .bind(
        input.value.name,
        input.value.description,
        user.display_name,
        input.value.category,
        "pending",
        input.value.access_type,
        input.value.price,
        user.id,
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
