CREATE TABLE IF NOT EXISTS files (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
  
  file_filename VARCHAR(255) DEFAULT "",
  file_type VARCHAR(255) DEFAULT "",
  file_data TEXT ,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);

