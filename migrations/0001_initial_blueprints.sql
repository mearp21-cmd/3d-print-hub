CREATE TABLE blueprints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  category TEXT NOT NULL,
  access_type TEXT NOT NULL
    CHECK (access_type IN ('free', 'paid', 'pro')),
  price_cents INTEGER NOT NULL DEFAULT 0
    CHECK (price_cents >= 0),
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),
  storage_key TEXT,
  preview_key TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blueprints_published_created
  ON blueprints(status, created_at DESC);

CREATE INDEX idx_blueprints_category
  ON blueprints(category);
