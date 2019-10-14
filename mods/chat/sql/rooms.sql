CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER,
  roomhash TEXT,
  publickey TEXT,
  name TEXT,
  tx TEXT,
  UNIQUE(roomhash, publickey),
  PRIMARY KEY(id ASC)
);
