CREATE TABLE IF NOT EXISTS posts (
	id INTEGER,
        post_id TEXT,
	comment_id TEXT,
	parent_id TEXT,
        forum TEXT,
        tx TEXT,
        url TEXT,
        unixtime INTEGER,
        rank INTEGER,
        UNIQUE (tx),
        PRIMARY KEY(id ASC)
)


