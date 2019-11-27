CREATE TABLE IF NOT EXISTS bundles (
  id INTEGER,
  version TEXT,
  publickey TEXT,
  unixtime INTEGER,
  bid INTEGER,
  bsh TEXT,
  script BLOB,
  PRIMARY KEY(id ASC)
);

