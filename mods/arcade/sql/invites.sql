CREATE TABLE IF NOT EXISTS invites (
 id INTEGER,
 game_id TEXT,
 player TEXT,
 acceptance_sig TEXT,
 module TEXT,
 start_bid INTEGER,
 created_at INTEGER,
 expires_at INTEGER,
 UNIQUE (acceptance_sig),
 PRIMARY KEY (id ASC)
);
