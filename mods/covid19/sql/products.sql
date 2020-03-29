CREATE TABLE IF NOT EXISTS products (

  id INTEGER ,
  supplier_id INTEGER ,
  category_id INTEGER ,

  product_name TEXT , 
  product_specification TEXT ,
  product_description TEXT ,
  product_dimensions TEXT ,
  product_weight TEXT ,
  product_quantities TEXT ,

  product_photo TEXT , 

  pricing_per_unit_rmb INTEGER ,
  pricing_notes TEXT ,
  pricing_payment_terms VARCHAR(255) ,

  production_stock INTEGER ,
  production_daily_capacity INTEGER ,
  production_minimum_order INTEGER ,
 
  PRIMARY KEY(id ASC)
);

