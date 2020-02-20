CREATE TABLE IF NOT EXISTS posts (
	id INTEGER,
        post_id TEXT,
	comment_id TEXT,
	parent_id TEXT,
        forum TEXT,
        title TEXT,
        content TEXT,
        tx TEXT,
        link TEXT,
        unixtime INTEGER,
        rank INTEGER,
        votes INTEGER,
        comments INTEGER,
        UNIQUE (tx),
        PRIMARY KEY(id ASC)
);


