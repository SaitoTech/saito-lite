CREATE TABLE IF NOT EXISTS votes (
  id INTEGER,
  docid TEXT,
  publickey TEXT,
  UNIQUE (publickey, docid),
  PRIMARY KEY(id ASC)
);