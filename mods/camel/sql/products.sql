CREATE TABLE IF NOT EXISTS products (
  id INTEGER,
  uuid VARCHAR(100) UNIQUE,

  supplier_id INTEGER ,
  category_id INTEGER ,

  product_name VARCHAR(255) ,
  product_details TEXT , 

  product_photo TEXT ,

  published INTEGER default 0,
  deleted INTEGER default 0,

  PRIMARY KEY (id ASC)
);
