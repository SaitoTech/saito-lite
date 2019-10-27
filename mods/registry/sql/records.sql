CREATE TABLE IF NOT EXISTS records (
  id INTEGER,
  identifier TEXT,
  publickey TEXT,
  unixtime INTEGER,
  bid INTEGER,
  bsh TEXT,
  lock_block INTEGER DEFAULT 0,
  sig TEXT,
  signer TEXT,
  lc INTEGER,
  UNIQUE (identifier),
  PRIMARY KEY(id ASC)
);

