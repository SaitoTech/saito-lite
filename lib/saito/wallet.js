'use strict';

const saito = require('./saito');
const Big      = require('big.js');
const logger = require('../saito_logger.js')

/**
 * Mempool Constructor
 * @param {*} app
 */
class Wallet {

  constructor(app) {

    if (!(this instanceof Wallet)) {
      return new Wallet(app);
    }

    this.app     			= app || {};

    this.wallet			= {};
    this.wallet.balance 	= "0";
    this.wallet.publickey 	= "";
    this.wallet.privatekey 	= "";

    this.wallet.inputs                = [];
    this.wallet.outputs               = [];
    this.wallet.spends                = [];	// spent but still around
    this.wallet.default_fee           = 2;
    this.wallet.version               = 2.17;
    this.wallet.pending               = [];       // sent but not seen

    this.inputs_hmap 		      = [];
    this.inputs_hmap_counter		= 0;
    this.inputs_hmap_counter_limit	= 10000;
    this.outputs_hmap 		      = [];
    this.outputs_hmap_counter		= 0;
    this.outputs_hmap_counter_limit	= 10000;

    this.recreate_pending_transactions = 0;

    return this;
  }


  addInput(x) {

logger.info("adding input: " + x.returnSignatureSource());

    //////////////
    // add slip //
    //////////////
    //
    // we keep our slip array sorted according to block_id
    // so that we can (1) spend the earliest slips first,
    // and (2) simplify deleting expired slips
    //
    let pos = this.wallet.inputs.length;
    while (pos > 0 && this.wallet.inputs[pos-1].bid > x.bid) { pos--; }
    if (pos == -1) { pos = 0; }

    this.wallet.inputs.splice(pos, 0, x);
    this.wallet.spends.splice(pos, 0, 0);

    let hmi = x.returnSignatureSource(x);
    this.inputs_hmap[hmi] = 1;
    this.inputs_hmap_counter++;


    ////////////////////////
    // regenerate hashmap //
    ////////////////////////
    //
    // we want to periodically re-generate our hashmaps
    // that help us check if inputs and outputs are already
    // in our wallet for memory-management reasons and
    // to maintain reasonable accuracy.
    //
    if (this.inputs_hmap_counter > this.inputs_hmap_counter_limit) {

      this.inputs_hmap = [];
      this.outputs_hmap = [];
      this.inputs_hmap_counter = 0;
      this.outputs_hmap_counter = 0;

      for (let i = 0; i < this.wallet.inputs.length; i++) {
        let hmi = this.wallet.inputs[i].returnSignatureSource();
        this.inputs_hmap[hmi] = 1;
      }

      for (let i = 0; i < this.wallet.outputs.length; i++) {
        let hmi = this.wallet.outputs[i].returnSignatureSource();
        this.outputs_hmap[hmi] = 1;
      }
    }
    return;
  }



  addOutput(x) {

    //////////////
    // add slip //
    //////////////
    this.wallet.outputs.push(x);
    let hmi = x.returnSignatureSource();
    this.outputs_hmap[hmi] = 1;
    this.outputs_hmap_counter++;

    ///////////////////////
    // purge old outputs //
    ///////////////////////
    if (this.output_hmap_counter >= this.output_hmap_counter_limit) {
      logger.info("Deleting Excessive outputs from heavy-spend wallet...");
      this.wallet.output.splice(0, this.wallet.output.length-this.output_storage_limit);
      this.output_storage_counter = 0;
    }
    return;

  }



  containsInput(s) {
    let hmi = s.returnSignatureSource();
    if (this.inputs_hmap[hmi] == 1) { return true; }
    return false;
  }


  containsOutput(s) {
    let hmi = s.returnSignatureSource();
    if (this.outputs_hmap[hmi] == 1) { return true; }
    return false;
  }





  doesSlipInPendingTransactionsSpendBlockHash(bsh="") {
    if (bsh == "") { return false; }
    for (let i = 0; i < this.wallet.pending.length; i++) {
      let ptx = new saito.transaction(this.wallet.pending[i]);
      for (let k = 0; k < ptx.transaction.from.length; k++) {
        if (ptx.transaction.from[k].bsh == bsh) {
          return true;
        }
      }
    }
    return false;
  }




