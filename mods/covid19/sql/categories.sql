CREATE TABLE IF NOT EXISTS categories (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  name VARCHAR(255) ,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);