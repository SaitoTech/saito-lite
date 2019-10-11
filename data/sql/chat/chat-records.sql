CREATE TABLE IF NOT EXISTS records (
  id INTEGER,
  sig TEXT,
  tx TEXT,
  message TEXT,
  timestamp INTEGER,
  author TEXT,
  room_id TEXT,
  UNIQUE (tx),
  UNIQUE (sig),
  PRIMARY KEY(id ASC)
);