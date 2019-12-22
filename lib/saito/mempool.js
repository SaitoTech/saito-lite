'use strict';
const Big = require('big.js')
const saito = require('./saito');
const path = require('path');
const axios = require('axios');


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
    this.transaction_size_cap     = 1024000000;// bytes hardcap 1GB
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
    this.processing_speed         = 2000;
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

    return this;
  }

  canBundleBlock() {

    if (this.app.blockchain.indexing_active == true)	{ return 0; }
    if (this.bundling_active == true) 			{ return 0; }
    if (this.processing_active == true) 		{ return 0; }
    if (this.clearing_active == true) 			{ return 0; }
    if (this.blocks.length > 0)				{ return 0; }

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

    if (this.transactions_hmap[tx.transaction.sig] == 1) { return 1; }
    for (let i = 0; i < tx.transaction.from.length; i++) {
      var slip_index = tx.transaction.from[i].returnSignatureSource();
      if (this.transactions_inputs_hmap[slip_index] == 1) {
        return 1;
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
          if (this.transactions[i].transaction.msg.target != this.app.blockchain.returnLatestBlockHash()) { available_work = Big(0); }
        }

        v = v.plus(available_work);
      }
    }
    v = v.times(100000000);
    return v.toFixed(0);

  }

  /**
   * Add block hash to downloads queue based on peer. Updates download hashmap to track blocks in queue
   *
   * @param {saito.peer} peer who we're getting our block from
   * @param {string} bhash block hash
   */
  addBlockToQueue(peer, bhash) {
    //
    // avoid dupes
    //
    if (this.app.blockchain.isHashIndexed(bhash) == 1) {
      return;
    }
    if (this.downloads_hmap[bhash] == 1) {
      return;
    }

    let peer_publickey = peer.returnPublicKey();

    if (this.downloads[peer_publickey] == null) {
      this.downloads[peer_publickey] = [];
      this.downloads[peer_publickey].push(bhash)
    } else {
      this.downloads[peer_publickey].push(bhash)
    }
    this.downloads_hmap[bhash] = 1;
  }

  /**
   * Fetches blocks in our download queue then processes downloaded blocks
   */
  async fetchBlocks() {
    // blocks are being fetched already
    if (this.downloading_active == 1) {
      return;
    }

    this.downloading_active = 1;

    // iterate through our download que. Key is peer publickey
    for (var key in this.downloads) {
      while (this.downloads[key].length > 0) {
        let block_hashes = this.downloads[key].splice(0, this.block_sample_size);
        let peer = this.app.network.returnPeerByPublicKey(key)
        if (peer != null) {
          let block_to_download_url = peer.returnBlockURL(block_hashes)

          if (block_hashes.length > 1) {
            await this.fetchMultipleBlocks(block_to_download_url, block_hashes, [this.app.wallet.returnPublicKey()]);
          } else {
            await this.fetchSingleBlock(block_to_download_url, block_hashes[0]);
          }
        } else {
          console.log("Couldn't find peer by key, attemping to re-establish peer connections");
          this.app.network.initialize();
        }
      }
      delete this.downloads[key];
    }
    this.downloading_active = 0;

    this.processBlockQueue();
  }

  /**
   * Fetches single block from endpoint
   *
   * @param {URL} block_to_download_url url endpoint to fetch from
   * @param {string} bhash fetched block hash
   **/
  async fetchSingleBlock(block_to_download_url, bhash) {
    // if ( this.block_size_current <= this.block_size_cap ) {

      try {
        let options = {
          method: 'GET',
          headers: {'content-type': 'application/json' },
          // data: { blocks, publickeys },
          proxy: false,
          url: block_to_download_url
        }
        let response = await axios(options);
        let body = response.data;

        let blk = new saito.block(this.app, body);

        if (blk.block.ts > new Date().getTime() + 60000) {
          console.log("block appears to be from the future, dropping...");
          return;
        }

        if (blk.is_valid == 0 && this.app.BROWSER == 0) {
          return;
        }

        this.addBlock(blk)
      } catch(err) {
        console.error(err);
      }

      delete this.downloads_hmap[bhash];
    // }
  }

  /**
   * Fetch multiple blocks from endpoint
   *
   * @param {URL} block_to_download_url url endpoint to fetch from
   * @param {Array.<saito.block>} blocks list of bhashes being fetched
   * @param {Array.string} publickeys list of keys we want transactions for
   */
  async fetchMultipleBlocks(block_to_download_url, blocks, publickeys=[]) {
    try {
      let options = {
        method: 'POST',
        headers: {'content-type': 'application/json' },
        data: { blocks, publickeys },
        proxy: false,
        url: block_to_download_url
      }
      let response = await axios(options);
      //let response = await axios.post(block_to_download_url, { blocks, publickeys });
      response.data.payload.blocks.forEach((body, index) => {
        let blk = new saito.block(this.app, body);

        if (blk.block.ts > new Date().getTime() + 60000) {
          console.log("block appears to be from the future, dropping...");
          return;
        }

        if (blk.is_valid == 0 && this.app.BROWSER == 0) {
          return;
        }

        this.addBlock(blk);

        delete this.downloads_hmap[blocks[index]];
      });
    } catch(err) {
      console.log(err);
    }
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

    if (this.blocks.length > 0) {
      this.processBlockQueue();
    }

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
    if (Big(tx.returnFees(this.app)).eq(0)) {
      if (this.accept_zero_fee_txs == false) {
        return;
      }
    }
    this.transactions.push(tx);

    return 1;

  }

  processBlockQueue() {

    if (this.processing_timer == 1) { return; }
    this.processing_timer = 1;

    try {
      this.processing_timer = setInterval(async () => {
        if (this.blocks.length > 0) {
          if (this.app.blockchain.indexing_active == 0) {
            let blk = this.blocks.shift();
            await this.app.blockchain.addBlockToBlockchain(blk);
          }
        } else {
          this.processing_timer = 0;
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
console.log("ERROR 582034: refusing to spam public network with no-tx blocks.");
          this.bundling_active = false;
          return;
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

        //
        // outdated golden ticket
        //
        if (this.transactions[i].transaction.type == 1) {
          if (this.transactions[i].transaction.msg.target != prevblk.returnHash()) {
            this.transactions.splice(i, 1);
            this.bundling_active = false;
            return;
          }
        }
        //
        // invalid transaction
        //
        if (this.transactions[i].is_valid == 0) {
	  console.log("deciding not to add this TX: " + JSON.stringify(this.transactions[i].transaction));
          addtx = 0;
        }

        if (addtx == 1) {
	  //
          // TODO: clone the tx so that future mutation of mempool tx does not mutate onchain data
          // or block data
          //
          // let cloned_tx = this.transactions[i].clone();
          blk.transactions.push(this.transactions[i]);
        } else {
          if (this.transactions[i].is_valid == 0) {
            this.transactions.splice(i, 1);
            i--;
          }
        }
      }


      //
      // sanity check
      //
      // if the number of transactions in the block == 0 then
      // we have put together a block with NOTHING and there
      // has been some sort of error. In this case we empty
      // our entire mempool as a sanity check, and print out
      // an error message....
      //
      if (blk.transactions.length == 0 && blk.block.id > 1) {

        console.log("ERROR 51958: produced block with zero transactions. Aborting.");

        this.resetTransactions();
        this.app.miner.stopMining();
        this.app.miner.startMining(this.app.blockchain.returnLatestBlock());
        this.bundling_active = false;
        return;

      }

      //
      // queue and process
      //
      await blk.bundle(prevblk);

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
    // find location of block transactions in mempool
    //
    for (let b = 0; b < blk.transactions.length; b++) {
      let location_in_mempool = mempool_transactions[blk.transactions[b].transaction.sig];
      if (location_in_mempool != undefined) {
        this.transactions[location_in_mempool].may_be_removed_from_mempool = 1;
        this.transaction_size_current -= this.transactions[location_in_mempool].size;
      }
    }

    //
    // fill our replacement array
    //
    for (let t = 0; t < this.transactions.length; t++) {
      if (this.transactions[t].may_be_removed_from_mempool != 1) {
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



