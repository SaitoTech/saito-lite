CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER ,
  supplier_id INTEGER DEFAULT 0 ,
  product_id INTEGER DEFAULT 0 ,
  certification_id INTEGER DEFAULT 0 ,

  attachment_filename VARCHAR(255) DEFAULT "",
  attachment_type VARCHAR(255) DEFAULT "",
  attachment_data BLOB DEFAULT "",

  PRIMARY KEY(id ASC)
);

