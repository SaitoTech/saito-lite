CREATE TABLE IF NOT EXISTS games (
  id 		INTEGER,
  creator 	TEXT,
  winner 	INTEGER,
  status 	TEXT,
  options 	TEXT,
  created_at 	INTEGER,
  expires_at 	INTEGER,
  PRIMARY KEY (id ASC)
);
