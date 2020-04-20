CREATE TABLE IF NOT EXISTS categories (
  id INTEGER ,
  name VARCHAR(255) ,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);

