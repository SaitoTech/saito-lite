CREATE TABLE IF NOT EXISTS posts (
      id TEXT,
      thread_id TEXT,
      parent_id TEXT,
      type TEXT,
      author TEXT,
      content TEXT,
      post_transaction TEXT,
      ts INTEGER,
      children INTEGER,
      deleted INTEGER,
      PRIMARY KEY(id DESC)
);
