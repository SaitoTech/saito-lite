CREATE TABLE IF NOT EXISTS posts (
  id INTEGER,
  votes INTEGER,
  rank INTEGER,
  comments INTEGER,
  tx TEXT,
  post_id TEXT,
  reported INTEGER,
  approved INTEGER,
  url TEXT,
  domain TEXT,
  subreddit TEXT,
  unixtime INTEGER,
  unixtime_rank INTEGER,
  UNIQUE (tx),
  PRIMARY KEY(id ASC)
);

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

CREATE TABLE IF NOT EXISTS votes (
  id INTEGER,
  docid TEXT,
  publickey TEXT,
  UNIQUE (publickey, docid),
  PRIMARY KEY(id ASC)
);