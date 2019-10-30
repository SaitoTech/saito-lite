CREATE TABLE IF NOT EXISTS modules (
  id INTEGER,
  name TEXT,
  description TEXT,
  version TEXT,
  publickey TEXT,
  unixtime INTEGER,
  bid INTEGER,
  bsh TEXT,
  tx BLOB,
  UNIQUE (tx),
  PRIMARY KEY(id ASC)
);

