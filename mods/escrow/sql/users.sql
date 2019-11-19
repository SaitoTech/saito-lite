CREATE TABLE IF NOT EXISTS users (
  id INTEGER ,
  publickey TEXT ,
  email TEXT ,
  phone TEXT ,
  UNIQUE(publickey) ,
  PRIMARY KEY(id ASC)
);

