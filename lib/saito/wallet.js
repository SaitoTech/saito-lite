'use strict';

const saito = require('./saito');
const Big      = require('big.js');
const EventEmitter = require('events');
const AbstractCryptoModule = require('../templates/abstractcryptomodule')


/**
 * Mempool Constructor
 * @param {*} app
 */
class Wallet {

  constructor(app) {
    if (!(this instanceof Wallet)) {
      return new Wallet(app);
    }

    this.app                             = app || {};

    this.wallet                          = {};
    this.wallet.balance                  = "0";
    this.wallet.publickey                = "";
    this.wallet.privatekey               = "";

    this.wallet.inputs                   = [];
    this.wallet.outputs                  = [];
    this.wallet.spends                   = [];        // spent but still around
    this.wallet.default_fee              = 2;
    this.wallet.version                  = 3.317;

    this.wallet.preferred_crypto	 = "SAITO";
    this.wallet.preferred_txs		 = [];

    this.inputs_hmap                     = [];
    this.inputs_hmap_counter             = 0;
    this.inputs_hmap_counter_limit       = 10000;
    this.outputs_hmap                    = [];
    this.outputs_hmap_counter            = 0;
    this.outputs_hmap_counter_limit      = 10000;
    this.outputs_prune_limit             = 100;

    this.recreate_pending_transactions   = 0;

    // SaitoCrypto is an AbstractCryptoModule just like the others so we
    // don't have to treat Saito as a special case.
    class SaitoCrypto extends AbstractCryptoModule {
      constructor(app) {
        super(app, "SAITO");
        this.name = "Saito";
        this.description = "Saito";
      }
      async returnBalance() {
        return this.app.wallet.returnBalance();
      }
      async transfer(howMuch, to) {
        console.log("implement me!!");
      }
      async returnAddress() {
        return this.app.wallet.returnPublicKey();
      }
    }
    this.saitoCrypo = new SaitoCrypto(app);
  }



  addInput(x) {

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
    if (this.wallet.outputs.length > this.outputs_prune_limit) {
      console.log("Deleting Excessive outputs from heavy-spend wallet...");
      let outputs_excess_amount = this.wallet.outputs.length - this.outputs_prune_limit;
      outputs_excess_amount += 10;
      this.wallet.outputs.splice(0, outputs_excess_amount);
      this.outputs_hmap_counter = 0;
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


  addTransactionToPending(tx) {
    let txjson = JSON.stringify(tx.transaction);

    // do not put large TXS in pending - 100 kb
    if (txjson.length > 100000) { return; }

    if (! this.wallet.pending.includes(txjson)) {
      this.wallet.pending.push(txjson);
      this.saveWallet();
    } else {
      //alert("DOUBLEADD to PENDING: " + JSON.stringify(tx.msg));
    }
  }


  doesSlipInPendingTransactionsSpendBlockHash(bsh="") {
    if (bsh == "") { return false; }
    for (let i = 0; i < this.wallet.pending.length; i++) {
      let ptx = new saito.transaction(JSON.parse(this.wallet.pending[i]));
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

            let tmpprivkey = this.app.options.wallet.privatekey;
            let tmppubkey = this.app.options.wallet.publickey;

            // specify before reset to avoid archives reset problem
            this.wallet.publickey = tmppubkey;
            this.wallet.privatekey = tmpprivkey;

            // let modules purge stuff
            this.app.modules.onWalletReset();

            // reset and save
            this.app.storage.resetOptions();
            this.app.storage.saveOptions();

            // re-specify after reset
            this.wallet.publickey = tmppubkey;
            this.wallet.privatekey = tmpprivkey;

            this.app.options.wallet = this.wallet;

            // reset blockchain
            this.app.options.blockchain.last_bid = "";
            this.app.options.blockchain.last_hash = "";
            this.app.options.blockchain.last_ts = "";

            // delete inputs and outputs
            this.app.options.wallet.inputs   = [];
            this.app.options.wallet.outputs  = [];
            this.app.options.wallet.pending  = [];
            this.app.options.wallet.spends   = [];
            this.app.options.wallet.balance  = "0.0";
            this.app.options.wallet.version  = this.wallet.version;

            this.saveWallet();

            salert("Saito Upgrade: Wallet Reset");

          } else {

            //
            // purge old slips
            //
            this.app.options.wallet.version = this.wallet.version;

            this.app.options.wallet.inputs   = [];
            this.app.options.wallet.outputs  = [];
            this.app.options.wallet.spends   = [];
            this.app.options.wallet.pending  = [];
            this.app.options.wallet.balance  = "0.0";

            this.app.storage.saveOptions();

          }
        }

        this.wallet = Object.assign(this.wallet, this.app.options.wallet);
      }

      ////////////////
      // new wallet //
      ////////////////
      if (this.wallet.privatekey == "") {
        this.resetWallet();
      }
    }



