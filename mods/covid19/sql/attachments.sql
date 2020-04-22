CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER ,
  uuid VARCHAR(100) ,
  admin VARCHAR(100) ,
  supplier_id INTEGER DEFAULT 0 ,
  product_id INTEGER DEFAULT 0 ,
  certification_id INTEGER DEFAULT 0 ,

  attachment_filename VARCHAR(255) DEFAULT "",
  attachment_type VARCHAR(255) DEFAULT "",
  attachment_data BLOB DEFAULT "",

  deleted INTEGER default 0,

  PRIMARY KEY(id ASC)
);

