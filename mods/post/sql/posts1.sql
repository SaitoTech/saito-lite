CREATE TABLE IF NOT EXISTS posts (
      id TEXT,
      thread_id TEXT,
      parent_id TEXT,
      type TEXT,
      publickey TEXT,
      title TEXT,
      text TEXT,
      forum TEXT,
      link TEXT,
      img TEXT,
      lite_tx BLOB,
      tx BLOB,
      ts INTEGER,
      children INTEGER,
      flagged INTEGER ,
      deleted INTEGER ,
      PRIMARY KEY(id DESC)
);

