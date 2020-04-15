CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(100) ,
  admin VARCHAR(100) ,
  publickey TEXT ,
  name TEXT ,
  address TEXT ,
  phone VARCHAR(255) ,
  email VARCHAR(255) ,
  wechat VARCHAR(255) ,
  notes TEXT , 
  PRIMARY KEY(id ASC)
);

