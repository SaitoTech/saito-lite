'use strict';
const Big = require('big.js')
const saito = require('./saito');
const path = require('path');

class Mempool {

  constructor(app) {
    this.app                      = app || {};

    //
    //
    //
    this.directory                = path.join(__dirname, '../../data/');
    this.blocks                   = [];
    this.transactions             = [];

    //
    // work in mempool
    //
    this.routing_work_needed 	  = 0.0;
    this.routing_work_in_mempool  = 0.0;

    //
    // mempool safety caps
    //
    //this.transaction_size_cap     = 1024000000;// bytes hardcap 1GB
    this.transaction_size_cap     = 25600000;// bytes hardcap 25 MB <-- reduced to prevent zipped applications from causing problems
    this.transaction_size_current = 0.0;
    this.block_size_cap           = 1024000000; // bytes hardcap 1GB
    this.block_size_current       = 0.0;


    //
    // removing block and transactions
    //
    this.clearing_active          = false;
    this.accept_zero_fee_txs      = true;

    //
    // processing timer
    //
    this.processing_active        = false;
    this.processing_speed         = 10;
    this.processing_timer         = null;

    //
    // bundling timer
    //
    this.bundling_active          = false;
    this.bundling_speed           = 1000;
    this.bundling_timer           = null;

    //
    // hashmap
    //
    this.transactions_hmap        = [];  // index is tx.transaction.sig
    this.transactions_inputs_hmap = [];  // index is slip returnSignatureSource()

    // downloads
    //
    this.downloads                = {};
    this.downloads_hmap           = {};
    this.downloading_active       = 0;
    this.block_sample_size        = 15;

  }

  canBundleBlock() {
    
    if (this.app.blockchain.indexing_active == true)			{ 
      console.log("CANNOT PRODUCE AS ACTIVE INDEXING BLOCK");
      return 0;
    }
    if (this.app.blockchain.loading_blocks_from_disk_active == 1) 	{
      console.log("CANNOT PRODUCE AS LOADING FROM DISK");
      return 0;
    }
    if (this.app.network.downloading_active == 1)			{
      console.log("CANNOT PRODUCE AS DOWNLOADING ACTIVE");
      return 0;
    }
    if (this.bundling_active == true) 					{
      console.log("CANNOT PRODUCE AS BUNDLING ACTIVE");
      return 0;
    }
    if (this.processing_active == true) 				{
      console.log("CANNOT PRODUCE AS PROCESSING ACTIVE");
      return 0;
    }
    if (this.clearing_active == true) 					{
      console.log("CANNOT PRODUCE AS CLEARING ACTIVE");
      return 0;
    }
    if (this.blocks.length > 0)						{
      console.log("CANNOT PRODUCE AS BLOCKS WAITING FOR PROCESSING");
      return 0; 
    }
    if (this.transactions.length == 0)			{ 
      if (this.app.blockchain.last_bid > 1) {
        console.log("CANNOT PRODUCE AS NO TXS and LAST_BID > 1");
        return 0; 
      }
    }
    if (this.app.options) {
      if (this.app.options.wallet) {
        if (this.app.options.wallet.bundleBlocks && this.app.options.wallet.bundleBlocks == "0") {
          return 0;
        }
      }
      if (this.app.options.peers) {
        if (this.app.options)
        if (this.app.options.peers.length > 0 && this.app.blockchain.index.blocks.length == 0) {
	  console.log("ERROR: 502843: refusing to self-generate block #1 as we have defined peers...");
	  return 0;
	}
      }
    }

    let prevblk = this.app.blockchain.returnLatestBlock();

    if (prevblk != null) {
      this.routing_work_needed = this.app.burnfee.returnWorkNeeded(prevblk.block.ts, (new Date().getTime()), prevblk.block.bf);
    } else {
      this.routing_work_needed = this.app.burnfee.returnWorkNeeded();
    }

    //
    // TODO - optimize so we don't always recalculate
    //
    this.routing_work_in_mempool = parseFloat(this.returnRoutingWorkAvailable());

    console.log("Total Work Needed: " + this.routing_work_needed + " ---- available ---> " + this.routing_work_in_mempool + "     (" + this.app.wallet.returnBalance() + ")");

    if (this.routing_work_in_mempool >= this.routing_work_needed) {
      return 1;
    }
    return 0;

  }

