CREATE TABLE IF NOT EXISTS roles_roles (
  id INTEGER,
  parent_id INTEGER,
  child_id INTEGER,
  publickey TEXT,
  UNIQUE (publickey, permission),
  PRIMARY KEY(id ASC)
);

