CREATE TABLE IF NOT EXISTS comments (
  id INTEGER,
  votes INTEGER,
  post_id TEXT,
  comment_id TEXT,
  parent_id TEXT,
  reported INTEGER,
  approved INTEGER,
  tx TEXT,
  unixtime INTEGER,
  UNIQUE (tx),
  PRIMARY KEY(id ASC)
);