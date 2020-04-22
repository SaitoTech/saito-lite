CREATE TABLE IF NOT EXISTS products_certifications (

id INTEGER ,
uuid VARCHAR(100) ,
admin VARCHAR(100) ,
product_id INTEGER , 
certification_id INTEGER ,
file TEXT,
file_type TEXT,
file_filename TEXT,
note TEXT ,

deleted INTEGER default 0,

PRIMARY KEY (id)

)