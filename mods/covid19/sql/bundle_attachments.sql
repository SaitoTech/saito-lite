CREATE TABLE IF NOT EXISTS bundle_attachments (
  id INTEGER ,
  uuid VARCHAR(100) UNIQUE,
  admin VARCHAR(100) ,
 
  bundle_id INTEGER ,
  object_table VARCHAR(100),
  object_id INTEGER,

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);