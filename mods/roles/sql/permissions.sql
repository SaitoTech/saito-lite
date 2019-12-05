CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER,
  parent_id INTEGER,
  child_id INTEGER,
  publickey TEXT,
  UNIQUE (publickey, permission),
  PRIMARY KEY(id ASC)
);

