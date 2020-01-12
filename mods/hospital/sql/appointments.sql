CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER ,
  hospital_id INTEGER ,
  patient TEXT,
  date INTEGER , 
  time INTEGER , 
  type TEXT ,
  tx BLOB,
  PRIMARY KEY(id ASC)
);

