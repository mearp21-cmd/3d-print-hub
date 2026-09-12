PRAGMA foreign_keys = ON;

ALTER TABLE blueprints
  ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blueprints_user_id
  ON blueprints(user_id);
