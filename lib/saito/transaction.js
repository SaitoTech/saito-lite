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
	    // 2 = fee transaction
	    // 3 = vip transaction
            // 4 = staking transaction
	    // 5 = rebroadcast tx
	    //
	    // 6 = rebroadcast staking pending
	    // 7 = rebroadcast staking current
	    // 8 = golden chunk
	    //

    this.transaction.msg           = {};
    this.transaction.ps            = 0;

    this.fees_total		   = "";
    this.work_available_to_me	   = "";
    this.work_available_to_creator = "";
    this.work_cumulative 	   = "0.0";
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

    this.atr_trapdoor		   = "00000000000000000000000000000000000000000000";
    this.atr_rebroadcasting_limit  = 10;  // < 10 SAITO no rebroadcasting

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

  }

  clone() {
    return Object.assign( Object.create( Object.getPrototypeOf(this)), this)
  }




  generateRebroadcastTransaction(creator, tid, sid, avg_fee=2) {

    if (this.transaction.to.length == 0) { return null; }

    var newtx = new saito.transaction();

    newtx.transaction.sig = this.transaction.sig;
    newtx.transaction.ts = this.transaction.ts;
    newtx.transaction.msg = {};

    var fee = Big(avg_fee);
    if (avg_fee == 0) { fee = Big(2); }

    //////////////////
    // rebroadcasts //
    //////////////////
    if (this.transaction.type == 3) { fee = Big(0); }
    if (
      this.transaction.type == 0 || 
      this.transaction.type == 1 || 
      this.transaction.type == 2 || 
      this.transaction.type == 3 || 
      this.transaction.type == 4 || 
      this.transaction.type == 5 || 
      this.transaction.type == 6 || 
      this.transaction.type == 7) {

      newtx.transaction.type = 5;

      //
      // vip transactions stay VIP transactions
      //
      if (this.transaction.type == 3) { newtx.transaction.type = 3; }

      //
      // staking transactions marked current or pending
      //
      if (this.transaction.type == 4) { newtx.transaction.type = 6; }

      //
      // golden chunk
      //
      if (this.transaction.type == 8) {

        newtx.transaction.type = 8;

        //
        // calculate fee
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

      }




      //
      // keep track of how many times we have rebroadcast
      //
      if (this.transaction.msg.loop == undefined) {
        newtx.transaction.msg.loop = 1;
      } else {
        newtx.transaction.msg.loop = this.transaction.msg.loop+1;
      }

      //
      // 
      //
      var amt = Big(this.transaction.to[sid].amt).minus(fee);
      if (amt.lt(0)) {
        fee = Big(this.transaction.to[sid].amt);
        amt = Big(0);
      }

      //
      // attach the original transaction
      //
      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
      } else {
        newtx.transaction.msg.tx = JSON.stringify(this.transaction);
      }

      let from = new saito.slip(creator, this.transaction.to[sid].amt, 5);
          from.tid = tid;
          from.sid = sid;
      let to   = new saito.slip(this.transaction.to[sid].add, amt.toFixed(8), 5);
      let fees = new saito.slip(this.atr_trapdoor, fee.toFixed(8));
      fees.sid = 1;

      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);
      if (fee.gt(0)) {
        newtx.transaction.to.push(fees);
      }

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

    // trapdoor or non-existing slips fall through
    if (this.transaction.to.length == 0) { return false; }
    if (this.transaction.to[sid] == undefined) { return false; }
    if (this.transaction.to[sid].add == this.atr_trapdoor) { return false; }

    // vip transactions always rebroadcast
    if (this.transaction.type == 3)      { return true; }

    // golden chunk always rebroadcast
    if (this.transaction.type == 8)	 { return true; }
 
    // everything else requires money
    if (Big(this.transaction.to[sid].amt).gt(this.atr_rebroadcasting_limit)) { return true; }

    return false;

  }


  involvesPublicKey(publickey) {
    let slips = this.returnSlipsToAndFrom(publickey);
    if (slips.to.length > 0 || slips.from.length > 0) { return 1; }
    return 0;
  }

  returnPaymentTo(publickey) {
    let slips = this.returnSlipsToAndFrom(publickey);
    let x = Big(0.0);
    for (var v = 0; v < slips.to.length; v++) {
      if (slips.to[v].add === publickey) { x = x.plus(Big(slips.to[v].amt)); }
    }
    return x.toFixed(8).replace(/0+$/,'').replace(/\.$/,'\.0');
  }

  returnSlipsFrom(fromAddress) {
    let x = [];
    if (this.transaction.from != null) {
      for (let v = 0; v < this.transaction.from.length; v++) {
        if (this.transaction.from[v].add === fromAddress) { x.push(this.transaction.from[v]); }
      }
    }
    return x;
  }

  returnSlipsToAndFrom(theAddress) {
    let x = {};
    x.from = [];
    x.to = [];
    if (this.transaction.from != null) {
      for (let v = 0; v < this.transaction.from.length; v++) {
        if (this.transaction.from[v].add === theAddress) { x.from.push(this.transaction.from[v]); }
      }
    }
    if (this.transaction.to != null) {
      for (let v = 0; v < this.transaction.to.length; v++) {
        if (this.transaction.to[v].add === theAddress) { x.to.push(this.transaction.to[v]); }
      }
    }
    return x;
  }

  returnSlipsTo(toAddress) {
    let x = [];
    if (this.transaction.to != null) {
      for (let v = 0; v < this.transaction.to.length; v++) {
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





  validate(app, bid=0) {

    if (app.BROWSER == 1 || app.SPVMODE == 1) { return true; }

    if (this.is_valid == 0) { return false; }


    /////////////////////////////////
    // min one sender and receiver //
    /////////////////////////////////
    if (this.transaction.from.length < 1) {
      console.log("ERROR 329380: no from address in transaction");
      return false;
    }
    if (this.transaction.to.length < 1) {
      console.log("ERROR 183092: no to address in transaction");
      return false;
    }

    //////////////////////////
    // no negative payments //
    //////////////////////////
    //
    // all transactions SAVE fee transactions (which introduce 
    // new tokens) need to balance (tokens in must match or be
    // less than tokens out.
    //
    let total_from = Big(0.0);
    if (this.transaction.type != 2) {

      for (let i = 0; i < this.transaction.from.length; i++) {
        total_from = total_from.plus(Big(this.transaction.from[i].amt));
        if (total_from.lt(0)) {
          console.log("ERROR 240812: negative payment in transaction from slip");
          return 0;
        }
      }
      let total_to = Big(0.0);
      for (let i = 0; i < this.transaction.to.length; i++) {
        total_to = total_to.plus(Big(this.transaction.to[i].amt));
        if (total_to.lt(0)) {
          console.log("ERROR 672939: negative payment in transaction to slip");
          return 0;
        }
      }

      if (total_to.gt(total_from)) {
        console.log("ERROR 672939: negative payment to slips > from slips");
        return 0;
      }

    } else {

      //
      // fee transactions are the single type of transaction that can introduce
      // new tokens into circulation. they are thus except from the above check
      //

    }




    /////////////////////////
    // from slips validate //
    /////////////////////////
    //
    // we ignore transactions types without normal FROM inputs:
    //
    //   2 = fee transactions
    //   3 = vip transactions
    //   5 = rebroadcast txs
    //
    if (this.transaction.type != 2 && this.transaction.type != 3 && this.transaction.type != 5) {

      for (let i = 0; i < this.transaction.from.length; i++) {

        if (Big(this.transaction.from[i].amt).gt(0)) {

          //
          // within genesis period
          //
          if (this.transaction.from[i].bid < (bid-app.blockchain.genesis_period)) {
            console.log("ERROR 570030: transaction tries to spend outdated input...");
    	    this.is_valid = 0;
            return false;
          }

          //
          // spends longest chain
          //
          if (this.transaction.from[i].bsh != "") {
            if (app.blockchain.bsh_lc_hmap[this.transaction.from[i].bsh] != 1) {
              console.log("ERROR 185013: transaction tries to spend input off longest chain...");
	      console.log("trying to spend from: " + this.transaction.from[i].bsh + " ----> " + JSON.stringify(this.transaction));
  	      this.is_valid = 0;
              return false;
            }
          }

	  //
	  // unspent in shashmap
	  //
          if (!app.shashmap.validate_slip(this.transaction.from[i].returnSignatureSource(), bid)) {
            console.log("ERROR 570130: cannot validate inputs with shashmap...");
            this.is_valid = 0;
            return false;
	  }
	}
      }
    }


    ///////////////////////
    // Verify Signatures //
    ///////////////////////
    //
    // the signature of the transaction should match the sender of the transaction 
    // for all transactions that originate from users. Transactions created by the 
    // block producer are handled in the next check.
    //
    // normal transactions	(0)
    // golden ticket solutions	(1)
    // staking transactions     (4)
    //
    if (this.transaction.type == 0 || this.transaction.type == 1 || this.transaction.type == 4) {
      if (!app.crypto.verifyMessage(this.returnSignatureSource(app), this.transaction.sig, this.transaction.from[0].add)) {

console.log("WHICH DOES NOT VERIFY? " + JSON.stringify(this.transaction));
console.log(this.returnSignatureSource(app) + " -- " + this.transaction.sig + " -- " + this.transaction.from[0].add);
console.log("----------------\n\n\n");

        console.log("ERROR 141502: signature on normal transaction does not verify");
        return 0;
      }
    }

    ///////////////////////
    // Verify Signatures //
    ///////////////////////
    //
    // all transactions produced by the block producer must be signed by the
    // block producer.
    //
    // fee transaction		(2)
    //
    if (this.transaction.type == 2) {
      if (!app.crypto.verifyMessage(this.returnSignatureSource(app), this.transaction.sig, this.transaction.from[0].add)) {
        console.log("ERROR 374302: signature on 2/3/5/6/7 transaction does not validate");
	console.log(JSON.stringify(this.transaction));
        return 0;
      }
    }


    ///////////////////////
    // Verify Signatures //
    ///////////////////////
    //
    // all VIP transactions must be from the original genesis key, either originally signed or signed REBROADCAST tx
    // all golden chunk transactions must
    // vip transactions		(3)
    //
    if (this.transaction.type == 3) {

      //
      // not implemented yet
      //

    }



    ///////////////////////
    // Verify Signatures //
    ///////////////////////
    //
    // all Golden Chunks must be originals sent to ATR_TRAPDOOR or rebroadcasts of such
    //
    // golden chunk transactions	(8)
    //
    if (this.transaction.type == 8) {

      //
      // Golden Chunk transactions must point to the trapdoor address in order to be considered valid
      //

    }



    ///////////////////////
    // Verify Signatures //
    ///////////////////////
    //
    // validate transactions within transactions
    //
    // rebroadcast transactions (5)
    // rebroadcast staking pending (6)
    // rebroadcast staking current (7)
    //
    // the sending address and TID must also CLAIM to be the same as the original sender, even through 
    // the sig will not validate as it is copied over from the inner transaction.
    //
    if (this.transaction.type == 5 || this.transaction.type == 6 || this.transaction.type == 7) {

      try {

        let txjson			= this.transaction.msg.tx;
        let tx_to_check 		= new saito.transaction(JSON.parse(txjson));
        let sig_source_to_check		= tx_to_check.returnSignatureSource(app);
        let sig_to_check 		= this.transaction.sig;

        if (this.transaction.from[0].add != tx_to_check.transaction.from[0].add) {
          console.log("ERROR 582230: sending address changed in rebroadcast transaction");
console.log("OLD: " + JSON.stringify(tx_to_check.transaction));
console.log("NEW: " + JSON.stringify(this.transaction));
          return 0;
	}

        if (this.transaction.from[0].add != tx_to_check.transaction.from[0].add) {
          console.log("ERROR 137104: sending address changed in rebroadcast transaction");
console.log("OLD: " + JSON.stringify(tx_to_check.transaction));
console.log("NEW: " + JSON.stringify(this.transaction));
          return 0;
	}

        if (!app.crypto.verifyMessage(sig_source_to_check, sig_to_check, tx_to_check.transaction.from[0].add)) {
          console.log("ERROR 137109: signature on original tx in rebroadcast transaction is invalid");
          return 0;
        }

      } catch (err) {
          console.log("ERROR 578203: malformed rebroadcast transaction (original tx missing?)");
          return 0;
      }

    }


    return true;
  }

}
module.exports = Transaction;



