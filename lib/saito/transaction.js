const Big      = require('big.js');
const saito    = require('./saito');

/**
 * Transaction Constructor
 * @param {*} txobj
 */
class Transaction {

  constructor(txobj=null) {

    /////////////////////////
    // consensus variables //
    /////////////////////////
    this.transaction               = {};
    this.transaction.id            = 1;
    this.transaction.from          = [];
    this.transaction.to            = [];
    this.transaction.ts            = new Date().getTime();
    this.transaction.sig           = "";  // sig of tx
    this.transaction.ver           = 1.0;
    this.transaction.path          = [];
    this.transaction.type          = 0;

	    //
	    // TYPES
	    //
	    // 0 = normal output
	    // 1 = golden ticket
	    // 2 = block payment
	    //
	    //# 3 = VIP transaction
	    //# 4 = golden chunk
	    //# 5 = rebroadcast
	    //# 6 = staking
	    //

					 // 0 = normal
                                        // 1 = golden ticket
                                        // 2 = fee transaction
                                        // 3 = rebroadcasting
                                        // 4 = VIP rebroadcast
                                        // 5 = floating coinbase / golden chunk
                                        // 6 = staking pending rebroadcast
	                                // 7 = staking current
    this.transaction.msg           = {};
    this.transaction.ps            = 0;

    this.fees_total		 = "";
    this.work_available_to_me	 = "";
    this.work_available_to_creator = "";
    this.work_cumulative 		 = "0.0";
    				          // cumulative fees, inc. fees in this reflect
                                          // how much this transaction carries in the
                                          // weight of the block. we use this to find
                                          // the winning node in the block for the
                                          // routing payment. i.e. this measures the
                                          // cumulative weight of the usable fees that
                                          // are behind the transactions.

    this.dmsg			   = "";
    this.size                      = 0;
    this.is_valid                  = 1;

    this.atr_trapdoor		   = "0";

    if (txobj != null) {
      try {
        this.transaction = txobj;
        this.transaction.from = this.transaction.from.map(slip => {
          let {add,amt,type,bid,tid,sid,bsh} = slip;
          return new saito.slip(add,amt,type,bid,tid,sid,bsh);
        });

        this.transaction.to = this.transaction.to.map(slip => {
          let {add,amt,type,bid,tid,sid,bsh} = slip;
          return new saito.slip(add,amt,type,bid,tid,sid,bsh);
        });

      } catch (err) {
        this.is_valid = 0;
      }
    }

    return this;
  }

  clone() {
    return Object.assign( Object.create( Object.getPrototypeOf(this)), this)
  }

