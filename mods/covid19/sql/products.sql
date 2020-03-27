CREATE TABLE IF NOT EXISTS products (
  id INTEGER ,
  supplier TEXT,
  product_name VARCHAR(255) ,
  product_photo BLOB ,
  product_standard VARCHAR(255) ,
  production_in_stock INTEGER ,
  production_capacity INTEGER ,
  minimum_order_quantity INTEGER ,
  cost_per_unit VARCHAR(255) ,
  cost_per_unit_fob VARCHAR(255) , 
);

