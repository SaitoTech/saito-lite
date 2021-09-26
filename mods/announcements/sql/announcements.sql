CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER ,
  publickey TEXT ,
  announcement TEXT ,
  created_at INTEGER ,
  UNIQUE (id, publickey)
);