  generateRebroadcastTransaction(tid, sid, avg_fee=2) {

    if (this.transaction.to.length == 0) { return null; }

    var newtx = new saito.transaction();
    newtx.transaction.sig = this.transaction.sig;
    newtx.transaction.msg = {};
    newtx.transaction.ts  = new Date().getTime();

    var fee = Big(avg_fee);
    if (avg_fee == 0) { fee = Big(2); }


    /////////////////////////
    // normal rebroadcasts //
    /////////////////////////
    if (this.transaction.type >= 0 && this.transaction.type <= 3) {

      newtx.transaction.type = 3;
      if (this.transaction.msg.loop == undefined) {
        newtx.transaction.msg.loop = 1;
      } else {
        newtx.transaction.msg.loop = this.transaction.msg.loop+1;
      }


      //
      // disable exponential looping fee
      //
      //for (i = 1; i < newtx.transaction.msg.loop; i++) { fee = fee.times(2); }

      var amt = Big(this.transaction.to[sid].amt).minus(fee);
      if (amt.lt(0)) {
        fee = Big(this.transaction.to[sid].amt);
        amt = Big(0);
      }

      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
      } else {
        newtx.transaction.msg.tx = this.stringify(2);
      }

      let from = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 3);
          from.tid = tid;
          from.sid = sid;
      let to   = new saito.slip(this.transaction.to[sid].add, amt.toFixed(8), 3);
      let fees = new saito.slip(this.atr_trapdoor, fee.toFixed(8));
      fees.sid = 1;

      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);
      newtx.transaction.to.push(fees);

    }


    ///////////////////////////
    // prestige rebroadcasts //
    ///////////////////////////
    if (this.transaction.type == 4) {

      newtx.transaction.type = this.transaction.type;

      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
      } else {
        newtx.transaction.msg.tx = this.stringify(2);
      }

      var from = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 4);
          from.tid = tid;
          from.sid = sid;
      var to   = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 4);
      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);

    }



    //////////////////
    // golden chunk //
    //////////////////
    if (this.transaction.type == 5) {

      newtx.transaction.type = this.transaction.type;

      // calculate fee
      //
      // average fee * 10
      //
      var fee = Big(Big(avg_fee).times(10).toFixed(8));

      //
      // minimum of 20
      //
      if (fee.lt(20)) { fee = Big(20); }
      var amt = Big(this.transaction.to[sid].amt).minus(fee);
      if (amt.lt(0)) {
        fee = Big(this.transaction.to[sid].amt);
        amt = Big(0);
      }

      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
      } else {
        newtx.transaction.msg.tx = this.stringify(2);
      }

      var from = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 5);
          from.tid = tid;
          from.sid = sid;
      var to   = new saito.slip(this.transaction.to[sid].add, amt.toFixed(8), 5);
      var fees = new saito.slip(this.atr_trapdoor_address, fee.toFixed(8));
      fees.sid = 1;

      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);
      newtx.transaction.to.push(fees);   // this ensures fee falls into money supply

    }
    return newtx;
  }





  isFrom(senderPublicKey) {
    if (this.returnSlipsFrom(senderPublicKey).length != 0) { return true; }
    return false;
  }

  isTo(receiverPublicKey) {
    if (this.returnSlipsTo(receiverPublicKey).length > 0) { return true; }
    return false;
  }

  isGoldenTicket() {
    if (this.transaction.type == 1) { return 1; }
    return 0;
  }

  isRebroadcast(oldblk, newblk, sid) {

    //
    // fee-capture and golden tickets never rebroadcast
    //
    // if (this.transaction.type == 1) 				         { logger.info('no 1'); return false; }
    // if (this.transaction.type == 2) 				         { logger.info('no 2'); return false; }
    // if (this.transaction.type == 3) 				         { logger.info('no 3'); return false; }
    //
    // Golden Chunk transactions must point to the trapdoor address in order to be considered valid
    //
    if (this.transaction.to[sid].add  == this.atr_trapdoor) {
      if (this.transaction.to[sid].type == 5) { return true; }
      return false;
    }

    if (this.transaction.to.length == 0) { return false; }
    if (this.transaction.type == 4)      { return true; }
    if (Big(this.transaction.to[sid].amt).gt(this.atr_rebroadcasting_limit)) { return true; }

    return false;

  }


  involvesPublicKey(publickey) {
    let slips = this.returnSlipsToAndFrom(publickey);
    if (slips.to.length > 0 || slips.from.length > 0) { return 1; }
    return 0;
  }

  returnSlipsFrom(fromAddress) {
    var x = [];
    if (this.transaction.from != null) {
      for (var v = 0; v < this.transaction.from.length; v++) {
        if (this.transaction.from[v].add === fromAddress) { x.push(this.transaction.from[v]); }
      }
    }
    return x;
  }

  returnSlipsToAndFrom(theAddress) {
    var x = {};
    x.from = [];
    x.to = [];
    if (this.transaction.from != null) {
      for (var v = 0; v < this.transaction.from.length; v++) {
        if (this.transaction.from[v].add === theAddress) { x.from.push(this.transaction.from[v]); }
      }
    }
    if (this.transaction.to != null) {
      for (var v = 0; v < this.transaction.to.length; v++) {
        if (this.transaction.to[v].add === theAddress) { x.to.push(this.transaction.to[v]); }
      }
    }
    return x;
  }

  returnSlipsTo(toAddress) {
    var x = [];
    if (this.transaction.to != null) {
      for (var v = 0; v < this.transaction.to.length; v++) {
        if (this.transaction.to[v].add === toAddress) { x.push(this.transaction.to[v]); }
      }
    }
    return x;
  }

  decryptMessage(app) {
    try { this.dmsg = app.keys.decryptMessage(this.transaction.from[0].add, this.transaction.msg); } catch (e) {}
  }

  returnMessage() {
    if (this.dmsg != "") { return this.dmsg; }
    return this.transaction.msg;
  }

  returnSignature(app) {
    if (this.transaction.sig != "") { return this.transaction.sig; }
    this.transaction.sig = app.wallet.signMessage(this.returnSignatureSource(app));
    return this.transaction.sig;
  }

  returnSignatureSource(app) {
    // return this.transaction.sig;
    return `${this.transaction.ts}${this.transaction.ps}${this.transaction.type}`;
  }

  returnFees(app) {

    if (this.fees_total == "") {

      //
      // sum inputs
      //
      let inputs = Big(0.0);
      if (this.transaction.from != null) {
        for (let v = 0; v < this.transaction.from.length; v++) {
          inputs = inputs.plus(Big(this.transaction.from[v].amt));
        }
      }

      //
      // sum outputs
      //
      let outputs = Big(0.0);
      for (let v = 0; v < this.transaction.to.length; v++) {

        //
        // only count non-gt transaction outputs
        //
        if (this.transaction.to[v].type != 1 && this.transaction.to[v].type != 2) {
          outputs = outputs.plus(Big(this.transaction.to[v].amt));
        }
      }

      let tx_fees = inputs.minus(outputs);
      this.fees_total = tx_fees.toFixed(8);
    }

    return this.fees_total;
  }


  returnRoutingWorkAvailable(app, publickey="") {

    let uf =  Big(this.returnFees(app));

    for (let i = 0; i < this.transaction.path.length; i++) {
      let d = 1;
      for (let j = i; j > 0; j--) { d = d*2; }
      uf = uf.div(d);
    }

    return uf.toFixed(8);

  }






  validate(app, mode=0, bid=null) {

    if (app.BROWSER == 1 || app.SPVMODE == 1) { return true; }

    if (this.is_valid == 0) { return false; }


    /////////////////////////////////
    // min one sender and receiver //
    /////////////////////////////////
    if (this.transaction.from.length < 1) {
      logger.info("ERROR 329380: no from address in transaction");
      return false;
    }
    if (this.transaction.to.length < 1) {
      logger.info("ERROR 183092: no to address in transaction");
      return false;
    }

    //////////////////////////
    // no negative payments //
    //////////////////////////
    let total_from = Big(0.0);


    //
    // block payment transactions do not need to balance
    // as they will have inputs that are zero.
    //
    if (this.transaction.type != 2) {

      for (let i = 0; i < this.transaction.from.length; i++) {
        total_from = total_from.plus(Big(this.transaction.from[i].amt));
        if (total_from.lt(0)) {
          logger.info("ERROR 240812: negative payment in transaction from slip");
          return 0;
        }
      }
      let total_to = Big(0.0);
      for (let i = 0; i < this.transaction.to.length; i++) {
        total_to = total_to.plus(Big(this.transaction.to[i].amt));
        if (total_to.lt(0)) {
          logger.info("ERROR 672939: negative payment in transaction to slip");
          return 0;
        }
      }
      if (this.transaction.type == 0 || this.transaction.type >= 3) {
        if (total_to.gt(total_from)) {
          logger.info("ERROR 672939: negative payment to slips > from slips");
          return 0;
        }
      }

    } else {


    }

    ////////////////////
    // slips validate //
    ////////////////////
    for (let i = 0; i < this.transaction.from.length; i++) {

      //
      // golden tickets etc. have 0 input amts in from slips
      //
      if (Big(this.transaction.from[i].amt).gt(0)) {

        //
        // check input is within genesis period
        //
        if (this.transaction.from[i].bid < (bid-app.blockchain.genesis_period)) {
          logger.info("ERROR 570030: transaction tries to spend outdated input...");
  	  this.is_valid = 0;
          return false;
        }

        //
        // check is spending longest chain
        //
        if (this.transaction.from[i].bsh != "") {
          if (app.blockchain.bsh_lc_hmap[this.transaction.from[i].bsh] != 1) {
            logger.info("ERROR 185013: transaction tries to spend outdated input...");
  	    this.is_valid = 0;
            return false;
          }
        }

	//
	// check in shashmap
	//
        if (!app.shashmap.validate_slip(this.transaction.from[i].returnSignatureSource(), bid)) {
          this.is_valid = 0;
          return false;
	}
      }
    }


    ///////////////////
    // sigs validate //
    ///////////////////
    if (this.transaction.type == 0) {

      if (!app.crypto.verifyMessage(this.returnSignatureSource(app), this.transaction.sig, this.transaction.from[0].add)) {
        logger.info("ERROR 137102: signature on normal transaction does not verify");
        return 0;
      }

    }

    if (this.transaction.type == 1) { 
    }
    if (this.transaction.type == 2) { 
    }
    if (this.transaction.type == 3) { 
    }
    if (this.transaction.type == 4) {

      //
      // only genesis key can create
      //
      //if (this.transaction.from[0].add != app.GENESIS_PUBLICKEY) {
      //  logger.info("ERROR 047230: unapproved VIP transaction - we have to pay fees to support the network, folks!");
      //  return 0;
      //}

    }
    if (this.transaction.type == 5) {

      //if (this.transaction.from[0].add != app.GENESIS_PUBLICKEY) {
      //  logger.info("ERROR 091324: unapproved VIP transaction - we have to pay fees to support the network, folks!");
      //  return 0;
      //}

    }
    if (this.transaction.type == 6) {
    }
    if (this.transaction.type == 7) {
    }

    return true;
  }

}
module.exports = Transaction;



