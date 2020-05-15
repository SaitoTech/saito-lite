CREATE TABLE IF NOT EXISTS statuses (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
  
  status_name VARCHAR(100) UNIQUE,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);