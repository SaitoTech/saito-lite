CREATE TABLE IF NOT EXISTS gamestate (
          id INTEGER ,
          game_id TEXT ,
          status TEXT ,
          player TEXT ,
          module TEXT ,
          bid INTEGER ,
          tid INTEGER ,
          lc INTEGER ,
          last_move INTEGER ,
          game_state BLOB ,
          key_state BLOB ,
          PRIMARY KEY (id ASC)
);
