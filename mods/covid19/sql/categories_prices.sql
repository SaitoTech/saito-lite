CREATE TABLE IF NOT EXISTS categories_prices (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,

  category_id INTEGER ,
  price FLOAT ,
  capactity INTEGER,
  ts INTEGER ,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);