  calculateRoutingWorkAvailable() {
    this.routing_work_in_mempool = 0;
    for (let i = 0; i < this.transactions.length; i++) {
      this.routing_work_in_mempool += this.transactions[i].returnWorkAvailable();
    }

  }

  //
  // !!!!!!!! NOT FINISHED !!!!!
  //
  containsBlock(blk) {

    if (blk == null)                  { return 0; }
    if (blk.block == null)	    { return 0; }
    if (blk.is_valid == 0) 	    { return 0; }

    if (this.blocks_hmap[blk.block.sig] == 1) { return 1; }

    return 0;
  }


  containsTransaction(tx) {

    if (tx == null)                  { return 0; }
    if (tx.transaction == null)      { return 0; }
    if (tx.transaction.from == null) { return 0; }

    if (this.transactions_hmap[tx.transaction.sig] == 1) { 
      return 1; 
    }

    for (let i = 0; i < tx.transaction.from.length; i++) {
      if (tx.transaction.from[i].isNonZeroAmount()) {
        let slip_index = tx.transaction.from[i].returnSignatureSource();
        if (this.transactions_inputs_hmap[slip_index] == 1) {
          return 1;
        }
      } else {
      }
    }
    return 0;
  }


  containsGoldenTicket() {
    for (let m = 0; m < this.transactions.length; m++) {
      if (this.transactions[m].isGoldenTicket() == 1) { return 1; }
    }
    return 0;
  }

  resetTransactions() {

    this.transactions = [];
    this.transactions_hmap        = [];  // index is tx.transaction.sig
    this.transactions_inputs_hmap = [];  // index is slip returnSignatureSource()
    this.transaction_size_current = 0;

  }

  initialize() {

    if (this.app.BROWSER == 1) { return; }
    if (this.app.SPVMODE == 1) { return; }

    

    try {
      this.bundling_timer = setInterval(async () => {
        if (this.canBundleBlock()) { 
	  await this.bundleBlock();
	}
      }, this.bundling_speed);
    } catch (err) {
      console.log(err);
      this.bundling_active          = false;
      this.bundling_speed           = 1000;
      this.bundling_timer           = null;
    }
  }

  returnRoutingWorkNeeded(prevblk) {
    this.routing_work_needed = this.app.burnfee.returnRoutingWorkNeeded(prevblk);
    return this.routing_work_needed;
  }

  returnRoutingWorkAvailable() {

    let v = Big(0);

    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].is_valid == 1) {
        let available_work = Big(this.transactions[i].returnRoutingWorkAvailable(this.app, this.app.wallet.returnPublicKey()));

        if (this.transactions[i].transaction.type == 1) {
          if (this.transactions[i].returnMessage().target != this.app.blockchain.returnLatestBlockHash()) { available_work = Big(0); }
        }

        v = v.plus(available_work);
      }
    }
