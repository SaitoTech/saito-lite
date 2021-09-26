CREATE TABLE IF NOT EXISTS games (
  id INTEGER,
  game_id TEXT,
  players_needed INTEGER,
  players_array TEXT,
  module TEXT,
  status TEXT,
  options TEXT,
  tx TEXT,
  start_bid INTEGER,
  created_at INTEGER,
  expires_at INTEGER,
  winner TEXT,
  UNIQUE (game_id),
  PRIMARY KEY (id ASC)
);
