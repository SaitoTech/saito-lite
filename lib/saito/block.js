const Big = require('big.js');
const saito = require('./saito');

class Block {

  constructor(app, blkobj = null, confirmations = -1) {

    this.app = app || {};

    //
    // consensus variables
    //
    this.block 		        = {};
    this.block.ts 	      	= new Date().getTime();
    this.block.prevbsh 		= "";
    this.block.merkle 	  	= "";
    this.block.creator 	  	= "";
    this.block.id 	      	= 1;
    this.block.bf 	      	= 0; 
    this.block.difficulty 	= 0.0;
    this.block.paysplit 	= 0.5;
    this.block.powsplit 	= 0.5;
    this.block.mt 		= Big("2868000000.0");  // mining treasury
    this.block.st 	      	= Big("100000.0"); 	// staking treasury
                                                        //
                                                        // TODO - fix treasury amount
                                                        //
    this.block.ss		= 0;			// staker slips
    this.block.sa		= 0;			// staked amount


    this.block.reclaimed 	= Big("0.0");		// tokens that fall off the chain because of the production of this
							// block. These will come from two places:
							//
							//  - calculateRebroadcast - in UTXO not rebroadcast
							//  - calculateBlockPayments - in payments not issued
							//

    //
    // when chain is reorganized... we keep track of the next bsh
    // in order to be able to update our staking slips with the 
    // bsh of the next block, and set the "next_slip" appropriately
    //
    this.nextbsh		= "";

    //
    // coinbase
    // 
    this.mc		        = "0.0";		// mining coinbase
    this.sc		        = "0.0";		// staking coinbase
    this.staker_pos		= -1;
    this.staker_bid		= -1;
    this.staker_sis		= -1;
    this.staker_slip		= "";

    //
    // hashmaps
    //
    this.txs_hmap		= [];


    //
    // block transactions
    //
    this.transactions = [];


    //
    // callbacks
    //
    this.callbacks  	= [];
    this.callbacksTx 	= [];


    //
    // non-consensus variables
    //
    this.maxtid 		= 0;
    this.mintid 		= 0;
    this.avgfee 		= 0;

    this.size           = 0;           // size in bytes
    this.hash 		= "";          // block hash == hash(this.prehash+last_block.hash)
    this.prehash 	= "";          // hash of signature
    this.filename 	= "";          // name of file on disk if set

    this.confirmations = confirmations;


    this.is_valid = 1;           // set to zero if there is an issue on generation
    this.validates = 0;          // set to 1 once we have proactively validated


    //
    // import block headers - transactions processed separately
    //
    if (blkobj != null) {
      try {
        this.block = blkobj.block;
        //this.transactions = blkobj.transactions.map(tx => new saito.transaction(tx.transaction));
      } catch (err) {
	// avoid map returning null
        //this.transactions = [];
        console.log("invalid block");
        console.log(err);
        this.is_valid = 0;
        return;
      }
    }

  }



  affixCallbacks() {
    for (let z = 0; z < this.transactions.length; z++) {
      var txmsg = this.transactions[z].returnMessage();
      this.app.modules.affixCallbacks(this.transactions[z], z, txmsg, this.callbacks, this.callbacksTx, this.app);
    }
  }



