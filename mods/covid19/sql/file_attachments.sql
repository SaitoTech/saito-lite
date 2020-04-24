CREATE TABLE IF NOT EXISTS file_attachments (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
 
  file_id INTEGER ,
  object_table VARCHAR(100),
  object_id INTEGER,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);