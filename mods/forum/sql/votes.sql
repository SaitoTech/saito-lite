CREATE TABLE IF NOT EXISTS votes (
          id INTEGER,
          post_id TEXT,
          type TEXT,
          publickey TEXT,
          UNIQUE (publickey, post_id),
          PRIMARY KEY(id ASC)
)

