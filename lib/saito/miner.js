'use strict';
const saito = require('./saito');
const Big = require('big.js');


class Miner {

  constructor(app) {
    this.app                = app || {***REMOVED***;

    this.mining_active    = false;
    this.mining_speed     = 100;
    this.mining_timer     = null;

    return this;
  ***REMOVED***


  startMining(prevblk) {
    if (!prevblk.is_valid) { return; ***REMOVED***
    if (this.mining_active) { clearInterval(this.mining_timer); ***REMOVED***
    this.mining_active = true;
    this.mining_timer = setInterval(() => { this.mine(prevblk); ***REMOVED***, this.mining_speed);
  ***REMOVED***


  stopMining() {
    this.mining_active = false;
    clearInterval(this.mining_timer);
  ***REMOVED***


  async mine(blk) {

    if (blk == null) { return; ***REMOVED***
    if (!blk.is_valid) { return; ***REMOVED***
    // do not mine on block #1 because VIP txs
    if (blk.block.id == 1) { return; ***REMOVED***

    //
    // generate random hash
    //
    // TODO longer random number
    //
    let num = Math.random().toString();
    let sol = this.app.crypto.hash(this.app.wallet.returnPublicKey() + num);

    var publickey = this.app.wallet.returnPublicKey();
    var privatekey = this.app.wallet.returnPrivateKey();

    let gt = new saito.goldenticket(this.app);
    if (gt.isValidSolution(sol, blk)) {

      this.stopMining();

      let gtmsg = gt.formatSolutionForGoldenTicket(blk, num);

      let tx = new saito.transaction();
      if (this.app.wallet.wallet.inputs.length > 1) {
        tx.transaction.from = this.app.wallet.returnAdequateInputs(0.0001);
        if (tx.transaction.from == null) { return; ***REMOVED***
  ***REMOVED*** else {
        tx.transaction.from = [];
        tx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0, 1));
  ***REMOVED***
      tx.transaction.type 	= 1;
      tx.transaction.msg 	= gtmsg;

      //
      // add change address
      //
      let total_submitted = Big(tx.transaction.from[0].amt);
      for (let r = 1; r < tx.transaction.from.length; r++) {
        total_submitted = total_submitted.plus(Big(tx.transaction.from[r].amt));
  ***REMOVED***

      let change_amount = total_submitted.minus(Big(0.0001));
      if (change_amount.gt(0)) {
        tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), change_amount.toFixed(8), 0));
        tx.transaction.to[tx.transaction.to.length-1].type = 0;
  ***REMOVED*** else {
        tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), "0.0", 0));
  ***REMOVED***

      tx = this.app.wallet.signTransaction(tx);
      this.app.network.propagateTransaction(tx);

***REMOVED***
  ***REMOVED***
***REMOVED***

module.exports = Miner;