    //////////////////
    // import slips //
    //////////////////
    this.wallet.spends = []
    if (this.app.options.wallet != null) {

      if (this.app.options.wallet.inputs != null) {
        for (let i = 0; i < this.app.options.wallet.inputs.length; i++) {
          let {add,amt,type,bid,tid,sid,bsh,lc,rn} = this.app.options.wallet.inputs[i];
          this.wallet.inputs[i] = new saito.slip(add,amt,type,bid,tid,sid,bsh,lc,rn);
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
          let {add,amt,type,bid,tid,sid,bsh,lc,rn} = this.app.options.wallet.outputs[i];
          this.wallet.outputs[i] = new saito.slip(add,amt,type,bid,tid,sid,bsh,lc,rn);

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
      let ptx = new saito.transaction(JSON.parse(this.wallet.pending[z]));

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
    // listen to network conditions
    //
    this.app.connection.on('connection_up', (peer) => {
      this.rebroadcastPendingTransactions(peer);
    });


    this.purgeExpiredSlips();
    this.updateBalance();
    this.saveWallet();

  }




  isSlipInPendingTransactions(slip=null) {

    if (slip == null) { return false; }

    let slipidx = slip.returnSignatureSource();

    for (let i = 0; i < this.wallet.pending.length; i++) {
      let ptx = new saito.transaction(JSON.parse(this.wallet.pending[i]));
      for (let k = 0; k < ptx.transaction.from.length; k++) {
        let fslip = ptx.transaction.from[k];
        if (fslip.returnSignatureSource() === slipidx) {
          return true;
        }
      }
    }

    return false;

  }




  //
  // if peer is not null, rebroadcast to that peer, else everyone
  //
  rebroadcastPendingTransactions(peer=null) {

    let loop_length = this.wallet.pending.length;

    for (let i = 0; i < loop_length; i++) {
      let tx = new saito.transaction(JSON.parse(this.wallet.pending[i]));
      if (!tx.isFrom(this.returnPublicKey())) {
        this.wallet.pending.splice(i, 1);
        i--; loop_length--;
      } else {

        if (tx.transaction.type == 0) {
          if (peer == null) {
            this.app.network.propagateTransaction(tx);
          } else {
            this.app.network.propagateTransaction(tx);
          }
        } else {
          //
          // remove golden tickets and other unnecessary slips from pending
          //
          this.app.wallet.wallet.pending.splice(i, 1);
          this.app.wallet.unspendInputSlips(tx);
          this.app.wallet.saveWallet();
          i--; loop_length--;
        }
      }
    }
  }



  unspendInputSlips(tmptx=null) {

    if (tmptx == null) { return; }

    for (let i = 0; i < tmptx.transaction.from.length; i++) {

      let fsidx = tmptx.transaction.from[i].returnSignatureSource();

      for (let z = 0; z < this.wallet.inputs.length; z++) {
        if (fsidx == this.wallet.inputs[z].returnSignatureSource()) {
          this.wallet.spends[z] = 0;
        }
      }
    }
  }








  onChainReorganization(bid, bsh, lc, pos) {

    if (lc == 1) {

      this.purgeExpiredSlips();
      this.resetSpentInputs();

      //
      // recreate pending slips
      //
      if (this.recreate_pending_transactions == 1) {
        for (let i = 0; i < this.wallet.pending.length; i++) {
          let ptx = new saito.transaction(JSON.parse(this.wallet.pending[i]));
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

      let tx              = blk.transactions[i];
      let slips           = tx.returnSlipsToAndFrom(this.returnPublicKey());
      let to_slips        = slips.to;
      let from_slips      = slips.from;

      //
      // update slips prior to insert
      //
      for (let ii = 0; ii < to_slips.length; ii++) {
        to_slips[ii].bid = blk.block.id;
        to_slips[ii].bsh = blk.returnHash();
        to_slips[ii].tid = tx.transaction.id;
        to_slips[ii].lc  = lc;
      }

      //
      // any txs in pending should be checked to see if
      // we can remove them now that we have received
      // a transaction that might be it....
      //
      let removed_pending_slips = 0;
      if (this.wallet.pending.length > 0) {

        for (let i = 0; i < this.wallet.pending.length; i++) {

          let ptx = new saito.transaction(JSON.parse(this.wallet.pending[i]));

          if (this.wallet.pending[i].indexOf(tx.transaction.sig) > 0) {
            this.wallet.pending.splice(i, 1);
            i--;
            removed_pending_slips = 1;
          } else {

            if (ptx.transaction.type == 1) {

              this.wallet.pending.splice(i, 1);
              this.unspendInputSlips(ptx);
              i--;
              removed_pending_slips = 1;

            } else {

              //
              // 10% chance of deletion
              //
              if (Math.random() <= 0.1) {

                let ptx_ts = ptx.transaction.ts;
                let blk_ts = blk.block.ts;

                if ((ptx_ts + 12000000) < blk_ts) {
                  this.wallet.pending.splice(i, 1);
                  this.unspendInputSlips(ptx);
                  removed_pending_slips = 1;
                  i--;
                }
              }
            }
          }
        }
      }
      if (removed_pending_slips == 1) {
        this.saveWallet();
      }


      //
      // inbound payments
      //
      if (to_slips.length > 0) {
        for (let m = 0; m < to_slips.length; m++) {
          if (to_slips[m].amt > 0) {
            if (this.containsInput(to_slips[m]) == 0) {
              if (this.containsOutput(to_slips[m]) == 0) {
                if (to_slips[m].type != 4) {
                  this.addInput(to_slips[m]);
		}
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
              s.bsh   == qs.bsh &&
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

/***** MARCH 11
    //
    // if we have way too many slips, merge some
    //
    if (this.wallet.inputs.length > 20) {

console.log("---------------------------------------");
console.log("Merging Wallet Slips on Proess Payment!");
console.log("---------------------------------------");
      let mtx = this.createUnsignedTransaction(this.returnPublicKey(), 0.0, 0.0, 8); 
      mtx = this.signTransaction(mtx);
      this.app.network.propagateTransaction(mtx);

    }
******/


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
      if (this.wallet.inputs[m].bid == bid && this.wallet.inputs[m].bsh === bsh) {
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
        let ptx = new saito.transaction(JSON.parse(this.wallet.pending[i]));
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

  calculateBalance() {
    let bal = Big(0);
     this.wallet.inputs.forEach((input, index )=> {
       if (this.isSlipValid(input, index)) {
         bal = bal.plus(input.amt);
       }
     });
     return bal;
  }

  calculateDisplayBalance() {
    var s = this.calculateBalance();
    this.wallet.pending.forEach(tx => {
      tx.to.forEach(slip => {
        Big(s).plus(Big(slip.amt));
      });
    });
  }

  isSlipValid(slip, index) {
    let isSlipSpent = this.wallet.spends[index];
    let isSlipLC = slip.lc == 1;
    let isSlipGtLVB = slip.bid >= this.app.blockchain.returnLowestValidBlock();
    let isSlipinTX = this.app.mempool.transactions_inputs_hmap[slip.returnSignatureSource()] != 1;
    let valid = !isSlipSpent && isSlipLC && isSlipGtLVB && isSlipinTX;
    return valid;
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



  async backupWallet() {
    try {
      if (this.app.BROWSER == 1) {
        let content = JSON.stringify(this.app.options);
        var pom = document.createElement('a');
        pom.setAttribute('type', "hidden");
        pom.setAttribute('href', 'data:application/json;utf-8,' + encodeURIComponent(content));
        pom.setAttribute('download', "saito.wallet.json");
        document.body.appendChild(pom);
        pom.click();
        pom.remove();
      }
    } catch (err) {
      console.log("Error backing-up wallet: " + err);
    }
  }


  async resetWallet() {

    //
    // we do not do this because of referrals and bundles stored in options file
    // reset and save
    //await this.app.storage.resetOptions();
    //this.app.storage.saveOptions();

    this.wallet.privatekey            = this.app.crypto.generateKeys();
    this.wallet.publickey             = this.app.crypto.returnPublicKey(this.wallet.privatekey);

    // blockchain
    if (this.app.options.blockchain != undefined) {
      this.app.blockchain.resetBlockchainOptions();
    }

    // keychain
    if (this.app.options.keys != undefined) {
      this.app.options.keys = [];
    }

    this.wallet.inputs                = [];
    this.wallet.outputs               = [];
    this.wallet.spends                = [];
    this.wallet.pending               = [];

    this.saveWallet();

    if (this.app.browser.browser_active == 1) {
      window.location.reload();
    }

  }


  saveWallet() {
    this.app.options.wallet = this.wallet;
    this.app.storage.saveOptions();
  }


  signMessage(msg) {
    return this.app.crypto.signMessage(msg, this.returnPrivateKey());
  }

  signAndEncryptTransaction(tx) {

    if (tx == null) { return null; }
    for (var i = 0; i < tx.transaction.to.length; i++) { tx.transaction.to[i].sid = i; }

    //
    // convert tx.msg to base64 tx.transaction.ms
    //
    // if the transaction is of excessive length, we cut the message and
    // continue blank. so be careful kids as there are some hardcoded
    // limits in NodeJS!
    //
    try {
      if (this.app.keys.hasSharedSecret(tx.transaction.to[0].add)) {
        tx.msg = this.app.keys.encryptMessage(tx.transaction.to[0].add, tx.msg);
      }
      tx.transaction.m = this.app.crypto.stringToBase64(JSON.stringify(tx.msg));
      tx.transaction.sig = tx.returnSignature(this.app, 1); // force clean sig as encrypted

   } catch (err) {
console.log("####################");
console.log("### OVERSIZED TX ###");
console.log("###   -revert-   ###");
console.log("####################");
console.log(err);
      tx.msg = {};
      return tx;
    }

    return tx;

  }
  signTransaction(tx) {

    if (tx == null) { return null; }
    for (var i = 0; i < tx.transaction.to.length; i++) { tx.transaction.to[i].sid = i; }

    //
    // convert tx.msg to base64 tx.transaction.ms
    //
    // if the transaction is of excessive length, we cut the message and
    // continue blank. so be careful kids as there are some hardcoded
    // limits in NodeJS!
    //
    try {
      tx.transaction.m = this.app.crypto.stringToBase64(JSON.stringify(tx.msg));
      tx.transaction.sig = tx.returnSignature(this.app);
    } catch (err) {
console.log("####################");
console.log("### OVERSIZED TX ###");
console.log("###   -revert-   ###");
console.log("####################");
console.log(err);
      tx.msg = {};
      return tx;
    }

    return tx;
  }


  updateBalance() {
    let existing_balance = this.wallet.balance;
    this.wallet.balance = this.calculateBalance().toFixed(8);
    if (this.wallet.balance != existing_balance) {
      this.app.connection.emit("update_balance", this);
    }
  }

  returnDisplayBalance() {
    return this.calculateDisplayBalance();
  }

  createSlip(addr) {
    return new saito.slip(addr);
  }

  createRawTransaction(txobj) {
    return new saito.transaction(txobj);
  }

  createUnsignedTransactionWithDefaultFee(publickey="", amt=0.0) {
   if (publickey === "") { publickey = this.app.wallet.returnPublicKey(); }
    return this.createUnsignedTransaction(publickey, amt, this.wallet.default_fee);
  }

  createUnsignedTransaction(publickey="", amt=0.0, fee=0.0, force_merge=0) {

    if (publickey == "") { publickey = this.returnPublicKey(); }

    var tx           = new saito.transaction();
    var total_fees   = Big(amt).plus(Big(fee));
    var wallet_avail = this.calculateBalance();

    //
    // check to-address is ok -- this just keeps a server
    // that receives an invalid address from forking off
    // the main chain because it creates its own invalid
    // transaction.
    //
    // this is not strictly necessary, but useful for the demo
    // server during the early stages, which produces a majority of
    // blocks.
    //
    if (!this.app.crypto.isPublicKey(publickey)) {
      throw "Invalid address " + publickey;
      //console.log("trying to send message to invalid address");
      return null;
    }


    if (total_fees.gt(wallet_avail)) {
      amt = 0.0;
      fee = 0.0;
      //return null;
    }


    //
    // zero-fee transactions have fake inputs
    //
    if (total_fees.eq(0.0)) {
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

      //
      // take a hail-mary pass and try to send this as a free transaction
      //
      tx.transaction.from = [];
      tx.transaction.from.push(new saito.slip(this.returnPublicKey(), 0.0));
      //return null;

    }
    if (tx.transaction.to == null) {

      //
      // take a hail-mary pass and try to send this as a free transaction
      //
      tx.transaction.to = [];
      tx.transaction.to.push(new saito.slip(publickey, 0.0));
      //return null;

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

        let change1 = change_amount.div(2).toFixed(8);
        let change2 = change_amount.minus(Big(change1)).toFixed(8);

        //
        // split change address
        //
        // this prevents some usability issues with APPS
        // by making sure there are usually at least 3
        // utxo available for spending.
        //
        tx.transaction.to.push(new saito.slip(this.returnPublicKey(), change1));
        tx.transaction.to[tx.transaction.to.length-1].type = 0;
        tx.transaction.to.push(new saito.slip(this.returnPublicKey(), change2));
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
    // if our wallet is filling up with slips, merge a few
    //
    //if (this.wallet.inputs.length > 200 || force_merge > 0) {
    if (this.wallet.inputs.length > 30 || force_merge > 0) {

console.log("---------------------");
console.log("Merging Wallet Slips!");
console.log("---------------------");

      let slips_to_merge = 7;
      if (force_merge > 7) { slips_to_merge = force_merge; } 
      let slips_merged = 0;
      let output_amount = Big(0);
      let lowest_block = this.app.blockchain.last_bid - this.app.blockchain.genesis_period + 2;

      //
      // check pending txs to avoid slip reuse if necessary
      //
      if (this.wallet.pending.length > 0) {
        for (let i = 0; i < this.wallet.pending.length; i++) {
          let ptx = new saito.transaction(JSON.parse(this.wallet.pending[i]));
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


      for (let i = 0; slips_merged < slips_to_merge && i < this.wallet.inputs.length; i++) {
        if (this.wallet.spends[i] == 0 || i >= this.wallet.spends.length) {
          var slip = this.wallet.inputs[i];
          if (slip.lc == 1 && slip.bid >= lowest_block) {
            if (this.app.mempool.transactions_inputs_hmap[slip.returnSignatureSource()] != 1) {
              this.wallet.spends[i] = 1;

   	      slips_merged++;
	      output_amount = output_amount.plus(Big(slip.amt));

              tx.transaction.from.push(slip);

            }
          }
        }
      }

      // add new output
      tx.transaction.to.push(new saito.slip(this.returnPublicKey(), output_amount.toFixed(8)));
      tx.transaction.to[tx.transaction.to.length-1].type = 0;

    }

    //
    // we save here so that we don't create another transaction
    // with the same inputs after broadcasting on reload
    //
    this.saveWallet();

    return tx;

  }

  createToSlips(num, address, amount, change_amount) {
    var amt_per_slip = 1;
    if(num > amount) {
      amt_per_slip = 1;
      num = Math.floor(amount);
    } else {
      amt_per_slip = Math.floor(amount / num);
    }
    var remainder = amount % amt_per_slip;

    var to_slips = [];

    for (let i = 0; i < num; i++) {
        to_slips.push(new saito.slip(address, Big(amt_per_slip)));
        to_slips[to_slips.length - 1].type = 0;
    }

    if (Big(remainder).gt(0)) {
        to_slips.push(new saito.slip(address, Big(remainder)));
        to_slips[to_slips.length - 1].type = 0;
    }

    if (Big(change_amount).gt(0)) {
        to_slips.push(new saito.slip(this.app.wallet.returnPublicKey(), change_amount.toFixed(8)));
        to_slips[to_slips.length - 1].type = 0;
    }

    return to_slips;
  }



  createReplacementTransaction(oldtx) {

    let recipients = [];
    let outputs    = [];
    let inputs     = Big(0.0);
    let fee        = Big(0.0);

    //
    // calculate inputs
    //
    for (let z = 0; z < oldtx.transaction.from.length; z++) {
      inputs = inputs.plus(Big(oldtx.transaction.from[z].amt));
    }

    //
    // calculate outputs
    //
    for (let z = 0; z < oldtx.transaction.to.length; z++) {

      if (!recipients.includes(oldtx.transaction.to[z].add)) {
        recipients.push(oldtx.transaction.to[z].add);
        outputs.push(Big(0.0));
      }

      let ridx = 0;
      for (let zz = 0; zz < recipients.length; zz++) {
        if (recipients[zz] === oldtx.transaction.to[z].add) {
  	  ridx = zz;
  	  zz = recipients.length+1;
        }
      }

      outputs[ridx] = outputs[ridx].plus(Big(oldtx.transaction.to[z].amt));

    }


    //
    // calculate total fees paid
    //
    let total_fees = Big(0.0);
    for (let z = 0; z < outputs.length; z++) { total_fees = total_fees.plus(outputs[z]); }
    total_fees = total_fees.minus(inputs).times(-1);


    //
    // subtract outputs I am paying myself to figure out actual amount needed...
    //
    for (let z = 0; z < recipients.length; z++) {
      if (recipients[z] == this.returnPublicKey()) {
        inputs = inputs.minus(outputs[z]);
        outputs[z] = outputs[z].minus(outputs[z]);
      }
    }

    //
    // subtract fees from inputs
    //
    inputs = inputs.minus(total_fees);

    //
    // create the transaction
    //
    let tx           = new saito.transaction();

    let our_idx = 0;
    for (let z = 0; z < recipients.length; z++) {
      if (recipients[z] == this.returnPublicKey()) {
        our_idx = z; z = recipients.length+1;
      }
    }

    let newtx = this.createUnsignedTransaction(this.returnPublicKey(), outputs[our_idx].toString(), total_fees.toString());
    if (newtx == null) { return null; }

    //
    // add slips for other users / recipients
    //
    for (let z = 0; z < recipients.length; z++) {
      if (recipients[z] != this.returnPublicKey()) {

        if (outputs[z].eq(Big(0.0))) {
          newtx.transaction.to.push(new saito.slip(recipients[z]));
        } else {
          let newtx2 = this.createUnsignedTransaction(recipients[z], outputs[z].toString(), 0);
  	  if (newtx2 == null) { return null; }
	  for (let z = 0; z < newtx2.transaction.from.length; z++) {
	    newtx.transaction.from.push(newtx2.transaction.from[z]);
          }
	  for (let z = 0; z < newtx2.transaction.to.length; z++) {
	    newtx.transaction.to.push(newtx2.transaction.to[z]);
          }
        }
      }
    }

    newtx.transaction.ts = oldtx.transaction.ts;
    newtx.transaction.msg = oldtx.transaction.msg;
    newtx.transaction.msg.recreated = 1;

    //
    // we save here so that we don't create another transaction
    // with the same inputs after broadcasting on reload
    //
    this.saveWallet();
    return newtx;

  }

  ///////////////////////
  // PREFERRED CRYPTOS //
  ///////////////////////
  isOurPreferredCryptoAddress(address, ticker) {

    if (address == this.returnPublicKey()) { return 1; }

    return 0;

  }


  returnAvailableCryptos() {
    let cryptoModules = this.app.modules.returnModulesBySubType(AbstractCryptoModule);
    cryptoModules.push(this.saitoCrypo);
    return cryptoModules;
  }

  returnPreferredCrypto() {
    // TODO: Delete these three lines, they are a temporary fix needed to clean localstorage
    if (this.wallet.preferred_crypto === "Polkadot" || this.wallet.preferred_crypto === "Kusama" || this.wallet.preferred_crypto === "Westend" || this.wallet.preferred_crypto === "Saito"){
      this.setPreferredCrypto(this.saitoCrypo.ticker);
    }
    try {
      return this.returnCryptoModuleByTicker(this.wallet.preferred_crypto);
    } catch(err) {
      if(err.startsWith("Module Not Found:")) {
        this.setPreferredCrypto("SAITO");
        return this.returnCryptoModuleByTicker(this.wallet.preferred_crypto);
      } else {
        throw err;
      }
    }   
  }

  
  async returnPreferredCryptoBalances(addresses=[], mycallback=null, ticker="") {
    if (ticker == "") { ticker = this.wallet.preferred_crypto; }
    let cryptomod = this.returnCryptoModuleByTicker(ticker);
    let returnObj = [];
    let balancePromises = [];
    for (let i = 0; i < addresses.length; i++) {
      balancePromises.push(cryptomod.returnBalance(addresses[i]));
    }
    let balances = await Promise.all(balancePromises);
    for (let i = 0; i < addresses.length; i++) {
      returnObj.push({address: addresses[i], balance: balances[i]});
    }
    if (mycallback != null) { mycallback(robj); }
    return returnObj;
  }
  //
  // checks the balance available in the crypto module for the 
  // address or addresses provided. mycallback and ticker are
  // optional.
  //
  async returnPreferredCryptoBalance(addresses=[], mycallback=null, ticker="") {

    //
    // TODO - cleanup API once we're done so we don't need this kind
    // of overloading in the function definition.
    //
    let preferred_crypto = ticker;
    if (ticker == "") { preferred_crypto = this.wallet.preferred_crypto; }

    //
    // fetch desired module to do the heavy lifting
    //
    let cryptomod = this.returnCryptoModuleByTicker(preferred_crypto);

    //
    // create object to store results we will return
    //
    let robj = {};
    robj.address = addresses;
    robj.balance = [];
    robj.status  = [];

    let actively_querying_api = 0;

    for (let i = 0; i < robj.address.length; i++) {
      robj.balance.push(0);
      robj.status.push(0);
    }

    //
    // API-balance-check loop
    //
    // this loop runs in perpetuity until it is able to check the balances for all of the 
    // addresses provided. if an invalid address is provided or an error is provided we can
    // edit this or the return object.
    //
    for (let i = 0; i < robj.status.length; i++) {
      if (robj.status[i] == 0) {
        robj.balance[i] = await cryptomod.returnBalance(robj.address[i]);
        robj.status[i] = 1;
      }
    }

    let can_we_resolve = 1;
    for (let i = 0; i < robj.status.length; i++) {
      if (robj.status[i] == 0) { can_we_resolve = 0; }
    }

    if (can_we_resolve == 1) {
      if (mycallback != null) { mycallback(robj); }
      return robj;
    }

  }

  async sendPayment(senders=[], receivers=[], amounts=[], timestamp, mycallback=null, ticker) {

    //
    // if payment already made, return
    //
    if (this.doesPreferredCryptoTransactionExist(senders, receivers, amounts, timestamp, ticker)) {
      if (mycallback != null) { mycallback(); }
      return 1;
    }
    
    //
    // otherwise make the payment
    //
    // let cryptomod = this.returnCryptoModuleByTicker(ticker);
    // if(senders.length != receivers.length || senders.length != amounts.length) {
    //   throw "lenghts of senders, receivers, and amounts must be the same";
    // }
    // 
    // for(let i = 0; i < senders.length; i++) {
    //   if(senders[i] === this.wallet.publickey) {
    //     let data = {
    //       ticker: ticker,
    //     };
    //     // this.app.network.peers[0].sendRequestWithCallbackAndRetry("relayPeerMessage2", data, callback.bind(this));
    //     let relay_mod = this.app.modules.returnModule('Relay');
    //     // relay_mod.sendRelayMessageWithRetry("cryptoAddressRequest", data, callback.bind(this));
    //     relay_mod.sendRelayMessageToRecipientWithRetry("cryptoAddressRequest", receivers[i], data, function(res) {
    //       if (!res.err) {
    // 
    //         console.log("GOT RESPONSE");
    //         console.log(res);
    //       } else if(res.err == "Peer not found"){
    //         throw "Error, peer is not connected to peer[0]";
    //       } else {
    //         throw "Unknown error sending peer request";
    //       }
    //     });
    //   }
    // }
  
    //
    // save local reference to it
    //
    this.savePreferredCryptoTransaction(senders, receivers, amounts, timestamp, ticker);
    //
    // and execute callback if exists
    //
    if (mycallback != null) { mycallback(); }
    return 1;
  };

  async receivePayment(senders=[], receivers=[], amounts=[], timestamp, mycallback=null, ticker) {

    let wallet_self = this;

    //
    // if payment already receive, return
    //
    if (this.doesPreferredCryptoTransactionExist(senders, receivers, amounts, timestamp, ticker)) {
      if (mycallback != null) { mycallback(); }
      return 1;
    }

    //
    // create a function we can loop through to check if the payment has come in....
    //
    let check_payment_function = async function() {

      //
      // check if payment was made
      //

      //
      // 1 = yes, 0 = no
      //
      return 1;

    };

    //
    // now start a loop that checks this function, and executes the callback when payment is received
    //
    let has_payment_been_received = await check_payment_function();
    if (!has_payment_been_received) {
      let receive_payment_timer = setInterval(async () => {

        let inner_has_payment_been_received = await check_payment_function();
        if (inner_has_payment_been_received) {

	  //
	  // save the tx
	  //
          this.savePreferredCryptoTransaction(senders, receivers, amounts, timestamp, ticker);

	  //
	  // clear timer
	  //
	  clearInterval(receive_payment_timer);

	  //
	  // and exit
	  //

          if (mycallback != null) { mycallback(); }
	  return 1;
	}

      }, 5000);

    } else {

      //
      // save the tx
      //
      this.savePreferredCryptoTransaction(senders, receivers, amounts, timestamp, ticker);

      //
      // and exit
      //
      if (mycallback != null) { mycallback(); }
      return 1;

    }

  }


  savePreferredCryptoTransaction(senders=[], receivers=[], amounts, timestamp, ticker) {

    let sig = this.app.crypto.hash(JSON.stringify(senders) + JSON.stringify(receivers) + JSON.stringify(amounts) + timestamp + ticker);    
    this.wallet.preferred_txs.push({
      sig : sig,
      ts  : (new Date().getTime())
    })

    for (let i = this.wallet.preferred_txs.length-1; i >= 0; i--) {
      // delete references after ~30 hours
      if (this.wallet.ts < ((new Date().getTime()) - 100000000)) {
	this.wallet.preferred_txs.splice(i, 1);
      }
    }

    this.saveWallet();

    return 1;
  }



  doesPreferredCryptoTransactionExist(senders=[], receivers=[], amounts, timestamp, ticker) {
    let sig = this.app.crypto.hash(JSON.stringify(senders) + JSON.stringify(receivers) + JSON.stringify(amounts) + timestamp + ticker);    
    for (let i = 0; i < this.wallet.preferred_txs.length; i++) {
      if (this.wallet.preferred_txs[i].sig === sig) {
        return 1;
      }
    }
    return 0;
  }


  


  returnCryptoModuleByTicker(ticker) {
    let mods = this.returnAvailableCryptos();
    for (let i = 0; i < mods.length; i++) {
      if (mods[i].ticker === ticker) { return mods[i]; }
    }
    throw "Module Not Found: " + ticker;
  }

  setPreferredCrypto(ticker) {
    let can_we_do_this = 0;
    let mods = this.returnAvailableCryptos();
    for (let i = 0; i < mods.length; i++) {
      if (mods[i].ticker === ticker) { can_we_do_this = 1; }
    }
    if (ticker == "SAITO") { can_we_do_this = 1; }

    if (can_we_do_this == 1) {
      this.wallet.preferred_crypto = ticker;
      this.saveWallet();
      this.app.connection.emit("set_preferred_crypto", ticker);
    }

    return;
  }
  ///////////////////////////
  // END PREFERRED CRYPTOS //
  ///////////////////////////

}
module.exports = Wallet;

