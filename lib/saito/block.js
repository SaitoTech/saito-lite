'use strict';

const saito = require('./saito');
const Big = require('big.js');


class Block {

  constructor(app, blkjson = "", txsjson = "", confirmations = -1) {

    this.app = app || {***REMOVED***;

    //
    // consensus variables
    //
    this.block 		        = {***REMOVED***;
    this.block.ts 	      	= new Date().getTime();
    this.block.prevbsh 		= "";
    this.block.merkle 	  	= "";
    this.block.creator 	  	= "";
    this.block.id 	      	= 1;
    this.block.bf 	      	= 0; 
    this.block.difficulty 	= 0.0;
    this.block.paysplit 	= 0.5;
    this.block.powsplit 	= 0.5;
    this.block.treasury 	= Big("2868100000.0");  // TODO
                                                ***REMOVED***
                                                ***REMOVED*** fix treasury amount
                                                ***REMOVED***
    this.block.stakepool  	= Big("0");		
    this.block.coinbase 	= Big("0.0");
    this.block.reclaimed 	= Big("0.0");
    this.block.sr 	      	= 0;			// 0 - staking table not refreshed
                                                ***REMOVED*** 1 - staking table refreshed

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

    this.size_in_bytes 	= 0;   ***REMOVED*** size of block in bytes
    this.hash 		= "";  ***REMOVED*** block hash == hash(this.prehash+last_block.hash)
    this.prehash 		= "";  ***REMOVED*** hash of signature
    this.filename 	= "";  ***REMOVED*** name of file on disk if set

    this.confirmations = confirmations;

    this.is_valid = 1;   ***REMOVED*** set to zero if there is an


    //
    // import block headers
    //
    if (blkjson != "") {
      try {
***REMOVED*** if (typeof blkjson === 'string') {
***REMOVED***   this.block = JSON.parse(blkjson.toString("utf8"));
***REMOVED*** ***REMOVED*** else {
        this.block = blkjson.block;
        this.transactions = blkjson.transactions.map(tx => new saito.transaction(tx.transaction));
***REMOVED*** ***REMOVED***
  ***REMOVED*** catch (err) {
        this.is_valid = 0;
        return;
  ***REMOVED***
***REMOVED***


    return this;
  ***REMOVED***



  affixCallbacks() {
    for (let z = 0; z < this.transactions.length; z++) {
      var txmsg = this.transactions[z].returnMessage();
      this.app.modules.affixCallbacks(this.transactions[z], z, txmsg, this.callbacks, this.callbacksTx, this.app);
***REMOVED***
  ***REMOVED***



  async bundle(prevblk=null) {

    let mintxid = 1;
    let tx_sigs = [];

    //
    // default values
    //
    if (prevblk != null) {

      this.block.id 		= prevblk.block.id + 1;
      this.block.treasury 	= Big(prevblk.block.treasury).plus(Big(prevblk.block.reclaimed));
      this.block.coinbase 	= Big(this.block.treasury).div(this.app.blockchain.genesis_period).toFixed(8);
      this.block.treasury 	= this.block.treasury.minus(Big(this.block.coinbase)).toFixed(8);
      this.block.prevbsh 	= prevblk.returnHash();
      this.block.difficulty 	= prevblk.block.difficulty;
      this.block.paysplit 	= prevblk.block.paysplit;
      this.block.powsplit 	= prevblk.block.powsplit;
      this.block.ts		= new Date().getTime();
      this.block.bf 		= this.app.burnfee.returnBurnFee(prevblk, this);
      if (prevblk.transactions.length == 0) {
        mintxid			= prevblk.returnMaxTxId();
        if (mintxid == 0) 	{ mintxid = 1; ***REMOVED***
  ***REMOVED*** else {
        mintxid			= prevblk.returnMaxTxId() + 1;
  ***REMOVED***
***REMOVED***


    //
    // initial token allocation
    //
    if (this.block.id == 1) {

      let tx = new saito.transaction();
      tx.transaction.to.push(new saito.slip(
	"1HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"2HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"3HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"4HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf",
	1000000000,
	3,
	0,
	0,
	0,
	"",
	1
      ));
      tx.transaction.to.push(new saito.slip(
	"5HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf",
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
// staking tx
//
      tx = new saito.transaction();
      tx.transaction.to.push(new saito.slip(
	"1HL52n9iWBKFDyMTVpvuKNEHt2fZQUxDebpiBaqwkWMf",
	6000000,
	4,
	0,
	0,
	0,
	"",
	1
      ));
/****
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
      tx.transaction.id = 2;
      tx = this.app.wallet.signTransaction(tx);
      this.transactions.push(tx);
****/
***REMOVED***




    //
    // reclaimed funds are the tokens that are
    // unspent in the block 1 GENESIS period ago
    // and thus will fall off the chain with the 
    // addition of this block.
    //
    // we add these to our treasury in the next 
    // block (see above)
    //
    let eblkd = await this.calculateRebroadcasts();

    //
    // reclaimed txs
    //
    this.block.reclaimed = eblkd.reclaimed;


    //
    // automatic transaction rebroadcasting (added 1-by-1 at end)
    //
    let rebroadcast_amt = Big(0.0);
    for (let i = 0; i < eblkd.rebroadcast.length; i++) {
      for (let ii = 0; ii < eblkd.rebroadcast[i].transaction.to.length; ii++) {
        rebroadcast_amt = rebroadcast_amt.plus(Big(eblkd.rebroadcast[i].transaction.to[ii].amt));
  ***REMOVED***
      this.transactions.push(eblkd.rebroadcast[i]);
***REMOVED***



    //
    // now check transactions
    //
    let number_of_golden_tickets = 0;

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
        if (number_of_golden_tickets > 1) {
          console.log("ERROR 412523: second golden ticket found in block");
          this.is_valid = 0;
          return this;
    ***REMOVED***

***REMOVED***
***REMOVED*** payments and monetary policy
***REMOVED***
        if (prevblk != null) {

          let payments = prevblk.returnBlockPayouts(this.transactions[i].transaction.msg);

  ***REMOVED***
  ***REMOVED*** add reclaimed from block
  ***REMOVED***
          this.block.reclaimed = Big(this.block.reclaimed).plus(Big(payments.reclaimed)).toFixed(8);

          let slips = [];

          payments.blocks.forEach((block) => {
            if (block.producer_share > 0) {
              slips.push(new saito.slip(block.producer_publickey, block.producer_share, 2));
        ***REMOVED***
            if (block.miner_share > 0) {
              slips.push(new saito.slip(block.miner_publickey, block.miner_share, 2));
        ***REMOVED***
            if (block.router_share > 0) {
              slips.push(new saito.slip(block.router_publickey, block.router_share, 2));
        ***REMOVED***
            if (block.staker_share > 0) {
              slips.push(new saito.slip(block.staker_publickey, block.staker_share, 2));
        ***REMOVED***
      ***REMOVED***);

          if (slips.length > 0) {

            let newtx = new saito.transaction();
            newtx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0, 2));
            newtx.transaction.to = slips;
            newtx.transaction.type = 2;

    ***REMOVED***
    ***REMOVED*** including for reference
    ***REMOVED***
            newtx.transaction.id  = this.transactions.length;
            newtx.transaction.msg = payments;
            newtx = this.app.wallet.signTransaction(newtx);
            this.transactions.push(newtx);

      ***REMOVED***
    ***REMOVED***


        if (this.transactions[i].transaction.msg.target != prevblk.returnHash()) {
          this.is_valid = 0;
          return this;
    ***REMOVED***

  ***REMOVED***

      //
      // merkle sigs
      //
      tx_sigs[i] = this.transactions[i].returnSignatureSource(this.app);

      //
      // hashmap of txs
      //
      for (let ii = 0; ii < this.transactions[i].transaction.from.length; ii++) { this.txs_hmap[this.transactions[i].transaction.from[ii].add] = 1; ***REMOVED***
      for (let ii = 0; ii < this.transactions[i].transaction.to.length; ii++) { this.txs_hmap[this.transactions[i].transaction.to[ii].add] = 1; ***REMOVED***

***REMOVED***

    //
    // merkle root
    //
    if (tx_sigs.length > 0) {
      this.block.merkle = this.app.crypto.returnMerkleTree(tx_sigs).root;
***REMOVED***

    //
    // update difficulty and paysplit
    //

    return this;

  ***REMOVED***




  //
  // in validation mode, we provide list of TXS to check
  //
  async calculateRebroadcasts(txs=null) {

    let expiring_data = { 
      reclaimed: "0.0", 
      rebroadcast: [], 
      total_rebroadcast: 0
***REMOVED***
    let needs_rebroadcast = 0;

    if (this.app.BROWSER == 1 || this.app.SPVMODE == 1) { return expiring_data; ***REMOVED***

    //
    // eliminated block id
    //
    let eblk_id = this.block.id - this.app.blockchain.genesis_period - 1;
    if (eblk_id < 1) { return expiring_data; ***REMOVED***

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
          if (this.app.shashmap.validate_slip(slip.returnSignatureSource(), this.block.id)) {
            if (eblk.transactions[i].isRebroadcast(eblk, this, ii)) {

	      //
	      // number of slips rebroadcast as TXS
	      //
              expiring_data.total_rebroadcast++;

      ***REMOVED***
      ***REMOVED*** create rebroadcast tx
      ***REMOVED***
              let tx = eblk.transactions[i].generateRebroadcastTransaction(this.block.creator, slip.tid, slip.sid, 2);
              if (tx == null) {
                console.log("ERROR 481029: issue generating rebroadcast transaction...");
                process.exit();
          ***REMOVED***

      ***REMOVED***
      ***REMOVED*** update tx with bid
      ***REMOVED***
              for (let iii = 0; iii < tx.transaction.from.length; iii++) {
                tx.transaction.from[iii].bid = this.block.id;
          ***REMOVED***

              expiring_data.rebroadcast.push(tx);

        ***REMOVED*** else {
              unspent_amt = unspent_amt.plus(Big(slip.amt));
              expiring_data.reclaimed = unspent_amt.toFixed(8);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    return expiring_data;
  ***REMOVED***

  containsGoldenTicket() {
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].isGoldenTicket() == 1) {
        return 1;
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***

  decryptTransactions() {
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].involvesPublicKey(this.app.wallet.returnPublicKey()) == 1) {
        this.transactions[i].decryptMessage(this.app);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  returnFilename() {
    return this.block.ts + "-" + this.returnHash() + ".blk";
  ***REMOVED***

  returnRoutingWorkNeeded() {
    return this.block.bf.current;
  ***REMOVED***

  returnCoinbase() {
    return this.block.coinbase;
  ***REMOVED***

  returnDifficulty() {
    return this.block.difficulty;
  ***REMOVED***

  returnEmbeddedRoutingWork() {

    let v = Big(0);

    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].is_valid == 1) {
        let available_work = Big(this.transactions[i].returnRoutingWorkAvailable(this.app, this.block.creator));
        if (this.transactions[i].transaction.type == 1) {
          if (this.transactions[i].transaction.msg.target != this.prevbsh) {
            available_work = Big(0);
      ***REMOVED***
    ***REMOVED***
        v = v.plus(available_work);
  ***REMOVED***
***REMOVED***
    return v.toFixed(8);
  ***REMOVED***


  returnHash() {
    if (this.hash != "") { return this.hash; ***REMOVED***
    this.prehash = this.app.crypto.hash(this.returnFingerprint());
    this.hash = this.app.crypto.hash(this.prehash + this.block.prevbsh);
    return this.hash;
  ***REMOVED***


  returnId() {
    return this.block.id;
  ***REMOVED***

  returnMaxTxId() {
    if (this.maxtid != 0) { return this.maxtid; ***REMOVED***
    for (var z = 0; z < this.transactions.length; z++) {
      if (this.transactions[z].transaction.id > this.maxtid) {
        this.maxtid = this.transactions[z].transaction.id;
  ***REMOVED***
***REMOVED***
    return this.maxtid;
  ***REMOVED***

  returnMinTxId() {
    if (this.mintid != 0) { return this.mintid; ***REMOVED***
    if (this.transactions.length == 0) { return this.app.blockchain.returnMinTxId(); ***REMOVED***;
    this.mintid = this.transactions[0].transaction.id;
    for (var z = 1; z < this.transactions.length; z++) {
      if (this.transactions[z].transaction.id < this.mintid) {
        this.mintid = this.transactions[z].transaction.id;
  ***REMOVED***
***REMOVED***
    return this.mintid;
  ***REMOVED***

  returnPaysplit() {
    return this.block.paysplit;
  ***REMOVED***

  returnPowsplit() {
    return this.block.powsplit;
  ***REMOVED***

  returnReclaimed() {
    return this.block.reclaimed;
  ***REMOVED***

  returnFingerprint() {
    return JSON.stringify(this.block);
  ***REMOVED***;

  returnTreasury() {
    return this.block.treasury;
  ***REMOVED***

  async runCallbacks(conf) {
    for (let i = this.confirmations + 1; i <= conf; i++) {
      for (let ii = 0; ii < this.callbacks.length; ii++) {
        this.callbacks[ii](this, this.transactions[this.callbacksTx[ii]], i, this.app);
  ***REMOVED***
***REMOVED***
    this.confirmations = conf;
  ***REMOVED***

  spendInputs() {
    for (let i = 0; i < this.transactions.length; i++) {
      for (let ii = 0; ii < this.transactions[i].transaction.from.length; ii++) {
        if (this.transactions[i].transaction.from[ii].amt > 0) {
	  this.app.shashmap.insert_slip(this.transactions[i].transaction.from[ii].returnSignatureSource(), this.block.id);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 1;
  ***REMOVED***

  unspendInputs() {
    for (let b = 0; b < this.transactions.length; b++) {
      for (let bb = 0; bb < this.transactions[b].transaction.from.length; bb++) {
        if (this.transactions[b].transaction.from[bb].amt > 0) {
          this.app.shashmap.insert_slip(this.transactions[b].transaction.from[bb].returnSignatureSource(), -1);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 1;
  ***REMOVED***




  async validate() {

    if (this.block.prevbsh == "") { return 1; ***REMOVED***

    //try {

      let reclaimed = "0";
      let prevblk = this.app.blockchain.returnBlockByHash(this.block.prevbsh);
      let mintxid = 1;
      let tx_sigs = [];
      if (prevblk != null) {
        if (prevblk.transactions.length == 0) {
          mintxid = prevblk.returnMaxTxId();
          if (mintxid == 0) { mintxid = 1; ***REMOVED***
    ***REMOVED*** else {
          mintxid = prevblk.returnMaxTxId()+1;
    ***REMOVED***
  ***REMOVED***

      //
      // check block headers
      //
      if (this.block.id != (prevblk.block.id+1)) {
        console.log("ERROR 482039: block id is not single increment over previous block");
        return 0;
  ***REMOVED***

console.log("PREVTRES: " + prevblk.block.treasury + " -- " + prevblk.block.reclaimed);

      let bt = Big(prevblk.block.treasury).plus(Big(prevblk.block.reclaimed));
console.log("GENESIS PERIOD -- : " + this.app.blockchain.genesis_period);
      let cb = Big(bt).div(this.app.blockchain.genesis_period).toFixed(8);
console.log("CB: "+ cb);
          bt = bt.minus(Big(cb)).toFixed(8);
console.log("BT: "+ bt);

      if (this.block.treasury != bt) {
        console.log("ERROR 410829: block treasury does not validate in new block");
        return 0;
  ***REMOVED***

      if (this.block.coinbase != cb) {
        console.log("ERROR 410829: block coinbase does not validate in new block");
        return 0;
  ***REMOVED***

      if (this.block.difficulty != prevblk.block.difficulty) {
        console.log("ERROR 571928: block difficulty does not validate in new block");
        return 0;
  ***REMOVED***
      if (this.block.paysplit != prevblk.block.paysplit) {
        console.log("ERROR 571928: block paysplit does not validate in new block");
        return 0;
  ***REMOVED***
      if (this.block.powsplit != prevblk.block.powsplit) {
        console.log("ERROR 571928: block difficulty does not validate in new block");
        return 0;
  ***REMOVED***

      let bf = this.app.burnfee.returnBurnFee(prevblk, this);
      if (this.block.bf != bf) {
        console.log("ERROR 571928: block difficulty does not validate in new block");
        return 0;
  ***REMOVED***

      //
      // my timestamp must be bigger than last timestamp
      //
      if (prevblk.block.ts >= this.block.ts) {
        console.log("ERROR 729384: block timestamp not incremented from previous block");
        return 0;
  ***REMOVED***


      let hmap = [];
      let slips = [];
      let number_of_golden_tickets = 0;
      let index_of_block_payment = -1;
      let index_of_golden_ticket = -1;

      for (let i = 0; i <= this.transactions.length-1; i++) {

***REMOVED***
***REMOVED*** sequential ids
***REMOVED***
        if (this.transactions[i].transaction.id != (mintxid + i)) {
          console.log("ERROR 517324: transaction ids are out-of-order when validating block - " + mintxid + "-" + i + " ------- " + this.transactions[i].transaction.id);
          return 0;
    ***REMOVED***


***REMOVED***
***REMOVED*** golden ticket
***REMOVED***
        if (this.transactions[i].transaction.type == 1) {

          index_of_golden_ticket = i;

          if (this.transactions[i].transaction.msg.target != prevblk.returnHash()) {

            console.log("ERROR 029312: golden ticket does not match prevblk hash");
            return 0;

      ***REMOVED*** else {

            number_of_golden_tickets++;
            if (number_of_golden_tickets > 1) {
              console.log("ERROR 189842: two golden tickets in block");
              return 0;
        ***REMOVED***

    ***REMOVED***
    ***REMOVED*** prevblk is not null here
    ***REMOVED***
            let payments = prevblk.returnBlockPayouts(this.transactions[i].transaction.msg);
            reclaimed = payments.reclaimed;

            payments.blocks.forEach((block) => {
              if (block.producer_share > 0) {
                slips.push(new saito.slip(block.producer_publickey, block.producer_share, 2));
          ***REMOVED***
              if (block.miner_share > 0) {
                slips.push(new saito.slip(block.miner_publickey, block.miner_share, 2));
          ***REMOVED***
              if (block.router_share > 0) {
                slips.push(new saito.slip(block.router_publickey, block.router_share, 2));
          ***REMOVED***
              if (block.staker_share > 0) {
                slips.push(new saito.slip(block.staker_publickey, block.staker_share, 2));
          ***REMOVED***
        ***REMOVED***);
            for (let x = 0; x < slips.length; x++) { slips[x].sid = x; ***REMOVED***

      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** fee transaction always follows golden ticket (if exists)
***REMOVED***
        if (this.transactions[i].transaction.type == 2) {
          if (index_of_block_payment != -1) {
            console.log("ERROR 581029: two block paymeet (type=2) transactions in block");
            return 0;
      ***REMOVED***
          index_of_block_payment = i;
    ***REMOVED***


***REMOVED***
***REMOVED*** merkle sigs
***REMOVED***
        tx_sigs[i] = this.transactions[i].returnSignatureSource(this.app);;

***REMOVED***
***REMOVED*** no duplicate inputs slips
***REMOVED***
        for (let j = 0; j < this.transactions[i].transaction.from.length; j++) {
          if (hmap[this.transactions[i].transaction.from[j].returnSignatureSource()] != undefined) {
            console.log("ERROR 820493: multiple transactions spend same input detected");
            return 0;
      ***REMOVED***
          if (this.transactions[i].transaction.from[j].amt > 0) {
            hmap[this.transactions[i].transaction.from[j].returnSignatureSource()] = 1;
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** validate transactions
***REMOVED***
        if (!this.transactions[i].validate(this.app, this.block.id)) {
          console.log(`ERROR 174233: block contains invalid transaction: ${i***REMOVED***`);
          this.transactions[i].is_valid = 0;
          return 0;
    ***REMOVED***
  ***REMOVED***

      //
      // golden tickets must pay out
      //
      if (index_of_golden_ticket > -1) {
	if (index_of_block_payment == -1) {
          console.log("ERROR 697812: golden ticket in block, but not block payment transaction");
          return 0;
    ***REMOVED*** else {

  ***REMOVED***
  ***REMOVED*** check accurate
  ***REMOVED***
          if (this.app.crypto.hash(JSON.stringify(slips)) == this.app.crypto.hash(JSON.stringify(this.transactions[index_of_block_payment].transaction.to))) {
      ***REMOVED*** else {
            console.log("ERROR 840192: to slips in block fee transaction invalid");
            console.log("RECOVERED SLIPS: ", slips);
            console.log("TX TO SLIPS", this.transactions[index_of_block_payment].transaction.to);
            return 0;
      ***REMOVED*** 
    ***REMOVED***
  ***REMOVED***


      //
      // only validate monetary policy if fully-synced with full block history
      //
      if (this.app.blockchain.isFullySynced() == 1 && this.app.BROWSER == 0 && this.app.SPVMODE == 0) {

        let eblkd	= await this.calculateRebroadcasts(this.transactions);

***REMOVED***
***REMOVED*** reclaimed txs
***REMOVED***
        reclaimed = Big(reclaimed).plus(Big(eblkd.reclaimed));
        if (!Big(this.block.reclaimed).eq(reclaimed)) {
          console.log("ERROR 241948: reclaimed funds do not match expected when validating");
          return 0;
    ***REMOVED***;

***REMOVED***
***REMOVED*** atr validates
***REMOVED***
***REMOVED*** the last transaction in any block will be the fee-transaction. ATR transactions
	// are BEFORE that, added in the order that that are generated. So we check that 
	// all of the transactions are good.
	//
	let atr_idx = this.transactions.length-1;
        if (atr_idx > 0) {
	  if (this.transactions[atr_idx].transaction.type == 2) { atr_idx--; ***REMOVED***
          if (atr_idx > 0) {
    	    for (let i = eblkd.rebroadcast.length-1; i >= 0; i--) {
	      eblkd.rebroadcast[i].transaction.id = this.transactions[atr_idx].transaction.id;
	      if (JSON.stringify(eblkd.rebroadcast[i].transaction) != JSON.stringify(this.transactions[atr_idx].transaction)) {
                console.log("ERROR 549280: rebroadcast txs JSON outputs not as expected");
               return 0;
	  ***REMOVED***
	      atr_idx--;
	***REMOVED*** 
	  ***REMOVED***
	***REMOVED***

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
	  ***REMOVED***
	***REMOVED***
  ***REMOVED***


      //
      // check merkle root
      //
      if (tx_sigs.length > 0) {
        if (this.block.merkle != this.app.crypto.returnMerkleTree(tx_sigs).root) {
          console.log("ERROR 258102: merkle root does not match provided root");
            return 0;
    ***REMOVED***
  ***REMOVED***

      //
      // check difficulty and paysplit
      //

      //
      // check payments are OK
      //

    //***REMOVED*** catch (err) {
    //  console.log("ERROR 921842: unknown error while validating block...: " + err);
    //  return 0;
    //***REMOVED***

    return 1;

  ***REMOVED***








  returnBlockPayouts(gt=null, rvalue={***REMOVED***, rloop=0, stakers=[]) {

    if (rvalue.blocks == undefined) { 
      rvalue.blocks 			= []; 
      rvalue.reclaimed 			= "0";
***REMOVED***

    let payments = {***REMOVED***;
    payments.producer_publickey 	= "";
    payments.producer_share 		= "0.0";
    payments.miner_publickey 		= "";
    payments.miner_share 		= "0.0";
    payments.router_publickey 		= "";
    payments.router_share 		= "0.0";
    payments.staker_publickey 		= "";
    payments.staker_share 		= "0.0";

    payments.bsh			= this.returnHash();
    payments.bid			= this.block.id;
    payments.rloop			= rloop;


    //
    // no golden ticket? check treasury
    //
    try {
      if (gt == null) {

        if (this.block.prevbsh == "") {
          if (rloop == 10) {
            rvalue.reclaimed = Big(rvalue.reclaimed).plus(Big(payments.total_fees_in_block)).toFixed(8);
            return rvalue;
      ***REMOVED*** else {
            return rvalue;
      ***REMOVED***
    ***REMOVED*** else {
          let prevblk = this.app.blockchain.returnBlockByHash(this.block.prevbsh);
          if (this.containsGoldenTicket()) {
            return rvalue;
      ***REMOVED*** else {
            return prevblk.returnBlockPayouts(gt, rvalue, rloop+1);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED*** catch(err) {
      console.log("ERROR: in checking treasury: ", err);
***REMOVED***


    //
    // first block
    //
    if (this.block.prevbsh == "") {
      if (rloop == 10) {
        rvalue.reclaimed = Big(rvalue.reclaimed).plus(Big(this.returnFees())).toFixed(8);
        return rvalue;
  ***REMOVED*** else {
        return rvalue;
  ***REMOVED***
***REMOVED***


    try {

      //
      // golden ticket
      //
      var prevbsh = this.block.prevbsh;
      var prevblk = this.app.blockchain.returnBlockByHash(prevbsh);

      var producer_publickey            	= this.block.creator;
      var miner_publickey               	= "";
      var router_publickey              	= "";
      var staker_publickey              	= "";

      var total_work_needed             	= this.app.burnfee.returnWorkNeeded(prevblk.block.ts, this.block.ts, prevblk.block.bf); // int
      var total_work_available          	= this.returnEmbeddedRoutingWork();     // string
      var total_fees_in_block           	= this.returnFees();            ***REMOVED*** string
      var producer_share                	= Big(total_work_available).minus(Big(total_work_needed)); // Big
      var paysplit_share                	= Big(total_fees_in_block).minus(producer_share).plus(this.returnCoinbase()); // Big
      var miner_share                   	= paysplit_share.div(2).toFixed(8);     // string
      var router_share                  	= paysplit_share.minus(Big(miner_share)).toFixed(8); // string
      var staker_share                  	= "0.0";
***REMOVED*** catch(err) {
      console.log("ERROR IN GOLDEN TICKET CREATION: ", err);
***REMOVED***



    //
    // pick the router
    //
    if (Big(router_share).gt(0)) {

      //
      // random decimal between 0-1 picks winning tx
      //
      let winnerHash = this.app.crypto.hash(gt.random).slice(0,12);
      let maxHash    = "ffffffffffff";
      let winnerNum  = parseInt(winnerHash, 16); // 16 = num is hex
      let maxNum     = parseInt(maxHash, 16);    // 16 = num is hex
      let winnerDec  = winnerNum / maxNum;

      let winner_fee = Big(total_fees_in_block).times(winnerDec);

      let winning_tx_idx = -1;
      let cumulative_fee = Big(0.0);
      let stop = 0;

      //
      // TODO - faster search algorithm
      //
      // find winning tx randomly
      //
      for (let i = 0; i < this.transactions.length && stop == 0; i++) {
        cumulative_fee.plus(Big(this.transactions[i].returnFees(this.app)));
        if (cumulative_fee.gte(winner_fee)) {
          stop = 1;
          winning_tx_idx = i-1;
    ***REMOVED***
  ***REMOVED***

      //
      // assign winners
      //
      if (winning_tx_idx == -1) {
        router_publickey = this.block.creator;
  ***REMOVED***


      //
      // or find winner in routing portion
      //
      else {

        let winning_tx = this.transactions[winning_tx_idx];

***REMOVED***
***REMOVED*** no path info, default to sender
***REMOVED***
        if (winning_tx.transaction.path.length == 0) {
          router_publickey = winning_tx.transaction.from[0].add;
    ***REMOVED***

***REMOVED***
***REMOVED*** path info, repeat random generation
***REMOVED***
        let winner2Hash = this.app.crypto.hash(winnerHash).slice(0,12);
        let winner2Num  = parseInt(winner2Hash, 16);
        let winner2Dec  = winner2Num / maxNum;

        let pathlength = winning_tx.transaction.path.length;
        let pathtotal  = winning_tx.returnFees(this.app);

        if (winner2Dec == 0) {
          router_publickey = winning_tx.transaction.path[0].to;
    ***REMOVED*** else {

          if (winnerDec == 1) {
            router_publickey = winning_tx.transaction.path[pathlength].to;
      ***REMOVED*** else {

            let y = pathlength;
            let x = 2 - (1/(Math.pow(2,(y-1))));  // i.e. 1.75 for 3 node path
            let z = y * winner2Dec;

            for (let i = 0; i < pathlength; i++) {
              let a = 2 - (1/(Math.pow(2,(i-1))));
              if (a <= z) { router_publickey = winning_tx.transaction.path[i].to; ***REMOVED***
        ***REMOVED***

      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***


    if (rloop == 0) {
      //
      // winning miner
      //
      miner_publickey = gt.publickey;
***REMOVED*** else {
      //
      // winning staker
      //
      let x = this.app.bank.returnWinningStaker(gt, stakers);
      stakers = x.stakers;
      staker_publickey = x.publickey;
      staker_share = miner_share;
      miner_share = "0.0";
***REMOVED***


    // extra for testing diagnostics
    payments.coinbase = this.returnCoinbase();

    payments.producer_publickey	= producer_publickey;
    payments.miner_publickey 	= miner_publickey;
    payments.router_publickey	= router_publickey;
    payments.staker_publickey	= staker_publickey;

    payments.producer_share	= producer_share;
    payments.miner_share	= miner_share;
    payments.staker_share	= staker_share;
    payments.router_share	= router_share;

    payments.total_fees_in_block      	= total_fees_in_block;
    payments.total_work_needed     	= total_work_needed;
    payments.total_work_available     	= total_work_available;
    payments.paysplit_share           	= paysplit_share;

    rvalue.blocks.push(payments);

    if (this.containsGoldenTicket() || rloop == 10) {
      return rvalue;
***REMOVED*** else {
      gt.random = this.app.crypto.hash(gt.random);
      return prevblk.returnBlockPayouts(gt, rvalue, rloop+1);
***REMOVED***

  ***REMOVED***




  returnFees() {
    let v = Big(0);
    for (let i = 0; i < this.transactions.length; i++) {
      v = v.plus(Big(this.transactions[i].returnFees(this.app)));
***REMOVED***
    return v.toFixed(8);
  ***REMOVED***

  // Use this when we're saving data to disk
  returnBlockFileData() {
    let blkcontent = {
      block: JSON.parse(JSON.stringify(this.block)),
      transactions: JSON.parse(JSON.stringify(this.transactions))
***REMOVED***;
    return JSON.stringify(blkcontent);
  ***REMOVED***

***REMOVED***

module.exports = Block;


