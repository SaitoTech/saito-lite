CREATE TABLE IF NOT EXISTS games (
  id 		INTEGER,
  player 	TEXT,
  players_needed 	INTEGER,
  players_accepted 	INTEGER,
  players_array TEXT ,
  module	TEXT,
  game_id	TEXT,
  status 	TEXT,
  options 	TEXT,
  tx		TEXT,
  start_bid	INTEGER,
  created_at 	INTEGER,
  expires_at 	INTEGER,
  winner 	TEXT,
  PRIMARY KEY (id ASC)
);
