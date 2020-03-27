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

  //
  // suggestion - price is provided in single form, with a TEXT field 
  // to provide additional notes such as volume discounts / tranches 
  // or details on additional cost FOB etc.
  //
  product_cost_rmb INTEGER ,
  product_cost_notes TEXT ,
  product_cost_payment_terms VARCHAR(255) ,

  production_stock INTEGER ,
  production_daily_capacity INTEGER ,
  production_minimum_order INTEGER ,

  product_specification TEXT ,
 
  PRIMARY KEY(id ASC)
);

