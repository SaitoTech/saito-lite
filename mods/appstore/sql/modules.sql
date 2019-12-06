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
  featured INTEGER DEFAULT 0,
  UNIQUE (version),
  UNIQUE (tx),
  PRIMARY KEY(id ASC)
);

