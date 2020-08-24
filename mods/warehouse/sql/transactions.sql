CREATE TABLE IF NOT EXISTS transactions (
    address TEXT, 
    amt TEXT, 
    bid INTEGER,
    tid INTEGER, 
    sid INTEGER, 
    bhash TEXT, 
    lc INTEGER, 
    rebroadcast INTEGER, 
    sig TEXT,
    ts INTEGER,
    block_ts INTEGER,
    type TEXT,
    tx_from TEXT,
    tx_to TEXT,
    name TEXT,
    module TEXT,
    PRIMARY KEY (sig asc)
);
