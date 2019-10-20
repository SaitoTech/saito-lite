CREATE TABLE IF NOT EXISTS txs (
  id INTEGER,
  sig TEXT,
  publickey TEXT,
  tx TEXT,
  ts INTEGER,
  type TEXT,
  UNIQUE (tx),
  UNIQUE (sig),
  PRIMARY KEY(id ASC)
);
