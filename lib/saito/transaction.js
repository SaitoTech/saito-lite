const Big      = require('big.js');
const saito    = require('./saito');

/**
 * Transaction Constructor
 * @param {****REMOVED*** txjson
 */
class Transaction {

  constructor(txjson="") {

    /////////////////////////
    // consensus variables //
    /////////////////////////
    this.transaction               = {***REMOVED***;
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
                                ***REMOVED*** 1 = golden ticket
                                ***REMOVED*** 2 = fee transaction
                                ***REMOVED*** 3 = rebroadcasting
                                ***REMOVED*** 4 = VIP rebroadcast
                                ***REMOVED*** 5 = floating coinbase / golden chunk
                                ***REMOVED*** 6 = staking pending rebroadcast
	                        ***REMOVED*** 7 = staking current
    this.transaction.msg           = {***REMOVED***;
    this.transaction.ps            = 0;

    this.fees_total		 = "";
    this.work_available_to_me	 = "";
    this.work_available_to_creator = "";
    this.work_cumulative 		 = "0.0";
    				  ***REMOVED*** cumulative fees, inc. fees in this reflect
                                  ***REMOVED*** how much this transaction carries in the
                                  ***REMOVED*** weight of the block. we use this to find
                                  ***REMOVED*** the winning node in the block for the
                                  ***REMOVED*** routing payment. i.e. this measures the
                                  ***REMOVED*** cumulative weight of the usable fees that
                                  ***REMOVED*** are behind the transactions.

    this.dmsg			   = "";
    this.size                      = 0;
    this.is_valid                  = 1;

    this.atr_trapdoor		   = "0";

    if (txjson != "") {
      try {
***REMOVED*** this.transaction = JSON.parse(txjson.toString("utf8"));
        this.transaction = txjson;
        this.transaction.from = this.transaction.from.map(slip => {
          let {add,amt,type,bid,tid,sid,bsh***REMOVED*** = slip;
          return new saito.slip(add,amt,type,bid,tid,sid,bsh);
    ***REMOVED***);

        this.transaction.to = this.transaction.to.map(slip => {
          let {add,amt,type,bid,tid,sid,bsh***REMOVED*** = slip;
          return new saito.slip(add,amt,type,bid,tid,sid,bsh);
    ***REMOVED***);

  ***REMOVED*** catch (err) {
        this.is_valid = 0;
  ***REMOVED***
***REMOVED***

    return this;
  ***REMOVED***



  generateRebroadcastTransaction(tid, sid, avg_fee=2) {

    if (this.transaction.to.length == 0) { return null; ***REMOVED***

    var newtx = new saito.transaction();
    newtx.transaction.sig = this.transaction.sig;
    newtx.transaction.msg = {***REMOVED***;
    newtx.transaction.ts  = new Date().getTime();

    var fee = Big(avg_fee);
    if (avg_fee == 0) { fee = Big(2); ***REMOVED***


    /////////////////////////
    // normal rebroadcasts //
    /////////////////////////
    if (this.transaction.type >= 0 && this.transaction.type <= 3) {

      newtx.transaction.type = 3;
      if (this.transaction.msg.loop == undefined) {
        newtx.transaction.msg.loop = 1;
  ***REMOVED*** else {
        newtx.transaction.msg.loop = this.transaction.msg.loop+1;
  ***REMOVED***


      //
      // disable exponential looping fee
      //
      //for (i = 1; i < newtx.transaction.msg.loop; i++) { fee = fee.times(2); ***REMOVED***

      var amt = Big(this.transaction.to[sid].amt).minus(fee);
      if (amt.lt(0)) {
        fee = Big(this.transaction.to[sid].amt);
        amt = Big(0);
  ***REMOVED***

      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
  ***REMOVED*** else {
        newtx.transaction.msg.tx = this.stringify(2);
  ***REMOVED***

      let from = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 3);
          from.tid = tid;
          from.sid = sid;
      let to   = new saito.slip(this.transaction.to[sid].add, amt.toFixed(8), 3);
      let fees = new saito.slip(this.atr_trapdoor, fee.toFixed(8));
      fees.sid = 1;

      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);
      newtx.transaction.to.push(fees);

***REMOVED***


    ///////////////////////////
    // prestige rebroadcasts //
    ///////////////////////////
    if (this.transaction.type == 4) {

      newtx.transaction.type = this.transaction.type;

      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
  ***REMOVED*** else {
        newtx.transaction.msg.tx = this.stringify(2);
  ***REMOVED***

      var from = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 4);
          from.tid = tid;
          from.sid = sid;
      var to   = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 4);
      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);

***REMOVED***



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
      if (fee.lt(20)) { fee = Big(20); ***REMOVED***
      var amt = Big(this.transaction.to[sid].amt).minus(fee);
      if (amt.lt(0)) {
        fee = Big(this.transaction.to[sid].amt);
        amt = Big(0);
  ***REMOVED***

      if (this.transaction.msg.tx != undefined) {
        newtx.transaction.msg.tx = this.transaction.msg.tx;
  ***REMOVED*** else {
        newtx.transaction.msg.tx = this.stringify(2);
  ***REMOVED***

      var from = new saito.slip(this.transaction.to[sid].add, this.transaction.to[sid].amt, 5);
          from.tid = tid;
          from.sid = sid;
      var to   = new saito.slip(this.transaction.to[sid].add, amt.toFixed(8), 5);
      var fees = new saito.slip(this.atr_trapdoor_address, fee.toFixed(8));
      fees.sid = 1;

      newtx.transaction.from.push(from);
      newtx.transaction.to.push(to);
      newtx.transaction.to.push(fees);   // this ensures fee falls into money supply

***REMOVED***
    return newtx;
  ***REMOVED***





  isFrom(senderPublicKey) {
    if (this.returnSlipsFrom(senderPublicKey).length != 0) { return true; ***REMOVED***
    return false;
  ***REMOVED***

  isTo(receiverPublicKey) {
    if (this.returnSlipsTo(receiverPublicKey).length > 0) { return true; ***REMOVED***
    return false;
  ***REMOVED***

  isGoldenTicket() {
    if (this.transaction.type == 1) { return 1; ***REMOVED***
    return 0;
  ***REMOVED***

  isRebroadcast(oldblk, newblk, sid) {

    //
    // fee-capture and golden tickets never rebroadcast
    //
    // if (this.transaction.type == 1) 				         { console.log('no 1'); return false; ***REMOVED***
    // if (this.transaction.type == 2) 				         { console.log('no 2'); return false; ***REMOVED***
    // if (this.transaction.type == 3) 				         { console.log('no 3'); return false; ***REMOVED***
    //
    // Golden Chunk transactions must point to the trapdoor address in order to be considered valid
    //
    if (this.transaction.to[sid].add  == this.atr_trapdoor) {
      if (this.transaction.to[sid].type == 5) { return true; ***REMOVED***
      return false;
***REMOVED***

    if (this.transaction.to.length == 0) { return false; ***REMOVED***
    if (this.transaction.type == 4)      { return true; ***REMOVED***
    if (Big(this.transaction.to[sid].amt).gt(this.atr_rebroadcasting_limit)) { return true; ***REMOVED***

    return false;

  ***REMOVED***


  involvesPublicKey(publickey) {
    let slips = this.returnSlipsToAndFrom(publickey);
    if (slips.to.length > 0 || slips.from.length > 0) { return 1; ***REMOVED***
    return 0;
  ***REMOVED***

  returnSlipsFrom(fromAddress) {
    var x = [];
    if (this.transaction.from != null) {
      for (var v = 0; v < this.transaction.from.length; v++) {
        if (this.transaction.from[v].add === fromAddress) { x.push(this.transaction.from[v]); ***REMOVED***
  ***REMOVED***
***REMOVED***
    return x;
  ***REMOVED***

  returnSlipsToAndFrom(theAddress) {
    var x = {***REMOVED***;
    x.from = [];
    x.to = [];
    if (this.transaction.from != null) {
      for (var v = 0; v < this.transaction.from.length; v++) {
        if (this.transaction.from[v].add === theAddress) { x.from.push(this.transaction.from[v]); ***REMOVED***
  ***REMOVED***
***REMOVED***
    if (this.transaction.to != null) {
      for (var v = 0; v < this.transaction.to.length; v++) {
        if (this.transaction.to[v].add === theAddress) { x.to.push(this.transaction.to[v]); ***REMOVED***
  ***REMOVED***
***REMOVED***
    return x;
  ***REMOVED***

  returnSlipsTo(toAddress) {
    var x = [];
    if (this.transaction.to != null) {
      for (var v = 0; v < this.transaction.to.length; v++) {
        if (this.transaction.to[v].add === toAddress) { x.push(this.transaction.to[v]); ***REMOVED***
  ***REMOVED***
***REMOVED***
    return x;
  ***REMOVED***

  decryptMessage(app) {
    try { this.dmsg = app.keys.decryptMessage(this.transaction.from[0].add, this.transaction.msg); ***REMOVED*** catch (e) {***REMOVED***
  ***REMOVED***

  returnMessage() {
    if (this.dmsg != "") { return this.dmsg; ***REMOVED***
    return this.transaction.msg;
  ***REMOVED***

  returnSignature(app) {
    if (this.transaction.sig != "") { return this.transaction.sig; ***REMOVED***
    this.transaction.sig = app.wallet.signMessage(this.returnSignatureSource(app));
    return this.transaction.sig;
  ***REMOVED***

  returnSignatureSource(app) {
    // return this.transaction.sig;
    return `${this.transaction.ts***REMOVED***${this.transaction.ps***REMOVED***${this.transaction.type***REMOVED***`;
  ***REMOVED***

  returnFees(app) {

    if (this.fees_total == "") {

      //
      // sum inputs
      //
      let inputs = Big(0.0);
      if (this.transaction.from != null) {
        for (let v = 0; v < this.transaction.from.length; v++) {
          inputs = inputs.plus(Big(this.transaction.from[v].amt));
    ***REMOVED***
  ***REMOVED***

      //
      // sum outputs
      //
      let outputs = Big(0.0);
      for (let v = 0; v < this.transaction.to.length; v++) {

***REMOVED***
***REMOVED*** only count non-gt transaction outputs
***REMOVED***
        if (this.transaction.to[v].type != 1 && this.transaction.to[v].type != 2) {
          outputs = outputs.plus(Big(this.transaction.to[v].amt));
    ***REMOVED***
  ***REMOVED***

      let tx_fees = inputs.minus(outputs);
      this.fees_total = tx_fees.toFixed(8);
***REMOVED***

    return this.fees_total;
  ***REMOVED***


  returnRoutingWorkAvailable(app, publickey="") {

    let uf = Big(this.returnFees(app));

    for (let i = 0; i < this.transaction.path.length; i++) {
      let d = 1;
      for (let j = i; j > 0; j--) { d = d*2; ***REMOVED***
      uf = uf.div(d);
***REMOVED***

    return uf.toFixed(8);

  ***REMOVED***






  validate(app, mode=0, bid=null) {

    if (app.BROWSER == 1 || app.SPVMODE == 1) { return true; ***REMOVED***

    if (this.is_valid == 0) { return false; ***REMOVED***


    /////////////////////////////////
    // min one sender and receiver //
    /////////////////////////////////
    if (this.transaction.from.length < 1) {
      console.log("ERROR 329380: no from address in transaction");
      return false;
***REMOVED***
    if (this.transaction.to.length < 1) {
      console.log("ERROR 183092: no to address in transaction");
      return false;
***REMOVED***

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
          console.log("ERROR 240812: negative payment in transaction from slip");
          return 0;
    ***REMOVED***
  ***REMOVED***
      let total_to = Big(0.0);
      for (let i = 0; i < this.transaction.to.length; i++) {
        total_to = total_to.plus(Big(this.transaction.to[i].amt));
        if (total_to.lt(0)) {
          console.log("ERROR 672939: negative payment in transaction to slip");
          return 0;
    ***REMOVED***
  ***REMOVED***
      if (this.transaction.type == 0 || this.transaction.type >= 3) {
        if (total_to.gt(total_from)) {
          console.log("ERROR 672939: negative payment to slips > from slips");
          return 0;
    ***REMOVED***
  ***REMOVED***

***REMOVED*** else {


***REMOVED***

    ////////////////////
    // slips validate //
    ////////////////////
    for (let i = 0; i < this.transaction.from.length; i++) {

      //
      // golden tickets etc. have 0 input amts in from slips
      //
      if (Big(this.transaction.from[i].amt).gt(0)) {

***REMOVED***
***REMOVED*** check input is within genesis period
***REMOVED***
        if (this.transaction.from[i].bid < (bid-app.blockchain.genesis_period)) {
          console.log("ERROR 570030: transaction tries to spend outdated input...");
  	  this.is_valid = 0;
          return false;
    ***REMOVED***

***REMOVED***
***REMOVED*** check is spending longest chain
***REMOVED***
        if (this.transaction.from[i].bsh != "") {
          if (app.blockchain.bsh_lc_hmap[this.transaction.from[i].bsh] != 1) {
            console.log("ERROR 185013: transaction tries to spend outdated input...");
  	    this.is_valid = 0;
            return false;
      ***REMOVED***
    ***REMOVED***

	//
	// check in shashmap
	//
        if (!app.shashmap.validate_slip(this.transaction.from[i].returnSignatureSource(), bid)) {
          console.log("ERROR 823103: error checking inputs in transaction validate");
          this.is_valid = 0;
          return false;
	***REMOVED***
  ***REMOVED***
***REMOVED***


    ///////////////////
    // sigs validate //
    ///////////////////
    if (this.transaction.type == 0) {

      if (!app.crypto.verifyMessage(this.returnSignatureSource(app), this.transaction.sig, this.returnSender())) {
        console.log("ERROR 137102: signature on normal transaction does not verify");
        return 0;
  ***REMOVED***

***REMOVED***

    if (this.transaction.type == 1) { 
***REMOVED***
    if (this.transaction.type == 2) { 
***REMOVED***
    if (this.transaction.type == 3) { 
***REMOVED***
    if (this.transaction.type == 4) {

      //
      // only genesis key can create
      //
      //if (this.transaction.from[0].add != app.GENESIS_PUBLICKEY) {
      //  console.log("ERROR 047230: unapproved VIP transaction - we have to pay fees to support the network, folks!");
      //  return 0;
      //***REMOVED***

***REMOVED***
    if (this.transaction.type == 5) {

      //if (this.transaction.from[0].add != app.GENESIS_PUBLICKEY) {
      //  console.log("ERROR 091324: unapproved VIP transaction - we have to pay fees to support the network, folks!");
      //  return 0;
      //***REMOVED***

***REMOVED***
    if (this.transaction.type == 6) {
***REMOVED***
    if (this.transaction.type == 7) {
***REMOVED***

    return true;
  ***REMOVED***

  returnSender() {
    if (this.transaction.from.length >= 1) {
      return this.transaction.from[0].add;
***REMOVED***
  ***REMOVED***


***REMOVED***
module.exports = Transaction;



