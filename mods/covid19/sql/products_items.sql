CREATE TABLE IF NOT EXISTS products_items (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
  
  product_id INTEGER ,
  item_id INTEGER , 
  
  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);