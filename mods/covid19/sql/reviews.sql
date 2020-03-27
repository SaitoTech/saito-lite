CREATE TABLE IF NOT EXISTS users (
  id INTEGER ,
  reviewee_user_id INTEGER ,
  reviewer_user_id INTEGER ,
  review TEXT ,
  sig TEXT ,
  PRIMARY KEY(id ASC)
);

