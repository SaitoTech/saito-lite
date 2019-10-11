CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER,
  uuid TEXT,
  publickey TEXT,
  name TEXT,
  tx TEXT,
  UNIQUE(uuid, publickey),
  PRIMARY KEY(id ASC)
);