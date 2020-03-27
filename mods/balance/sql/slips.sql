CREATE TABLE IF NOT EXISTS slips (
  address TEXT,
  bid INTEGER,
  tid INTEGER,
  sid INTEGER,
  bsh TEXT,
  amt REAL,
  type INTEGER,
  lc INTEGER,
  shash TEXT,
  PRIMARY KEY (shash asc)
);