  initialize(app) {

    if (this.wallet.privatekey == "") {

      if (this.app.options.wallet != null) {

        /////////////
        // upgrade //
        /////////////
        if (this.app.options.wallet.version < this.wallet.version) {

          if (this.app.BROWSER == 1) {

            this.app.options.wallet.version = this.wallet.version;

            let tmpprivkey = this.app.options.wallet.privatekey;
            let tmppubkey = this.app.options.wallet.publickey;

            // specify before reset to avoid archives reset problem
            this.wallet.publickey = tmppubkey;
            this.wallet.privatekey = tmpprivkey;

            // reset and save
            this.app.storage.resetOptions();
            this.app.storage.saveOptions();

            // re-specify after reset
            this.wallet.publickey = tmppubkey;
            this.wallet.privatekey = tmpprivkey;

            this.app.options.wallet = this.wallet;
            this.saveWallet();

            //
            // TODO: reimplement resetting archives
            //
            this.app.archives.resetArchives();

            // reset blockchain
            this.app.options.blockchain.last_bid = "";
            this.app.options.blockchain.last_hash = "";
            this.app.options.blockchain.last_ts = "";

            alert("Saito Upgrade: Wallet Reset");

          }
        }
        this.wallet = Object.assign(this.wallet, this.app.options.wallet);
      }

      ////////////////
      // new wallet //
      ////////////////
      if (this.wallet.privatekey == "") {
        this.wallet.privatekey            = this.app.crypto.generateKeys();
        this.wallet.publickey             = this.app.crypto.returnPublicKey(this.wallet.privatekey);
      }
    }


    //////////////////
    // import slips //
    //////////////////
    this.wallet.spends = []
    if (this.app.options.wallet != null) {

      if (this.app.options.wallet.inputs != null) {
        for (let i = 0; i < this.app.options.wallet.inputs.length; i++) {
          this.wallet.inputs[i] = new saito.slip(
            this.app.options.wallet.inputs[i].add,
            this.app.options.wallet.inputs[i].amt,
            this.app.options.wallet.inputs[i].type,
            this.app.options.wallet.inputs[i].bid,
            this.app.options.wallet.inputs[i].tid,
            this.app.options.wallet.inputs[i].sid,
            this.app.options.wallet.inputs[i].bsh,
            this.app.options.wallet.inputs[i].lc,
            this.app.options.wallet.inputs[i].rn
          );
          this.wallet.spends.push(0);

          ////////////////////
          // update hashmap //
          ////////////////////
          let hmi = this.wallet.inputs[i].returnSignatureSource();
          this.inputs_hmap[hmi] = 1;
          this.inputs_hmap_counter++;

        }
      }
      if (this.app.options.wallet.outputs != null) {
        for (let i = 0; i < this.app.options.wallet.outputs.length; i++) {
          this.wallet.outputs[i] = new saito.slip(
            this.app.options.wallet.outputs[i].add,
            this.app.options.wallet.outputs[i].amt,
            this.app.options.wallet.outputs[i].type,
            this.app.options.wallet.outputs[i].bid,
            this.app.options.wallet.outputs[i].tid,
            this.app.options.wallet.outputs[i].sid,
            this.app.options.wallet.outputs[i].bsh,
            this.app.options.wallet.outputs[i].lc,
            this.app.options.wallet.outputs[i].rn
          );


          ////////////////////
          // update hashmap //
          ////////////////////
          let hmi = this.wallet.outputs[i].returnSignatureSource();
          this.outputs_hmap[hmi] = 1;
          this.outputs_hmap_counter++;

        }
      }
    }


    //
    // check pending transactions and update spent slips
    //
    for (let z = 0; z < this.wallet.pending.length; z++) {
      let ptx = new saito.transaction(this.wallet.pending[z]);

      for (let y = 0; y < ptx.transaction.from.length; y++) {

        let spent_slip = ptx.transaction.from[y];

        let ptx_bsh = spent_slip.bsh;
        let ptx_bid = spent_slip.bid;
        let ptx_tid = spent_slip.tid;
        let ptx_sid = spent_slip.sid;

        for (let x = 0; x < this.wallet.inputs.length; x++) {
          if (this.wallet.inputs[x].bid == ptx_bid) {
            if (this.wallet.inputs[x].tid == ptx_tid) {
              if (this.wallet.inputs[x].sid == ptx_sid) {
                if (this.wallet.inputs[x].bsh == ptx_bsh) {
      let d = new Date().getTime();
  logger.info("\n\n\nWE ARE UPDATING OUR PENDING SLIP so it is spent: " + d);
  logger.info(JSON.stringify(this.wallet.pending[z]));
                  this.wallet.spends[x] = 1;
                  x = this.wallet.inputs.length;
                }
              }
            }
          }
        }
      }
    }


    //
    // re-implement
    //
    this.purgeExpiredSlips();
    this.updateBalance();
    this.saveWallet();

  }




