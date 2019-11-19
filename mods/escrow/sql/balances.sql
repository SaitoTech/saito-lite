CREATE TABLE IF NOT EXISTS balances (
  id INTEGER ,
  user_id INTEGER ,
  action TEXT ,
  value INTEGER ,
  balance INTEGER ,
  PRIMARY KEY(id ASC)
);

