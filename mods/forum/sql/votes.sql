CREATE TABLE IF NOT EXISTS votes (
          id INTEGER,
          post_id TEXT,
          publickey TEXT,
          UNIQUE (publickey, post_id),
          PRIMARY KEY(id ASC)
)

