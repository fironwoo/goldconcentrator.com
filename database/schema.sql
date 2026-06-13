CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  received_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  mineral TEXT NOT NULL,
  capacity TEXT NOT NULL,
  ore_type TEXT NOT NULL DEFAULT '',
  grade TEXT NOT NULL DEFAULT '',
  feed_size TEXT NOT NULL DEFAULT '',
  utilities TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL,
  project_stage TEXT NOT NULL,
  budget TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  email_sent INTEGER NOT NULL DEFAULT 0,
  delivery_error TEXT,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS inquiries_ip_received_idx
  ON inquiries (ip_hash, received_at);

CREATE INDEX IF NOT EXISTS inquiries_expiry_idx
  ON inquiries (expires_at);
