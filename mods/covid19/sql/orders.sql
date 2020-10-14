CREATE TABLE IF NOT EXISTS orders (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,

  order_name VARCHAR(255) DEFAULT "",
  order_number VARCHAR(255) DEFAULT "",
  order_status INTEGER DEFAULT 0 ,
  details TEXT ,
  requirements TEXT,
  pricing_mode VARCHAR(255) DEFAULT "",

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);