CREATE TABLE IF NOT EXISTS leaderboard (
  module TEXT,
  publickey TEXT,
  ranking INTEGER,
  games INTEGER,
  UNIQUE (module, publickey)
);
