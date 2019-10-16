CREATE TABLE IF NOT EXISTS records (
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

