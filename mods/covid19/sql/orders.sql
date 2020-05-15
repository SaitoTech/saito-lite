CREATE TABLE IF NOT EXISTS orders (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
  
  order_name VARCHAR(255) DEFAULT "",
  details TEXT ,
  requirements TEXT,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);