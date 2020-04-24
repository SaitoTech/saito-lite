CREATE TABLE IF NOT EXISTS bundles (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
 
  name varchar(100) ,
  description TEXT ,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);