  onChainReorganization(bid, bsh, lc) {

    if (lc == 1) {

      this.purgeExpiredSlips();
      this.resetSpentInputs();

      //
      // recreate pending slips
      //
      if (this.recreate_pending_transactions == 1) {

        for (let i = 0; i < this.wallet.pending.length; i++) {
          let ptx = new saito.transaction(this.wallet.pending[i]);
          let newtx = this.createReplacementTransaction(ptx);
          if (newtx != null) {
            newtx = this.signTransaction(newtx);
            if (newtx != null) {
              this.wallet.pending[i] = JSON.stringify(newtx);
            }
          }
        }
        this.recreate_pending_transactions = 0;
      }

    } else {
      if (this.doesSlipInPendingTransactionsSpendBlockHash(bsh)) {
        this.recreate_pending_transactions = 1;
      }
    }

    this.resetExistingSlips(bid, bsh, lc);

  }




  processPayments(blk, lc=0) {

    for (let i = 0; i < blk.transactions.length; i++) {

      let tx		  = blk.transactions[i];
      let slips           = tx.returnSlipsToAndFrom(this.returnPublicKey());
      let to_slips        = slips.to;
      let from_slips      = slips.from;

      //
      // update slips prior to insert
      //
      for (let ii = 0; ii < to_slips.length; ii++) {
	to_slips.bid = blk.block.id;
	to_slips.bsh = blk.returnHash();
	to_slips.tid = tx.transaction.id;
	to_slips.lc  = lc;
      }



      //
      // any txs in pending should be checked to see if
      // we can remove them now that we have received
      // a transaction that might be it....
      //
      if (this.wallet.pending.length > 0) {

        for (let i = 0; i < this.wallet.pending.length; i++) {
          if (this.wallet.pending[i].indexOf(tx.transaction.sig) > 0) {
            this.wallet.pending.splice(i, 1);
            i--;
          } else {

            //
            // 10% chance of deletion
            //
            if (Math.random() <= 0.1) {

              let ptx = new saito.transaction(this.wallet.pending[i]);
              let ptx_ts = ptx.transaction.ts;
              let blk_ts = blk.block.ts;

              if ((ptx_ts + 12000000) < blk_ts) {
                this.wallet.pending.splice(i, 1);
                i--;
              }
            }
          }
        }
      }


      //
      // inbound payments
      //
      if (to_slips.length > 0) {
        for (let m = 0; m < to_slips.length; m++) {
          if (to_slips[m].amt > 0) {
            if (this.containsInput(to_slips[m]) == 0) {
              if (this.containsOutput(to_slips[m]) == 0) {
                this.addInput(to_slips[m]);
              }
            } else {
	      if (lc == 1) {
              	let our_index = to_slips[m].returnSignatureSource();
              	for (let n = this.wallet.inputs.length-1; n >= 0; n--) {
                  if (this.wallet.inputs[n].returnSignatureSource() === our_index) {
                    this.wallet.inputs[n].lc = lc;
                  }
		}
              }
            }
          }
        }
      }


      //
      // outbound payments
      //
      if (from_slips.length > 0) {
        for (var m = 0; m < from_slips.length; m++) {
          var s = from_slips[m];

          for (var c = 0; c < this.wallet.inputs.length; c++) {
            var qs = this.wallet.inputs[c];
            if (
              s.bid   == qs.bid &&
              s.tid   == qs.tid &&
              s.sid   == qs.sid &&
              s.bhash == qs.bhash &&
              s.amt   == qs.amt &&
              s.add   == qs.add
            ) {
              if (this.containsOutput(s) == 0) {
                this.addOutput(this.wallet.inputs[c]);
              }
              this.wallet.inputs.splice(c, 1);
              this.wallet.spends.splice(c, 1);
              c = this.wallet.inputs.length+2;
            }
          }
        }
      }
    }


    //
    // save wallet
    //
    this.updateBalance();
    this.app.options.wallet = this.wallet;
    this.app.storage.saveOptions();

  }



