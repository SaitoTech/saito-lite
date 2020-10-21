CREATE TABLE IF NOT EXISTS balances (
  id INTEGER ,
  bid INTEGER ,
  bsh TEXT ,
  block_total_fees TEXT ,
  block_usable_fees TEXT ,
  block_producer_payout TEXT ,
  block_lockup TEXT ,
  stake_pending VARCHAR(255) ,
  stake_current VARCHAR(255) ,
  treasury VARCHAR(255) ,
  block_payout VARCHAR(255) ,
  PRIMARY KEY(id ASC)
);

