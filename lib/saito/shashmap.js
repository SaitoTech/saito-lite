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

  insert_new_transaction(tx) {
    for (let i = 0; i < tx.transaction.to.length; i++) {
      this.insert_slip(tx.transaction.to[i].returnSignatureSource());
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
