'use strict';

class Slip {
  constructor(add="", amt="0", type=0, bid=0, tid=0, sid=0, bsh="", lc=1) {
    //
    // consensus variables
    //
    this.add 	= add;
    this.bid   	= bid;
    this.tid   	= tid;
    this.sid   	= sid;
    this.bsh  	= bsh;
    this.amt 	= amt.toString();
    this.type   = type;

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

  returnSignatureSource() {
    return this.type.toString() + this.bid.toString() + this.tid.toString() + this.sid.toString() + this.bsh + this.amt.toString();
  }

  isNonZeroAmount() {
    if (this.amt === "0" || this.amt === "0.0") { return 1; }
    return 0;
  }

}


module.exports = Slip;