  async bundle(prevblk=null) {

    let mintxid = 1;

    //
    // default values
    //
    if (prevblk != null) {

      this.block.id 		= prevblk.block.id + 1;

      this.block.mt		= Big(prevblk.block.mt).plus(Big(prevblk.block.reclaimed));
      this.mc	 		= Big(this.block.mt).div(this.app.blockchain.genesis_period).toFixed(8);
      this.block.mt	 	= this.block.mt.minus(Big(this.mc)).toFixed(8);

      this.block.st 		= Big(prevblk.block.st);
      this.sc	 		= Big(prevblk.block.st).div(this.app.blockchain.genesis_period).toFixed(8);
      //this.block.st	 	= this.block.st.minus(Big(this.sc)).toFixed(8);

      this.block.ss             = prevblk.block.ss;  // staked slips
      this.block.sa             = prevblk.block.sa;  // staked amounts

      this.block.prevbsh 	= prevblk.returnHash();
      this.block.difficulty 	= prevblk.block.difficulty;
      this.block.paysplit 	= prevblk.block.paysplit;
      this.block.powsplit 	= prevblk.block.powsplit;
      this.block.ts		= new Date().getTime();
      this.block.bf 		= this.app.burnfee.returnBurnFee(prevblk, this);
      if (prevblk.transactions.length == 0) {
        mintxid			= prevblk.returnMaxTxId();
        if (mintxid == 0) 	{ mintxid = 1; }
      } else {
        mintxid			= prevblk.returnMaxTxId() + 1;
      }
    }

    //
    // initial token distribution
    //
    if (this.block.id == 1) {
//1HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf
      let tx = new saito.transaction();
      tx.transaction.to.push(new saito.slip(
	"zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.type = 3;
      tx.transaction.from.push(new saito.slip(
	this.app.wallet.returnPublicKey() ,
	5000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.id = 1;
      tx = this.app.wallet.signTransaction(tx);
      this.transactions.push(tx);

      //
      // pending staking tx
      //
      tx = new saito.transaction();
      tx.transaction.to.push(new saito.slip(
	"STAKING1WBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMM",
	6000000,
	4,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.type = 4;
      tx.transaction.from.push(new saito.slip(
	this.app.wallet.returnPublicKey() ,
	6000000,
	4,
	0,
	0,
	0,
	"",
	1
      ));
      tx = this.app.wallet.signTransaction(tx);
      this.transactions.push(tx);
    }

    //
    // check the block falling off the chain
    //
    let eblkd = await this.calculateRebroadcasts();

    //
    // reclaimed txs
    //
    this.block.reclaimed = eblkd.reclaimed;


    //
    // remove expired staking slips and number (track staked)
    //
    this.block.ss -= eblkd.ss;		// integer
    this.block.sa = Big(this.block.sa).minus(Big(eblkd.sa)).toFixed(8); // big


    //
    // automatic transaction rebroadcasting (added 1-by-1 at end of tx set)
    //
    let rebroadcast_amt = Big(0.0);
    for (let i = 0; i < eblkd.rebroadcast.length; i++) {
      for (let ii = 0; ii < eblkd.rebroadcast[i].transaction.to.length; ii++) {
        rebroadcast_amt = rebroadcast_amt.plus(Big(eblkd.rebroadcast[i].transaction.to[ii].amt));
      }
      this.transactions.push(eblkd.rebroadcast[i]);
    }

    //
    // transactions
    //
    let normalized_staker_payout = 0;
    let number_of_golden_tickets = 0;
    let index_of_golden_ticket = -1;
    let golden_ticket_solution = null;

    for (let i = 0; i < this.transactions.length; i++) {

      //
      // sequential ids
      //
      this.transactions[i].transaction.id = (mintxid + i);

      //
      // golden ticket
      //
      if (this.transactions[i].transaction.type == 1) {

        number_of_golden_tickets++;
	index_of_golden_ticket = i;
        golden_ticket_solution = this.transactions[i].returnMessage();

        if (number_of_golden_tickets > 1) {
	  console.log("ERROR 412523: second golden ticket found in block");
          this.is_valid = 0;
          return this;
        }

        if (golden_ticket_solution.target != prevblk.returnHash()) {
          console.log("golden ticket does not solve previous block, thus isn't valid...");
          this.is_valid = 0;
          return this;
        }

      }

      //
      // staking transactions = 4
      //
      if (this.transactions[i].transaction.type == 4) {
	for (let ii = 0; ii < this.transactions[i].transaction.to.length; ii++) {
	  if (this.transactions[i].transaction.to[ii].isNonZeroAmount()) {
	    if (this.transactions[i].transaction.to[ii].type == 4) {


	      //
	      // update consensus variables as we process the transactions
	      //
	      // we have to handle our manually created fee-transaction below
	      // but this approach lets us validate by checking all the txs
	      //
	      this.block.ss++;
	      this.block.sa = Big(this.block.sa).plus(Big(this.transactions[i].transaction.to[ii].amt)).toFixed(8);
	    }
	  }
	}
      }


      //
      // hashmap of txs
      //
      for (let ii = 0; ii < this.transactions[i].transaction.from.length; ii++) { this.txs_hmap[this.transactions[i].transaction.from[ii].add] = 1; }
      for (let ii = 0; ii < this.transactions[i].transaction.to.length; ii++) { this.txs_hmap[this.transactions[i].transaction.to[ii].add] = 1; }

    }

    //
    // fees and monetary policy
    //
    let slips = [];

    if (prevblk != null) {


      //
      // pass golden ticket into previous block 
      //
      let payments = await prevblk.calculateBlockPayments(golden_ticket_solution);

      if (payments) {

        if (payments.producer_share > 0) {
          slips.push(new saito.slip(payments.producer_publickey, payments.producer_share, 2));
        }
        if (payments.miner_share > 0) {
          slips.push(new saito.slip(payments.miner_publickey, payments.miner_share, 2));
        }
        if (payments.router_share > 0) {
          slips.push(new saito.slip(payments.router_publickey, payments.router_share, 2));
        }

        //
	// handle staker payments
	//
	if (this.containsGoldenTicket() == 1 && this.block.id > 1) {


	  //
  	  // now issue payments
	  //
	  // TODO - cap on producer income based on final math on proportionality of attack
	  //
          if (payments.sproducer_share > 0) {
            slips.push(new saito.slip(payments.sproducer_publickey, payments.sproducer_share, 2));
          }
          if (payments.srouter_share >= 0) {
            slips.push(new saito.slip(payments.srouter_publickey, payments.srouter_share, 2));
          }
          if (payments.staker_share >= 0) {

            //
            // what is actually paid out?
            //
	    let staker_slip = this.app.blockchain.index.stakers[payments.staker_pos][payments.staker_sid];


	    normalized_staker_payout = this.returnNormalizedStakerPayment(staker_slip.slip.amt, this.sc, prevblk.block.sa, prevblk.block.ss);


            //
            // increment ss and adjust fees into total staked
            //
	    this.block.ss++;
	    this.block.sa = Big(this.block.sa).plus(normalized_staker_payout).toFixed(8);


	    //
	    // increase by staker share, reduce by payout
	    //
	    this.block.st = Big(this.block.st).plus(Big(payments.staker_share)).minus(normalized_staker_payout).toFixed(8);


  	    //
	    // TODO -- add small percentage chance of slip being sent as normal transaction - preventing 
	    // build-up of stake forever in the event that the staker is unable to move or liquidate
	    // their tokens and thus triggering calamitous deflation that can never be addressed. Note that 
            // blockchain.validate() will insert type=4 (staking) slips for both 2/4 type txs. So fees will
	    // be paid to stakers as more staking.
	    //
            slips.push(new saito.slip(payments.staker_publickey, normalized_staker_payout, 4));


	  }
	}
      }


      if (slips.length > 0) {

        let newtx = new saito.transaction();
            newtx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0, 2));
            newtx.transaction.to = slips;
            newtx.transaction.type = 2;

            //
            // including for reference
            //
            newtx.transaction.id  = mintxid + this.transactions.length;
            newtx.msg = payments;
            newtx = this.app.wallet.signTransaction(newtx);
            this.transactions.push(newtx);

      }
    }

    //
    // merkle root
    //
    this.block.merkle = this.returnMerkleRoot();

    return this;

  }




  //
  // in validation mode, we provide list of TXS to check
  //
  async calculateRebroadcasts(txs=null) {

    let expiring_data = { 
      reclaimed: "0.0", 
      ss: 0, 
      sa: "0.0", 
      rebroadcast: [], 
      total_rebroadcast: 0
    }
    let needs_rebroadcast = 0;

    if (this.app.BROWSER == 1 || this.app.SPVMODE == 1) { return expiring_data; }

    //
    // eliminated block id
    //
    let eblk_id = this.block.id - this.app.blockchain.genesis_period - 1;
    if (eblk_id < 1) { return expiring_data; }

    let unspent_amt = Big(0.0);

    let hash_of_eblock = this.app.blockchain.bid_bsh_hmap[eblk_id];
    let eblk = await this.app.storage.loadBlockByHash(hash_of_eblock);

    for (let i = 0; i < eblk.transactions.length; i++) {
      for (var ii = 0; ii < eblk.transactions[i].transaction.to.length; ii++) {

        let slip 	= eblk.transactions[i].transaction.to[ii];
        slip.bid   	= eblk.returnId();
        slip.tid   	= eblk.transactions[i].transaction.id;
        slip.bsh 	= eblk.returnHash();
        slip.sid 	= ii;

        if (Big(slip.amt).gt(0)) {

  	  //
	  // track staking slips that are removed
	  //
          if (slip.type == 4) {
	    expiring_data.sa = Big(expiring_data.sa).plus(slip.amt); 
	    expiring_data.ss++;
	  }


          if (this.app.shashmap.validate_slip(slip.returnSignatureSource(), this.block.id)) {
            if (eblk.transactions[i].isRebroadcast(eblk, this, ii)) {

	      //
	      // number of slips rebroadcast as TXS
	      //
              expiring_data.total_rebroadcast++;

              //
              // create rebroadcast tx
              //
              let tx = eblk.transactions[i].generateRebroadcastTransaction(this.block.creator, slip.tid, slip.sid, 2);
              if (tx == null) {
                console.log("ERROR 481029: issue generating rebroadcast transaction...");
                process.exit();
              }

              //
              // update tx with bid
              //
              for (let iii = 0; iii < tx.transaction.from.length; iii++) {
                tx.transaction.from[iii].bid = this.block.id;
              }

              expiring_data.rebroadcast.push(tx);

            } else {
              unspent_amt = unspent_amt.plus(Big(slip.amt));
              expiring_data.reclaimed = unspent_amt.toFixed(8);
            }
          }
        }
      }
    }

    return expiring_data;
  }

  containsGoldenTicket() {
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].isGoldenTicket() == 1) {
        return 1;
      }
    }
    return 0;
  }

  decryptTransactions() {
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].involvesPublicKey(this.app.wallet.returnPublicKey()) == 1) {
        this.transactions[i].decryptMessage(this.app);
      }
    }
  }

  returnFilename() {
    return this.block.ts + "-" + this.returnHash() + ".blk";
  }

  returnRoutingWorkNeeded() {
    return this.block.bf.current;
  }

  returnDifficulty() {
    return this.block.difficulty;
  }

  returnEmbeddedRoutingWork() {

    let v = Big(0);

    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].is_valid == 1) {

	//
	// fee transactions don't count for work as they are auto-added
	//
        if (this.transactions[i].transaction.type != 2) {

          let available_work = Big(this.transactions[i].returnRoutingWorkAvailable(this.app, this.block.creator));
          if (this.transactions[i].transaction.type == 1) {
	    let txmsg = this.transactions[i].returnMessage();
            if (txmsg.target != this.prevbsh) { available_work = Big(0); }
          }
          v = v.plus(available_work);

        }
      }
    }
    return v.toFixed(8);
  }


  returnHash() {
    if (this.hash != "") { return this.hash; }
    this.prehash = this.app.crypto.hash(this.returnFingerprint());
    this.hash = this.app.crypto.hash(this.prehash + this.block.prevbsh);
    return this.hash;
  }


  returnId() {
    return this.block.id;
  }

  returnMaxTxId() {
    if (this.maxtid != 0) { return this.maxtid; }
    for (var z = 0; z < this.transactions.length; z++) {
      if (this.transactions[z].transaction.id > this.maxtid) {
        this.maxtid = this.transactions[z].transaction.id;
      }
    }
    return this.maxtid;
  }

  returnMinTxId() {
    if (this.mintid != 0) { return this.mintid; }
    if (this.transactions.length == 0) { return this.app.blockchain.returnMinTxId(); };
    this.mintid = this.transactions[0].transaction.id;
    for (var z = 1; z < this.transactions.length; z++) {
      if (this.transactions[z].transaction.id < this.mintid) {
        this.mintid = this.transactions[z].transaction.id;
      }
    }
    return this.mintid;
  }

  returnPaysplit() {
    return this.block.paysplit;
  }

  returnPowsplit() {
    return this.block.powsplit;
  }

  returnReclaimed() {
    return this.block.reclaimed;
  }

  returnFingerprint() {
    return JSON.stringify(this.block);
  };

  returnNormalizedStakerPayment(amt, staking_coinbase, staked_amount, total_stakers) {

    if (Big(staking_coinbase).eq(0)) { return "0"; }

    let x = Big(staked_amount).div(Big(total_stakers));
    let y = Big(amt).div(x);
    let z = Big(staking_coinbase).times(y).toFixed(8);
    return z;
  }

  returnTreasury() {
    return this.block.mt;
  }

  async runCallbacks(conf, run_callbacks=1) {
    if (this.confirmations && this.callbacks) {
      for (let i = this.confirmations + 1; i <= conf; i++) {
        for (let ii = 0; ii < this.callbacks.length; ii++) {
          try {
            if (run_callbacks == 1) {
              await this.callbacks[ii](this, this.transactions[this.callbacksTx[ii]], i, this.app);
            }
          } catch(err) {
            console.log("ERROR 567567: ", err);
          }
        }
      }

    }

    this.confirmations = conf;
  }

  spendInputs() {
    for (let i = 0; i < this.transactions.length; i++) {
      for (let ii = 0; ii < this.transactions[i].transaction.from.length; ii++) {
        if (this.transactions[i].transaction.from[ii].amt > 0) {
	  this.app.shashmap.insert_slip(this.transactions[i].transaction.from[ii].returnSignatureSource(), this.block.id);
        }
      }
    }
    return 1;
  }

  unspendInputs() {
    for (let b = 0; b < this.transactions.length; b++) {
      for (let bb = 0; bb < this.transactions[b].transaction.from.length; bb++) {
        if (this.transactions[b].transaction.from[bb].amt > 0) {
          this.app.shashmap.insert_slip(this.transactions[b].transaction.from[bb].returnSignatureSource(), -1);
        }
      }
    }
    return 1;
  }





  async validate() {

    if (this.block.prevbsh == "") { return 1; }

    let reclaimed = "0";
    let prevblk = await this.app.blockchain.returnBlockByHash(this.block.prevbsh, 1);


    //
    // ghost block? here you go, valid...
    // 
    if (this.ghost == 1) { return 1; }

    let mintxid = 1;
    if (prevblk != null) {

      //
      // building off a ghost block? here you go, this one is valid...
      // -- ghost blocks are synced by hash on initial connect
      //
      if (prevblk.ghost == 1) { return 1; }

      if (prevblk.transactions.length == 0) {
        mintxid = prevblk.returnMaxTxId();
        if (mintxid == 0) { mintxid = 1; }
      } else {
        mintxid = prevblk.returnMaxTxId()+1;
      }
    } else {
      return 1;
    }

    //
    // set staking coinbase
    //
    this.sc = Big(prevblk.block.st).div(this.app.blockchain.genesis_period).toFixed(8);

    //
    // check block headers
    //
    if (this.block.id != (prevblk.block.id+1)) {
      console.log("ERROR 482039: block id is not single increment over previous block");
      return 0;
    }

    //
    // treasury not present in auto-synced blocks
    //
    let mt = Big(prevblk.block.mt).plus(Big(prevblk.block.reclaimed));
    let mc = Big(mt).div(this.app.blockchain.genesis_period).toFixed(8);
        mt = mt.minus(Big(mc)).toFixed(8);

    if (this.block.mt != mt) {
      console.log("ERROR 410829: block treasury does not validate in new block");
      console.log(this.block.mt + " -- vs -- " + mt + " ---> " + prevblk.block.mt + " -- " + prevblk.block.reclaimed);
      return 0;
    }
    if (this.block.difficulty != prevblk.block.difficulty) {
      console.log("ERROR 571928: block difficulty does not validate in new block");
      return 0;
    }
    if (this.block.paysplit != prevblk.block.paysplit) {
      console.log("ERROR 571928: block paysplit does not validate in new block");
      return 0;
    }
    if (this.block.powsplit != prevblk.block.powsplit) {
      console.log("ERROR 571928: block difficulty does not validate in new block");
      return 0;
    }

    let bf = this.app.burnfee.returnBurnFee(prevblk, this);
    if (this.block.bf != bf) {
      console.log("ERROR 571928: block difficulty does not validate in new block");
      return 0;
    }

    //
    // my timestamp must be bigger than last timestamp
    //
    if (prevblk.block.ts >= this.block.ts) {
      console.log("ERROR 729384: block timestamp not incremented from previous block");
      return 0;
    }


    let hmap = [];
    let slips = [];
    let number_of_golden_tickets = 0;
    let index_of_block_payment = -1;
    let index_of_golden_ticket = -1;
    let block_contains_spv_tx = 0;

    let block_st = prevblk.block.st;
    let block_ss = prevblk.block.ss;
    let block_sa = prevblk.block.sa;
    let staking_slips_added = 0;
    let staking_amount_added = "0.0";

    for (let i = 0; i <= this.transactions.length-1; i++) {

      if (this.transactions[i].transaction.type == 9) { block_contains_spv_tx = 1; }

      //
      // sequential ids (unless spv)
      //
      if (this.transactions[i].transaction.id != (mintxid + i)) {
        if (block_contains_spv_tx == 0) {
          console.log("ERROR 517324: transaction ids are out-of-order when validating block - " + mintxid + "-" + i + " ------- " + this.transactions[i].transaction.id);
          return 0;
	}
      }

      //
      // transaction type 1 == golden ticket
      //
      if (this.transactions[i].transaction.type == 1) {

        index_of_golden_ticket = i;
	let gtmsg = this.transactions[i].returnMessage();

        if (gtmsg.target != prevblk.returnHash()) {
          console.log("ERROR 029312: golden ticket does not match prevblk hash");
          return 0;
        } else {

          number_of_golden_tickets++;
          if (number_of_golden_tickets > 1) {
            console.log("ERROR 189842: two golden tickets in block");
            return 0;
          }

          if (this.app.blockchain.isFullySynced() == 1 && this.app.BROWSER == 0 && this.app.SPVMODE == 0) {

            //
            // prevblk is not null here
            //
            let payments = await prevblk.calculateBlockPayments(gtmsg);

//console.log("\n\n\ntime: " + new Date().getTime());
//console.log("VALIDATE Block Payouts: ");
//console.log("Producer:  " + payments.producer_share);
//console.log("Miner:     " + payments.miner_share);
//console.log("Router:    " + payments.router_share);
//console.log("SProducer: " + payments.sproducer_share);
//console.log("Staker:    " + payments.staker_share);
//console.log("SRouter:   " + payments.srouter_share);

            if (payments.producer_share > 0) {
              slips.push(new saito.slip(payments.producer_publickey, payments.producer_share, 2));
            }
            if (payments.miner_share > 0) {
              slips.push(new saito.slip(payments.miner_publickey, payments.miner_share, 2));
            }
            if (payments.router_share > 0) {
              slips.push(new saito.slip(payments.router_publickey, payments.router_share, 2));
            }

	    if (this.containsGoldenTicket() == 1 && this.block.id > 1) {
              if (payments.sproducer_share > 0) {
                slips.push(new saito.slip(payments.sproducer_publickey, payments.sproducer_share, 2));
              }
              if (payments.srouter_share > 0) {
                slips.push(new saito.slip(payments.srouter_publickey, payments.srouter_share, 2));
              }
              if (payments.staker_share > 0) {

                //
                // check payment to staking treasury
                //
		let winning_slip_amt = this.app.blockchain.index.stakers[payments.staker_pos][payments.staker_sid].slip.amt;
		let normalized_staker_payout = this.returnNormalizedStakerPayment(winning_slip_amt, this.sc, prevblk.block.sa, prevblk.block.ss);

		//
		// add new staking slip to staking treasury
		//
		// commenting out sa change - Sunday April 5
                //block_sa = Big(block_sa).plus(Big(payments.staker_share)).toFixed(8);
	        //
		// because there is a payout OUT, there is a payout IN to the treasury (out processed below)
		//
                block_st = Big(block_st).plus(Big(payments.staker_share)).toFixed(8);
                block_st = Big(block_st).minus(Big(normalized_staker_payout));

                slips.push(new saito.slip(payments.staker_publickey, normalized_staker_payout, 4));
  	        this.app.shashmap.spend_slipidx(payments.staker_slip, this.block.id);
		this.app.blockchain.index.stakers[payments.staker_pos][payments.staker_sid].paid = -1;

		this.app.blockchain.lowest_unspent_bid = this.app.blockchain.index.blocks[payments.staker_pos].block.id;
		this.app.blockchain.lowest_unspent_pos = payments.staker_pos;


              }
            }

            for (let x = 0; x < slips.length; x++) { slips[x].sid = x; }
          }
	}
      }

      //
      // transaction type 2 == fee transaction always follows golden ticket (if exists)
      //
      if (this.transactions[i].transaction.type == 2) {

        if (index_of_block_payment != -1) {
          console.log("ERROR 581029: two block paymeet (type=2) transactions in block");
          return 0;
        }
        index_of_block_payment = i;

	//
	// staking slips
	//
	for (let ii = 0; ii < this.transactions[i].transaction.to.length; ii++) {
	  if (this.transactions[i].transaction.to[ii].type == 4) {
	    if (this.transactions[i].transaction.to[ii].isNonZeroAmount()) {
              block_ss++;
    	      block_sa = Big(block_sa).plus(Big(this.transactions[i].transaction.to[ii].amt)).toFixed(8);
	    }
	  }
	}
      }



      //
      // transaction type 4 == staking transactions (track slips)
      //
      if (this.transactions[i].transaction.type == 4) {
	for (let ii = 0; ii < this.transactions[i].transaction.to.length; ii++) {
	  if (this.transactions[i].transaction.to[ii].type == 4) {
	    if (this.transactions[i].transaction.to[ii].isNonZeroAmount()) {
              block_ss++;
    	      block_sa = Big(block_sa).plus(Big(this.transactions[i].transaction.to[ii].amt)).toFixed(8);
	    }
	  }
	}
      }

      //
      // no duplicate inputs slips
      //
      for (let j = 0; j < this.transactions[i].transaction.from.length; j++) {
        if (hmap[this.transactions[i].transaction.from[j].returnSignatureSource()] != undefined) {
          console.log("ERROR 820493: multiple transactions spend same input detected");
          console.log("\n\n\nTHESE ARE THE SLIPS: ");
          for (let x = 0; x < this.transactions.length; x++) {
            for (let y = 0; y < this.transactions[x].transaction.from.length; y++) {
              console.log(x + " -- " + y + " ==> " + JSON.stringify(this.transactions[x].transaction.from[y]));
            }
          }
          return 0;
        }
        if (this.transactions[i].transaction.from[j].amt > 0) {
          hmap[this.transactions[i].transaction.from[j].returnSignatureSource()] = 1;
        }
      }

      //
      // validate transactions
      //
      if (!this.transactions[i].validate(this.app, this.block.id)) {
        console.log(`ERROR 174233: block contains invalid transaction: ${i}`);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("!!!!!!!!!!!!    ERROR    !!!!!!!!!!!!!!");
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        this.transactions[i].is_valid = 0;
        return 0;
      }
    }

    //
    // golden tickets must pay out - check integrity of fees
    //
    if (index_of_golden_ticket > -1) {
      if (index_of_block_payment == -1) {
          console.log("ERROR 697812: golden ticket in block, but not block payment transaction");
          return 0;
      } else {

        if (this.app.blockchain.isFullySynced() == 1 && this.app.BROWSER == 0 && this.app.SPVMODE == 0) {

          //
          // check payment slips accurate by comparing hash of our generated-slips with what we received
          //
	  if (slips.length != this.transactions[index_of_block_payment].transaction.to.length) { 
	    console.log("ERROR 513234: golden ticket to slip length inaccurate");
	    return 0; 
	  }
	  for (let z = 0; z < slips.length; z++) {
	    slips[z].bsh = this.transactions[index_of_block_payment].transaction.to[z].bsh;
	    slips[z].bid = this.transactions[index_of_block_payment].transaction.to[z].bid;
	    slips[z].tid = this.transactions[index_of_block_payment].transaction.to[z].tid;
	    slips[z].sid = this.transactions[index_of_block_payment].transaction.to[z].sid;
	    this.transactions[index_of_block_payment].transaction.to[z].lc = 1;			// only validate LC stuff, so avoid this being
												// wrong in case of chain re-org and then the
												// need to validate older blocks with this data
												// set to something else
	  }
          if (this.app.crypto.hash(JSON.stringify(slips)) == this.app.crypto.hash(JSON.stringify(this.transactions[index_of_block_payment].transaction.to))) {
          } else {
            console.log("ERROR 840192: to slips in block fee transaction invalid");
            console.log("RECOVERED SLIPS: ", slips);
            console.log("TX TO SLIPS", this.transactions[index_of_block_payment].transaction.to);
            return 0;
          } 
        }
      }

      //
      // only validate monetary policy if fully-synced with full block history
      //
      if (this.app.blockchain.isFullySynced() == 1 && this.app.BROWSER == 0 && this.app.SPVMODE == 0) {

        let eblkd	= await this.calculateRebroadcasts(this.transactions);

	let removed_staking_slips = eblkd.ss;
	let removed_staking_amount = eblkd.sa;
	block_ss -= removed_staking_slips;
	block_sa = Big(block_sa).minus(removed_staking_amount).toFixed(8);


	//
	// staking treasury / slips / 
	//
//console.log("\n\n\ntime: " + new Date().getTime());
//console.log("DOES SS and SA validate?");
//console.log(" ss " + block_ss + " -- " + this.block.ss); // block is ahead 1
//console.log(" sa " + block_sa + " -- " + this.block.sa); // i am ahead of the block
//console.log(" st " + block_st + " -- " + this.block.st); // this validates perfectly
	if (block_ss !== this.block.ss) {
          console.log("ERROR 432810: total staked slips not accurate: " + block_ss + " vs " + this.block.ss);
          return 0;
	}
	if (Big(block_sa).toFixed(8) !== this.block.sa) {
          console.log("ERROR 432810: total staked amount not accurate: " + block_sa + " vs " + this.block.sa);
          return 0;
	}
	if (Big(block_st).toFixed(8) !== this.block.st) {
          console.log("ERROR 432810: total staker treasury not accurate: " + block_st + " vs " + this.block.st);
          return 0;
	}


        //
        // reclaimed txs
        //
        reclaimed = Big(reclaimed).plus(Big(eblkd.reclaimed));
        if (!Big(this.block.reclaimed).eq(reclaimed)) {
          console.log("ERROR 241948: reclaimed funds do not match expected when validating");
          return 0;
        };

        //
        // atr validates
        //
        // the last transaction in any block will be the fee-transaction. ATR transactions
	// are BEFORE that, added in the order that that are generated. So we check that 
	// all of the transactions are good.
	//
	let atr_idx = this.transactions.length-1;
        if (atr_idx > 0) {
	  if (this.transactions[atr_idx].transaction.type == 2) { atr_idx--; }
          if (atr_idx > 0) {
    	    for (let i = eblkd.rebroadcast.length-1; i >= 0; i--) {
	      eblkd.rebroadcast[i].transaction.id = this.transactions[atr_idx].transaction.id;
	      if (JSON.stringify(eblkd.rebroadcast[i].transaction) != JSON.stringify(this.transactions[atr_idx].transaction)) {
                console.log("ERROR 549280: rebroadcast txs JSON outputs not as expected");
               return 0;
	      }
	      atr_idx--;
	    } 
	  }
	}

	//
	// no superfluous atr txs sneaking in
	// 
	for (let i = atr_idx; i > 0; i--) {
	  if (
	    this.transactions[i].transaction.type == 5 ||
	    this.transactions[i].transaction.type == 6 ||
	    this.transactions[i].transaction.type == 7
	  ) {
            console.log("ERROR 004222: block chains rebroadcast transactions outside appropriate range");
            return 0;
	  }
	}
      }
    }

    //
    // check merkle root
    //
    if (this.block.merkle != this.returnMerkleRoot()) {
      console.log("ERROR 258102: merkle root does not match provided root");
      return 0;
    }


    //
    // check difficulty and paysplit
    //

    //
    // check payments are OK
    //

//  } catch (err) {
//    console.log("ERROR 921842: unknown error while validating block...: " + err);
//    return 0;
//  }

    //
    // make note that we've done this work
    //
    this.validates = 1;
    return 1;

  }







  //
  // calculate Block Payments
  //
  // this calculates who would get paid for the last two blocks in the event that 
  // a golden ticket was found for this block.
  //
  // note -- the payment amounts are inaccurate forhte staker -- they return what should 
  // flow into the staker.treasury instead of the amount that should be paid to the staker
  // . the code that receives this should handle this manually based on whether the funds
  // are issued, and what precentage of stake the winner has.
  //
  async calculateBlockPayments(gt=null) {

    //
    // if we are not fully synced, we cannot calculate
    // block payments so just return the golden ticket
    // provided.
    //
/**** if not fully synced.... 
    if (this.app.blockchain.isFullySynced() == 0) {
      if (gt != null) { return gt; }
    }
*/

    //
    // invalid blocks can through errors, so skip
    //
    if (this.is_valid == 0) { return {}; }

    let payments = {};

        payments.producer_publickey 	= "";
        payments.producer_share 	= "0.0";
        payments.miner_publickey 	= "";
        payments.miner_share 		= "0.0";
        payments.router_publickey 	= "";
        payments.router_share 		= "0.0";

        payments.sproducer_publickey 	= "";
        payments.sproducer_share 	= "0.0";
        payments.srouter_publickey 	= "";
        payments.srouter_share 		= "0.0";
        payments.staker_publickey 	= "";
        payments.staker_share 		= "0.0";
        payments.staker_bid 		= -1;
        payments.staker_sid 		= -1;
        payments.staker_pos 		= -1;
        payments.staker_slip 		= null;

    let prevbsh = null;
    let prevblk = null;
    let prevprevbsh = null;
    let prevprevblk = null;

    if (this.block.prevbsh != "") { 
      prevbsh = this.block.prevbsh;
      prevblk = await this.app.blockchain.returnBlockByHash(prevbsh, 1);
    }
    if (prevblk != null) { 
      prevprevbsh = prevblk.block.prevbsh;
      prevprevblk = await this.app.blockchain.returnBlockByHash(prevprevbsh, 1);
    }

    //
    // block one - who is owed what?
    //
    var producer_publickey            	= "";
    var miner_publickey               	= "";
    var router_publickey              	= "";
    if (this.block.creator != null) 	{ producer_publickey = this.block.creator; }
    if (gt != null)			{ miner_publickey = gt.publickey; }

    var total_work_needed_block1       	= 0;
    var total_work_available_block1  	= 0;
    var total_fees_in_block_block1     	= 0;

    if (prevblk != null) {
      total_work_needed_block1	 	= this.app.burnfee.returnWorkNeeded(prevblk.block.ts, this.block.ts, prevblk.block.bf); // int
      total_work_available_block1	= this.returnEmbeddedRoutingWork();     // string
      total_fees_in_block_block1 	= this.returnFees();                    // string
      this.sc	 		        = Big(prevblk.block.st).div(this.app.blockchain.genesis_period).toFixed(8);
    }

    //
    // must set before we use it to validate
    //
    this.mc	 		= Big(this.block.mt).div(this.app.blockchain.genesis_period).toFixed(8);

    var producer_share                	= Big(total_work_available_block1).minus(Big(total_work_needed_block1)); // Big
    var paysplit_share                	= Big(total_fees_in_block_block1).minus(producer_share).plus(this.mc); // Big
    var miner_share                   	= paysplit_share.div(2).toFixed(8);     // string
    var router_share                  	= paysplit_share.minus(Big(miner_share)).toFixed(8); // string

    //
    // block two - who is owed what?
    //
    var sproducer_publickey             = "";
    if (prevblk != null) { sproducer_publickey = prevblk.block.creator; }

    var staker_publickey                = "";
    var staker_bid                      = -1;
    var staker_sid                      = -1;
    var staker_pos                      = -1;
    var staker_slip                     = null;
    var srouter_publickey         	= "";

    var total_work_needed_block2       	= 0;
    var total_work_available_block2  	= 0;
    var total_fees_in_block_block2     	= 0;

    if (prevprevblk != null) {
      total_work_needed_block2	 	= this.app.burnfee.returnWorkNeeded(prevprevblk.block.ts, prevblk.block.ts, prevprevblk.block.bf); // int
      total_work_available_block2	= this.returnEmbeddedRoutingWork();     // string
      total_fees_in_block_block2 	= this.returnFees();                    // string
    }

    var sproducer_share                 = 0;
    var spaysplit_share                 = 0;
    var staker_share                    = 0;
    var srouter_share                   = 0;

    if (prevblk != null) {
      sproducer_share                 = Big(total_work_available_block2).minus(Big(total_work_needed_block2)); // Big
      prevblk.mc	 	      = Big(prevblk.block.mt).div(this.app.blockchain.genesis_period).toFixed(8);
      spaysplit_share                 = Big(total_fees_in_block_block2).minus(sproducer_share).plus(prevblk.mc); // Big
      staker_share                    = spaysplit_share.div(2).toFixed(8);     // string
      srouter_share                   = spaysplit_share.minus(Big(staker_share)).toFixed(8); // string
    }


    //
    // random numbers for picking winners
    //
    let r = "0";
    if (gt != null) { if (gt.random != undefined) { r = gt.random; } }

    let winnerHash = this.app.crypto.hash(r).slice(0,12);
    let winnerHash2 = this.app.crypto.hash(winnerHash).slice(0,12);
    let winnerHash3 = this.app.crypto.hash(winnerHash2).slice(0,12);
    let winnerHash4 = this.app.crypto.hash(winnerHash3).slice(0,12);


    //
    // block 1 miner (above)
    //

    //
    // block 1 producer (above)
    //

    //
    // block 1 router
    //
    if (Big(router_share).gt(0)) {

      //
      // random decimal between 0-1 picks winning tx
      //
      let maxHash    = "ffffffffffff";
      let winnerNum  = parseInt(winnerHash, 16); // 16 = num is hex
      let maxNum     = parseInt(maxHash, 16);    // 16 = num is hex
      let winnerDec  = winnerNum / maxNum;

      let winner_fee = Big(total_fees_in_block_block1).times(winnerDec);

      let winning_tx_idx = -1;
      let cumulative_fee = Big(0.0);
      let stop = 0;


      //
      // TODO - faster search algorithm - find winning tx
      //
      for (let i = 0; i < this.transactions.length && stop == 0; i++) {
        cumulative_fee.plus(Big(this.transactions[i].returnFees(this.app)));
        if (cumulative_fee.gte(winner_fee)) {
          stop = 1;
          winning_tx_idx = i;
        }
      }


      //
      // assign winners
      //
      if (winning_tx_idx == -1) {
        router_publickey = this.block.creator;
      }


      //
      // or find winning router
      //
      else {

        let winning_tx = this.transactions[winning_tx_idx];

        //
        // no path info, default to sender
        //
        if (winning_tx.transaction.path.length == 0) {
          router_publickey = winning_tx.transaction.from[0].add;
        }

        //
        // path info, repeat random generation
        //
        let winner2Hash = winnerHash2;
        let winner2Num  = parseInt(winner2Hash, 16);
        let winner2Dec  = winner2Num / maxNum;

        let pathlength = winning_tx.transaction.path.length;
        let pathtotal  = winning_tx.returnFees(this.app);

        if (winner2Dec == 0) {
          router_publickey = winning_tx.transaction.path[0].to;
        } else {

          if (winnerDec == 1) {
            router_publickey = winning_tx.transaction.path[pathlength].to;
          } else {

            let y = pathlength;
            let x = 2 - (1/(Math.pow(2,(y-1))));  // i.e. 1.75 for 3 node path
            let z = y * winner2Dec;

            for (let i = 0; i < pathlength; i++) {
              let a = 2 - (1/(Math.pow(2,(i-1))));
              if (a <= z) { router_publickey = winning_tx.transaction.path[i].to; }
            }
          }
        }
      }
    }


    //
    // pick block producer
    //

    //
    // pick the staker
    //
    let x = this.app.blockchain.returnWinningStaker(gt, winnerHash3, this.block.id);

    staker_publickey = x.publickey;
    staker_bid = x.staker_bid;
    staker_sid = x.staker_sid;
    staker_pos = x.staker_pos;
    staker_slip = x.staker_slip;

    //
    // pick the staker router
    //
    if (Big(srouter_share).gt(0)) {

      //
      // random decimal between 0-1 picks winning tx
      //
      let maxHash    = "ffffffffffff";
      let winnerNum  = parseInt(winnerHash3, 16); // 16 = num is hex
      let maxNum     = parseInt(maxHash, 16);    // 16 = num is hex
      let winnerDec  = winnerNum / maxNum;

      let winner_fee = Big(total_fees_in_block_block2).times(winnerDec);

      let winning_tx_idx = -1;
      let cumulative_fee = Big(0.0);
      let stop = 0;

      //
      // TODO - faster search algorithm - find winning tx randomly
      //
      for (let i = 0; i < prevblk.transactions.length && stop == 0; i++) {
        cumulative_fee.plus(Big(prevblk.transactions[i].returnFees(this.app)));
        if (cumulative_fee.gte(winner_fee)) {
          stop = 1;
          winning_tx_idx = i;
        }
      }

      //
      // assign winners
      //
      if (winning_tx_idx == -1) {
        srouter_publickey = prevblk.block.creator;
      }

      //
      // or find winner in routing portion
      //
      else {

        let winning_tx = prevblk.transactions[winning_tx_idx];

        //
        // no path info, default to sender
        //
        if (winning_tx.transaction.path.length == 0) {

          srouter_publickey = winning_tx.transaction.from[0].add;

        } else {

          //
          // path info, repeat random generation
          //
          let winner2Hash = winnerHash4;
          let winner2Num  = parseInt(winner2Hash, 16);
          let winner2Dec  = winner2Num / maxNum;

          let pathlength = winning_tx.transaction.path.length;
          let pathtotal  = winning_tx.returnFees(this.app);

          if (winner2Dec == 0) {
            srouter_publickey = winning_tx.transaction.path[0].to;
          } else {

            if (winnerDec == 1) {
              srouter_publickey = winning_tx.transaction.path[pathlength].to;
            } else {

              let y = pathlength;
              let x = 2 - (1/(Math.pow(2,(y-1))));  // i.e. 1.75 for 3 node path
              let z = y * winner2Dec;

              for (let i = 0; i < pathlength; i++) {
                let a = 2 - (1/(Math.pow(2,(i-1))));
                if (a <= z) { srouter_publickey = winning_tx.transaction.path[i].to; }
              }

            }
          }
        }
      }
    }


    //
    // and put it all together
    // 
    payments.producer_publickey	= producer_publickey;
    payments.miner_publickey 	= miner_publickey;
    payments.router_publickey	= router_publickey;
    payments.staker_publickey	= staker_publickey;
    payments.srouter_publickey	= srouter_publickey;
    payments.sproducer_publickey= sproducer_publickey;


    payments.producer_share	= producer_share.toFixed(8);
    payments.miner_share	= miner_share;
    payments.staker_share	= staker_share;
    payments.router_share	= router_share;
    payments.sproducer_share	= sproducer_share.toFixed(8);
    payments.srouter_share	= srouter_share;
    payments.staker_share	= staker_share;
    payments.staker_share	= staker_share;
    payments.staker_pos         = staker_pos;
    payments.staker_bid         = staker_bid;
    payments.staker_sid         = staker_sid;
    payments.staker_slip	= staker_slip;

    payments.total_fees_in_block_block1      	= total_fees_in_block_block1;
    payments.total_work_needed_block1     	= total_work_needed_block1;
    payments.total_work_available_block1     	= total_work_available_block1;

    payments.total_fees_in_block_block2      	= total_fees_in_block_block2;
    payments.total_work_needed_block2   	= total_work_needed_block2;
    payments.total_work_available_block2     	= total_work_available_block2;

    return payments;

  }




  returnFees() {
    let v = Big(0);
    for (let i = 0; i < this.transactions.length; i++) {
      v = v.plus(Big(this.transactions[i].returnFees(this.app)));
    }
    return v.toFixed(8);
  }


  // Use this when we're saving data to disk
  returnBlockFileData() {
    let blkcontent = {
      block: JSON.parse(JSON.stringify(this.block)),
      transactions: JSON.parse(JSON.stringify(this.transactions))
    };
    return JSON.stringify(blkcontent);
  }
  returnBlockHeaderData() {
    let blkcontent = {
      block: JSON.parse(JSON.stringify(this.block)),
    };
    return JSON.stringify(blkcontent);
  }




  //
  // returns a lite-version of the block
  //
  returnLiteBlock(bsh, keylist) {

    let pruned_transactions = [];

    //
    // generate lite-txs
    //
    for (let i = 0; i < this.transactions.length; i++) {

      let add_this_tx = 0;

      for (let k = 0; k < keylist.length; k++) {
	if (this.transactions[i].involvesPublicKey(keylist[k])) {

	  // add transaction
	  add_this_tx = 1;
	  k = keylist.length;

	}
      }


      if (add_this_tx == 1) {
        pruned_transactions.push(this.transactions[i]);
      } else {

        // add spv transaction
	let spv = new saito.transaction();
	    spv.transaction.id   = this.transactions[i].transaction.id;
	    spv.transaction.type = 9;
	    spv.transaction.r    = 1;
	    spv.transaction.sig  = this.app.crypto.hash(this.transactions[i].returnSignatureSource(this.app));

	    //delete spv.transaction.to;
	    //delete spv.transaction.from;
	    delete spv.transaction.m;
	    delete spv.transaction.ps;
	    delete spv.transaction.ts;
	    delete spv.transaction.ver;
	    delete spv.transaction.path;
	    delete spv.transaction.msg;

	    delete spv.fees_total;
	    delete spv.work_available_to_me;
	    delete spv.work_available_to_creator;
	    delete spv.work_cumulative;
	    delete spv.msg;
	    delete spv.dmsg;
	    delete spv.size;
	    delete spv.is_valid;
	    delete spv.atr_trapdoor;
	    delete spv.atr_rebroadcasting_limit;
	    delete spv.may_be_removed_from_block;

	pruned_transactions.push(spv);

      }
    }

    //
    // prune unnecessary txs into merkle-tree
    //
    let no_simplification_needed = 0;
/*****
    while (no_simplification_needed == 0) {
      let action_taken = 0;
      for (let i = 1; i < pruned_transactions.length; i++) {
        if (pruned_transactions[i].transaction.type == 9 && pruned_transactions[i-1].transaction.type == 9) {
          if (pruned_transactions[i].transaction.r == pruned_transactions[i-1].transaction.r) {
	    pruned_transactions[i].transaction.r *= 2;
	    pruned_transactions[i].transaction.sig = this.app.crypto.hash(pruned_transactions[i-1].transaction.sig + pruned_transactions[i].transaction.sig);
	    pruned_transactions.splice(i-1, 0);
	    action_taken = 1;
	  }
	}
      }
      if (action_taken == 0) { 
	no_simplification_needed = 1;
      }
    }
****/

    let newblk = new saito.block();
	newblk.block = Object.assign({}, this.block);
	newblk.transactions = pruned_transactions;

    return newblk;

  }



  returnMerkleRoot() {

    //
    // if we are lite-client and have been given a block without transactions
    // we accept the merkle root since it is what has been provided. users who 
    // do not wish to run this risk need necessarily to fully-validate, since 
    // they are trusting the server to notify them when there *are* transactions
    // as in any other blockchains/SPV/MR implementation.
    //
    if (this.transactions.length == 0 && (this.app.BROWSER == 1 || this.app.SPVMODE == 1)) {
      return this.block.merkle;
    }


    let mr  = "";
    let txs = [];

    for (let i = 0; i < this.transactions.length; i++) { 
      if (this.transactions[i].transaction.type == 9) {
        txs.push(this.transactions[i].transaction.sig);
      } else {
        txs.push(this.app.crypto.hash(this.transactions[i].returnSignatureSource(this.app)));
      }
    }

   while (mr == "") {

      let tx2 = [];

      if (txs.length <= 2) {
	if (txs.length == 1) {
	  mr = txs[0];
	} else {
	  mr = this.app.crypto.hash((""+txs[0]+txs[1]));
	}
      } else {

        for (let i = 0; i < txs.length; i++) {
          if (i <= txs.length-2) {
	    tx2.push(this.app.crypto.hash((""+txs[i]+txs[i+1])));
	    i++;
	  } else {
	    tx2.push(txs[i]);
  	  }
        }

	txs = tx2;   

      }
    }
    return mr;

  }



  /**
   * check bloom filter for transactions to this address
   **/
  hasKeylistTransactions(keylist) {
    for (let i = 0; i < keylist.length; i++) {
      if (this.txs_hmap[keylist[i]] == 1) { return true; }
    }
    return false;
  }


}

module.exports = Block;


