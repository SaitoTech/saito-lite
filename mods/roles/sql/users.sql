CREATE TABLE IF NOT EXISTS users (
  id INTEGER,
  publickey TEXT,
  name TEXT,
  created_at INTEGER,
  deleted_at INTEGER,
  UNIQUE (publickey, name),
  PRIMARY KEY(id ASC)
);

