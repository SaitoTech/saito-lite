CREATE TABLE IF NOT EXISTS explorer_tx (
    id INTEGER, 
    address TEXT, 
    amt TEXT, 
    bid INTEGER, 
    tid INTEGER, 
    sid INTEGER, 
    bhash TEXT, 
    lc INTEGER, 
    rebroadcast INTEGER, 
    PRIMARY KEY (id ASC)
);