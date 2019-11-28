CREATE TABLE IF NOT EXISTS roles (
  id INTEGER,
  publickey TEXT,
  permission TEXT,
  UNIQUE (publickey, permission),
  PRIMARY KEY(id ASC)
);

