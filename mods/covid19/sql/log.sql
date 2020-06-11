CREATE TABLE IF NOT EXISTS log (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,

  ts INTEGER ,
  author VARCHAR(255) ,
  order_id INTEGER ,

  public INTEGER ,
  type VARCHAR(255) ,

  body TEXT ,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);