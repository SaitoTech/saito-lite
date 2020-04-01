CREATE TABLE IF NOT EXISTS products_certifications (

id INTEGER ,
product_id INTEGER , 
certification_id INTEGER ,
file TEXT,
file_type TEXT,
file_filename TEXT,
note TEXT ,
PRIMARY KEY (id)

)