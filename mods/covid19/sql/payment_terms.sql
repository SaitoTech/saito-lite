CREATE TABLE IF NOT EXISTS payment_terms (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
  
  payment_terms_name VARCHAR(100) UNIQUE,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);