'use strict'
const saito         = require('./saito');

class Shashmap {
  constructor() {
    this.slips          = [];

    return this;
  ***REMOVED***

  unspend_transaction(tx) {
    for (let i = 0; i < tx.transaction.from.length; i++) {
      this.insert_slip(tx.transaction.from[i].returnSignatureSource(), -1);
***REMOVED***
  ***REMOVED***

  spend_transaction(tx, bid) {
    for (let i = 0; i < tx.transaction.from.length; i++) {
      this.insert_slip(tx.transaction.from[i].returnSignatureSource(), bid);
***REMOVED***
  ***REMOVED***

  insert_new_transaction(blk, tx) {
    for (let i = 0; i < tx.transaction.to.length; i++) {

      // 
      // consensus variables
      //
      // we make a new slip, as changing the old one
      // breaks validation of the transaction sigs and hashes
      // yet we need even bad slips to go into the hashmap
      // in the event they are valid on chain reorganizations
      //
      let x 	= new saito.slip();
      x.add 	= tx.transaction.to[i].add;
      x.bid 	= blk.block.id;
      x.tid 	= tx.transaction.id;
      x.sid 	= i;
      x.type 	= tx.transaction.to[i].type;
      x.bsh 	= blk.returnHash();
      x.amt 	= tx.transaction.to[i].amt;

      this.insert_slip(x.returnSignatureSource());
***REMOVED***
  ***REMOVED***

  insert_slip(slipidx="", val=-1) {
    this.slips[slipidx] = val;
  ***REMOVED***

  delete_slip(slipidx="") {
    delete this.slips[slipidx];
  ***REMOVED***

  validate_slip(slipidx="", bid) {
    let slip_bid = this.slips[slipidx];
    if (slip_bid == bid) { return 1;***REMOVED***
    if (slip_bid < bid) { return 1; ***REMOVED***
    return 0;
  ***REMOVED***

  validate_mempool_slip(slipidx="") {
    if (this.slips[slipidx] == 0) { return 0; ***REMOVED***
    if (this.slips[slipidx] == -1) { return 1; ***REMOVED***
    return 0;
  ***REMOVED***

  slip_value(slipidx="") {
    return this.slips[slipidx];
  ***REMOVED***

***REMOVED***

module.exports = Shashmap;
