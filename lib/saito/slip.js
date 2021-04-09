'use strict';

class Slip {
  constructor(add="", amt="0", type=0, bid=0, tid=0, sid=0, bsh="", lc=1) {
    //
    // consensus variables
    //
    this.add 	= add;
    this.bid   	= bid; // block id
    this.tid   	= tid; // tx id
    this.sid   	= sid; // slip id
    this.bsh  	= bsh; // block hash
    this.amt 	= amt.toString();
    this.type   = type;
    this.ts     = 0;  // timestamp <- not in consensus, added by client

    //
    // TYPES
    //
    // 0 = normal output
    // 1 = golden ticket
    // 2 = fee transaction
    // 3 = vip transaction
    // 4 = staking transaction

    // 0 = normal output
    // 1 = block producer payout
    // 2 = miner payout
    // 3 = router payout
    // 4 = staker payout
    // 5 = VIP transaction
    // 6 = golden chunk
    // 7 = rebroadcast
    // 8 = staking, pending
    // 9 = staked, current
    //
    this.type 	= type;

    //
    // non-consensus variables
    //
    this.lc     = lc;

  }

  /* includes bid / sip / tid -- note that when the transaction is signed these are typically 0 for the "to" addresses */
  returnSignatureSource() {
    return this.type.toString() + this.bid.toString() + this.tid.toString() + this.sid.toString() + this.amt.toString();
  }
  /* this allows recreation of those original slips for confirmation */
  returnOriginalSignatureSource() {
    return this.type.toString() + "000" + this.amt.toString();
  }

  isNonZeroAmount() {
    if (this.amt === "0" || this.amt === "0.0") { return 0; }
    return 1;
  }

}


module.exports = Slip;


