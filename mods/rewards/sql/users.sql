CREATE TABLE IF NOT EXISTS users (
    address TEXT,
    tx_count INTEGER,
    games_finished INTEGER,
    game_tx_count INTEGER,
    first_tx INTEGER,
    latest_tx INTEGER,
    last_payout_ts INTEGER,
    last_payout_amt FLOAT,
    total_payout FLOAT,
    total_spend FLOAT,
    referer TEXT,
    PRIMARY KEY (address asc)
);