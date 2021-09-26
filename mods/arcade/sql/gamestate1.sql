CREATE TABLE IF NOT EXISTS gamestate (
          id INTEGER ,
          game_id TEXT ,
          status TEXT ,
          player TEXT ,
          players_array TEXT ,
          module TEXT ,
          bid INTEGER ,
          tid INTEGER ,
          lc INTEGER ,
          last_move INTEGER ,
          game_state TEXT ,
          tx TEXT ,
          sharekey TEXT ,
          PRIMARY KEY (id ASC)
);