//
// causes issues
//
//    v = v.times(100000000);
    return v.toFixed(8);

  }

  addBlock(blk) {

    if (blk == null) { return false; }
    if (!blk.is_valid) { return false; }


    //
    // confirm this will not cause memory-exhaustion attacks
    //
    if ( (this.block_size_current + blk.size) > this.block_size_cap) {
      console.log("ERROR 629384: mempool block queue at size limit");
      return;
    }

    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].returnHash() == blk.returnHash()) { return false; }
    }

    this.blocks.push(blk);
    this.block_size_current += blk.size;

    //
    // and process!
    //
    this.processBlockQueue();

    return true;
  }


  addTransaction(tx) {

    //
    // ensure TX is valid
    //
    if (!tx.validate(this.app, (this.app.blockchain.last_bid+1))) {

      //
      // golden tickets are OK
      //
      if (tx.transaction.type != 1) {
        console.log("ERROR 471293: not importing invalid transaction to mempool");
        return;
      }
    }

    //
    // sanity check for 0-fee txs
    //
    if (Big(tx.returnFees(this.app)).lte(0)) {
      if (Big(tx.returnFees(this.app)).eq(0)) {
        if (this.accept_zero_fee_txs == false) {
          return;
        }
      } else {
	console.log("ERROR 481023: not importing invalid transaction with negative fees to mempool");
	return;
      }
    }

    //
    // check not already in mempool
    //
    if (this.containsTransaction(tx) == 1) { 
      console.log("ERROR 582039: mempool already contains this transaction...");

      // sanity check
      if (this.routing_work_needed == 0 && this.bundling_timer == null) {
        console.log("Routing work is zero and bundling timer is inactive -- restarting bundle loop");
        this.initialize();
      }
      return; 
    }

    //
    // respect size restrictions
    //
    if (tx.size > this.transaction_size_cap) {
      console.log("ERROR 582034: mempool asked to add tx over "+this.transaction_size_cap+" bytes");
      return; 
    } 

    //
    // add to mempool and transaction_hmap
    //
    this.transactions_hmap[tx.transaction.sig] = 1;
    for (let i = 0; i < tx.transaction.from.length; i++) {
      if (tx.transaction.from[i].isNonZeroAmount()) {
        this.transactions_inputs_hmap[tx.transaction.from[i].returnSignatureSource()] = 1;
      }
    }

    //
    // record transaction size and mempool count
    //
    this.transaction_size_current += tx.size;



    //
    // push into mempool
    //
    this.transactions.push(tx);

    return 1;

  }

  processBlockQueue() {

    if (this.processing_active == 1) { return; }
    this.processing_active = 1;

    //
    // sort our block queue before adding to chain
    this.blocks.sort((a,b) => a.block.id - b.block.id);

    try {
      this.processing_timer = setInterval(async () => {
        if (this.blocks.length > 0) {
          if (this.app.blockchain.indexing_active == 0) {
            let blk = this.blocks.shift();
            await this.app.blockchain.addBlockToBlockchain(blk);
          }
        } else {
          this.processing_active = 0;
          clearInterval(this.processing_timer);
        }

      }, this.processing_speed);
    } catch (err) {
      console.log(err);
    }
  }

  async bundleBlock() {

    //
    // bundling
    //
    if (this.bundling_active == true) {
      console.log("ERROR 850293: currently bundling a block, cannot bundle new one.");
      return;
    }
    this.bundling_active = true;


    //
    // don't spam the public network
    //
    if (this.transactions.length == 1) {
      if (! this.app.network.isPrivateNetwork() || this.app.network.isProductionNetwork()) {
        if (this.transactions[0].transaction.type == 1) {
          console.log("WARNING 582034: refusing to spam public network with no-tx blocks.");
          this.bundling_active = false;
          return;
        }
      }
    }

    //
    // don't spam the public network
    //
    if (this.app.blockchain.index.blocks.length == 0) {
      if (this.app.options) {
        if (this.app.options.peers) {
          if (this.app.options.peers.length > 0)  {
            console.log("WARNING 582034: refusing to spam public network with no-tx blocks.");
            this.bundling_active = false;
            return;
          }
        }
      }
    }


    //
    // create block
    //
    try {

      let blk = new saito.block(this.app);
      let prevblk = this.app.blockchain.returnLatestBlock();
      blk.block.creator = this.app.wallet.returnPublicKey();

      if (prevblk != null) {
        blk.block.prevbsh = prevblk.returnHash();
      }


      //
      // add mempool transactions
      //
      for (let i = 0; i < this.transactions.length; i++) {

        let addtx = 1;
	let removed_tx = 0;

        //
        // outdated golden ticket
        //
        if (this.transactions[i].transaction.type == 1) {
          if (this.transactions[i].returnMessage().target != prevblk.returnHash()) {
            this.transactions.splice(i, 1);
            this.bundling_active = false;
	    removed_tx = 1;
            return;
          }
        }

        //
        // invalid transaction
        //
        if (addtx == 1) {
          if (this.transactions[i].is_valid == 0) {
            console.log("deciding not to add this TX: " + JSON.stringify(this.transactions[i].transaction));
            addtx = 0;
          }
        }
        if (addtx == 1) {
          //
          // TODO: clone the tx so that future mutation of mempool tx does not mutate onchain data
          // or block data
          //
          // let cloned_tx = this.transactions[i].clone();
          blk.transactions.push(this.transactions[i]);
        } else {
          if (removed_tx == 0) {
            if (this.transactions[i].is_valid == 0) {
              this.transactions.splice(i, 1);
	      removed_tx = 1;
              i--;
            }
          }
        }
      }


      //
      // queue and process - above sanity check
      //
      await blk.bundle(prevblk);


      //
      // sanity check
      //
      // if the number of transactions in the block == 0 then
      // we have put together a block with NOTHING and there
      // has been some sort of error. In this case we empty
      // our entire mempool as a sanity check, and print out
      // an error message....
      //
      if (blk.transactions.length == 0 && blk.block.id > 10) {

        console.log("ERROR 51958: produced block with zero transactions. Aborting.");

        this.resetTransactions();
        this.app.miner.stopMining();
        this.app.miner.startMining(this.app.blockchain.returnLatestBlock());
        this.bundling_active = false;
        return;

      }

      if (blk.is_valid == 0) {
        console.log("ERROR 105812: block invalid when bundling. Aborting block bundling...");
        this.bundling_active = false;
        return;
      }

      //
      // add it to mempool
      //
      this.addBlock(blk);

    } catch(err) {
      console.log("ERROR 781029: unexpected problem bundling block in mempool: " + err);
    }

    //
    // reset
    //
    this.bundling_active = false;

  }

  removeBlock(blk=null) {
    if (blk == null) { return; }
    this.clearing_active = true;
    for (let b = this.blocks.length-1; b >= 0; b--) {
      if (this.blocks[b].returnHash() == blk.returnHash()) {
        this.block_size_current -= this.blocks[b].size;
        this.blocks.splice(b, 1);
      }
    }
    this.clearing_active = false;
  }

  removeBlockAndTransactions(blk=null) {

    if (blk == null) { return; }

    this.clearing_active = true;

    //
    // lets make some hmaps
    //
    let mempool_transactions = [];
    let replacement          = [];

    //
    // create hashmap for mempool transactions
    //
    for (let b = 0; b < this.transactions.length; b++) {
      mempool_transactions[this.transactions[b].transaction.sig] = b;
    }

    //
    // set hashmap value to -1 for all txs in block
    //
    for (let b = 0; b < blk.transactions.length; b++) {
      let location_in_mempool = mempool_transactions[blk.transactions[b].transaction.sig];
      if (location_in_mempool != undefined) {
        mempool_transactions[blk.transactions[b].transaction.sig] = -1;
        this.transaction_size_current -= this.transactions[location_in_mempool].size;
      }
    }

    //
    // delete any old golden tickets
    //
    for (let b = 0; b < this.transactions.length; b++) {
      if (this.transactions[b].transaction.type == 1) {
        if (this.transactions[b].transaction.ts < blk.block.ts) {
          let location_in_mempool = mempool_transactions[this.transactions[b].transaction.sig];
          if (location_in_mempool != undefined) {

	    // if not in block
	    if (mempool_transactions[this.transactions[b].transaction.sig] != -1) {
              mempool_transactions[this.transactions[b].transaction.sig] = -1;
              this.transaction_size_current -= this.transactions[location_in_mempool].size;


	      //
	      // delete utxos from purged GTs
	      //
              delete this.transactions_hmap[this.transactions[b].transaction.sig];
              for (let i = 0; i < this.transactions[b].transaction.from.length; i++) {
        	delete this.transactions_inputs_hmap[this.transactions[b].transaction.from[i].returnSignatureSource()];
	      }

	    }
	  }
	}
      }
    }


    //
    // fill our replacement array with all non -1 values
    //
    for (let t = 0; t < this.transactions.length; t++) {
      if (mempool_transactions[this.transactions[t].transaction.sig] > -1) {
        replacement.push(this.transactions[t]);
      } else {
        //console.log("TX DROPPED");
        //console.log(this.transactions[t]);
      }
    }

    this.transactions = replacement;

    //
    // and delete UTXO too
    //
    for (let b = 0; b < blk.transactions.length; b++) {
      delete this.transactions_hmap[blk.transactions[b].transaction.sig];
      for (let i = 0; i < blk.transactions[b].transaction.from.length; i++) {
        delete this.transactions_inputs_hmap[blk.transactions[b].transaction.from[i].returnSignatureSource()];
      }
    }

    this.removeBlock(blk);
    this.clearing_active = false;

  }


}

module.exports = Mempool;
