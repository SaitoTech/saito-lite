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