  purgeExpiredSlips() {

    let gid = this.app.blockchain.genesis_bid;
    for (let m = this.wallet.inputs.length-1; m >= 0; m--) {
      if (this.wallet.inputs[m].bid < gid) {
        this.wallet.inputs.splice(m, 1);
        this.wallet.spends.splice(m, 1);
      }
    }
    for (let m = this.wallet.outputs.length-1; m >= 0; m--) {
      if (this.wallet.outputs[m].bid < gid) {
        this.wallet.outputs.splice(m, 1);
      }
    }
  }


  resetExistingSlips(bid, bsh, lc) {
    for (let m = this.wallet.inputs.length-1; m >= 0; m--) {
      if (this.wallet.inputs[m].bid == bid && this.wallet.inputs[m].bsh == bsh) {
        this.wallet.inputs[m].lc = lc;
      }
      else {
        if (this.wallet.inputs[m].bid < bid) {
          return;
        }
      }
    }
  }

  resetSpentInputs(bid=0) {
    if (bid == 0) {
      for (let i = 0; i < this.wallet.inputs.length; i++) {
        if (this.isSlipInPendingTransactions(this.wallet.inputs[i]) == false) {
          this.wallet.spends[i] = 0;
        }
      }
    } else {
      let target_bid = this.app.blockchain.returnLatestBlockId() - bid;
      for (let i = 0; i < this.wallet.inputs.length; i++) {
        if (this.wallet.inputs[i].bid <= target_bid) {
          if (this.isSlipInPendingTransactions(this.wallet.inputs[i]) == false) {
            this.wallet.spends[i] = 0;
          }
        }
      }
    }
  }



  returnAdequateInputs(amt) {

    var utxiset = [];
    var value   = Big(0.0);
    var bigamt  = Big(amt);

    this.purgeExpiredSlips();

    //
    // this adds a 1 block buffer so that inputs are valid in the future block included
    //
    var lowest_block = this.app.blockchain.last_bid - this.app.blockchain.genesis_period + 2;

    //
    // check pending txs to avoid slip reuse if necessary
    //
    if (this.wallet.pending.length > 0) {
      for (let i = 0; i < this.wallet.pending.length; i++) {
        let ptx = new saito.transaction(this.wallet.pending[i]);
        for (let k = 0; k < ptx.transaction.from.length; k++) {
          let slipIndex = ptx.transaction.from[k].returnSignatureSource();
          for (let m = 0; m < this.wallet.inputs; m++) {
            let thisSlipIndex = this.wallet.inputs[m].returnSignatureSource();
            if (thisSlipIndex === slipIndex) {
              while (this.wallet.spends.length < m) {
                this.wallet.spends.push(0);
              }
              this.wallet.spends[m] = 1;
            }
          }
        }
      }
    }


    for (let i = 0; i < this.wallet.inputs.length; i++) {
      if (this.wallet.spends[i] == 0 || i >= this.wallet.spends.length) {
        var slip = this.wallet.inputs[i];
        if (slip.lc == 1 && slip.bid >= lowest_block) {
          if (this.app.mempool.transactions_inputs_hmap[slip.returnSignatureSource()] != 1) {
            this.wallet.spends[i] = 1;
            utxiset.push(slip);
            value = value.plus(Big(slip.amt));
            if (value.gt(bigamt) || value.eq(bigamt)) {
              return utxiset;
            }
          }
        }
      }
    }

    return null;
  }



  returnBalance() {
    return this.wallet.balance.replace(/0+$/,'').replace(/\.$/,'\.0');
  }

