CREATE TABLE IF NOT EXISTS scans (
  id INTEGER,
  uuid VARCHAR(100) UNIQUE,

  admin VARCHAR(100),

  target_id VARCHAR(200),
  scan_time INT, 
  product_id VARCHAR(100),
  scan_type VARCHAR(32),

  PRIMARY KEY (uuid ASC)
);
