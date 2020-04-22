CREATE TABLE IF NOT EXISTS certifications (

  id INTEGER ,
  uuid VARCHAR(100) ,
  name TEXT ,

  deleted INTEGER default 0,
 
  PRIMARY KEY(id ASC)
);

