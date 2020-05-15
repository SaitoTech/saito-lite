CREATE TABLE IF NOT EXISTS items (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
  
  order_id VARCHAR(255) DEFAULT "",
  category_id INTEGER,
  status_id INTEGER ,
  number INTEGER ,
  requirements TEXT,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);