CREATE TABLE IF NOT EXISTS bundles (
  id INTEGER,
  version TEXT,
  publickey TEXT,
  unixtime INTEGER,
  bid INTEGER,
  bsh TEXT,
  name TEXT,
  script BLOB,
  UNIQUE (name),
  PRIMARY KEY(id ASC)
);