  returnPrivateKey() {
    return this.wallet.privatekey;
  }
  returnPublicKey() {
    return this.wallet.publickey;
  }

  saveWallet() {
    this.app.options.wallet = this.wallet;
    this.app.storage.saveOptions();
  }


  signMessage(msg) {
    return this.app.crypto.signMessage(msg, this.returnPrivateKey());
  }

  signTransaction(tx) {
    if (tx == null) { return null; }
    for (var i = 0; i < tx.transaction.to.length; i++) { tx.transaction.to[i].sid = i; }
    tx.transaction.sig = tx.returnSignature(this.app);
    return tx;
  }


  updateBalance() {

    let b = Big(0.0);
    let minid = this.app.blockchain.last_bid - this.app.blockchain.genesis_period + 1;
    for (let x = 0; x < this.wallet.inputs.length; x++) {
      let s = this.wallet.inputs[x];
      if (s.lc == 1 && s.bid >= minid) {
        b = b.plus(Big(s.amt));
      }
    }

    this.wallet.balance = b.toFixed(8); 
    this.app.modules.updateBalance();

  }



  createUnsignedTransactionWithDefaultFee(publickey=this.returnPublicKey(), amt=0.0) {
    return this.createUnsignedTransaction(publickey, amt, this.wallet.default_fee);
  }

  createUnsignedTransaction(publickey=this.returnPublicKey(), amt=0.0, fee=0.0) {

logger.info(publickey + " -- " + amt + " -- " + fee);

    var tx           = new saito.transaction();
    var total_fees   = Big(amt).plus(Big(fee));
    var wallet_avail = Big(this.returnBalance());

    //
    // check to-address is ok -- this just keeps a server
    // that receives an invalid address from forking off
    // the main chain because it creates its own invalid
    // transaction.
    //
    // this is not strictly necessary, but useful for the demo
    // server during testnet, which produces a majority of
    // blocks.
    //
    if (!this.app.crypto.isPublicKey(publickey)) {
      logger.info("trying to send message to invalid address");
      return null;
    }


    if (total_fees.gt(wallet_avail)) {
      return null;
    }


    //
    // zero-fee transactions have fake inputs
    //
    if (total_fees == 0.0) {
      tx.transaction.from = [];
      tx.transaction.from.push(new saito.slip(this.returnPublicKey()));
    } else {
      tx.transaction.from = this.returnAdequateInputs(total_fees);
    }
    tx.transaction.ts   = new Date().getTime();
    tx.transaction.to.push(new saito.slip(publickey, amt));

    // specify that this is a normal transaction
    tx.transaction.to[tx.transaction.to.length-1].type = 0;
    if (tx.transaction.from == null) {
      return null;
    }

    // add change input
    var total_inputs = Big(0.0);
    for (let ii = 0; ii < tx.transaction.from.length; ii++) {
      total_inputs = total_inputs.plus(Big(tx.transaction.from[ii].amt));
    }

    //
    // generate change address(es)
    //
    var change_amount = total_inputs.minus(total_fees);

    if (Big(change_amount).gt(0)) {

      //
      // if we do not have many slips left, generate a few extra inputs
      //
      if (this.wallet.inputs.length < 8) {

        //
        // split change address
        //
        // this prevents some usability issues with APPS
        // by making sure there are usually at least 3
        // utxo available for spending.
        //
        let half_change_amount = change_amount.div(2);

        tx.transaction.to.push(new saito.slip(this.returnPublicKey(), half_change_amount.toFixed(8)));
        tx.transaction.to[tx.transaction.to.length-1].type = 0;
        tx.transaction.to.push(new saito.slip(this.returnPublicKey(), change_amount.minus(half_change_amount).toFixed(8)));
        tx.transaction.to[tx.transaction.to.length-1].type = 0;

      } else {

        //
        // single change address
        //
        tx.transaction.to.push(new saito.slip(this.returnPublicKey(), change_amount.toFixed(8)));
        tx.transaction.to[tx.transaction.to.length-1].type = 0;
      }
    }


    //
    // we save here so that we don't create another transaction
    // with the same inputs after broadcasting on reload
    //
    this.saveWallet();

    return tx;

  }
}

module.exports = Wallet;








