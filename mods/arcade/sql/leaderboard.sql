-- Each time a player wins in a game (if enabled)
-- they will increase their score on the leaderboard

-- we can use their pre-existing history to determine
-- output, but for now we'll let gametemplate calculate score for people to wins

CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER,
  module TEXT,
  game_id TEXT,
  tx TEXT,
  bid	INTEGER,
  bsh TEXT,
  timestamp INTEGER,
  sig TEXT,
  winner TEXT,
  score INT,
  UNIQUE (game_id),
  PRIMARY KEY (id ASC)
);

