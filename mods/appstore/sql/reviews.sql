CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER,
  module_id INTEGER,
  publickey TEXT,
  tx BLOB,
  UNIQUE (tx),
  PRIMARY KEY(id ASC)
);

