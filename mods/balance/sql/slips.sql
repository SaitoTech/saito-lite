CREATE TABLE IF NOT EXISTS slips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT,
  bid INTEGER,
  tid INTEGER,
  sid INTEGER,
  bsh TEXT,
  amt VARCHAR(30),
  type INTEGER,
  lc INTEGER,
  spent INTEGER,
  paid INTEGER DEFAULT 1,
  shash TEXT,
  UNIQUE(address, bid, tid, sid, bsh)
);
