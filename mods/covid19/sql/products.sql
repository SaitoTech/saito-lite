CREATE TABLE IF NOT EXISTS products (

  id INTEGER ,
  supplier_id INTEGER ,
  category_id INTEGER ,

  product_name VARCHAR(255) , 
  product_specification VARCHAR(255) ,
  product_description TEXT ,
  product_dimensions VARCHAR(255) ,
  product_weight VARCHAR(255) ,
  product_quantities VARCHAR(255) ,
  product_photo TEXT , 

  pricing_per_unit_rmb VARCHAR(255) ,
  pricing_per_unit_public VARCHAR(255) ,
  pricing_notes TEXT ,
  pricing_notes_public TEXT ,
  pricing_payment_terms VARCHAR(255) ,

  production_stock VARCHAR(255) ,
  production_daily_capacity VARCHAR(255) ,
  production_minimum_order VARCHAR(255) ,
 
  PRIMARY KEY(id ASC)
);

