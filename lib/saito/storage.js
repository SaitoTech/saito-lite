'use strict';

const saito = require('./saito');
const axios = require('axios');


class Storage {

  constructor(app, data, dest="blocks") {
    this.app                 = app || {***REMOVED***;
    return this;
  ***REMOVED***


  async initialize() {
    await this.loadOptions();
    this.saveOptions();
    return;
  ***REMOVED***

  async loadOptions() {
    if (typeof(Storage) !== "undefined") {

      let data = localStorage.getItem("options");
      if (data != "null" && data != null)  {
console.log("LOADING LOCALLY: " + JSON.stringify(data));
        this.app.options = JSON.parse(data);
  ***REMOVED*** else {

***REMOVED***
          let response = await axios.get(`/options`);
          this.app.options = response.data;
console.log("LOADING REMOTELY " + JSON.stringify(response.data));
          this.saveOptions();
    ***REMOVED*** catch(err) {
          console.error(err);
    ***REMOVED***

  ***REMOVED***
***REMOVED***
  ***REMOVED***

  saveOptions() {
    try {
      if (typeof(Storage) !== "undefined") {
        localStorage.setItem("options", JSON.stringify(this.app.options));
  ***REMOVED***
***REMOVED*** catch (err) {
      console.log(err);
***REMOVED***
  ***REMOVED***

  async resetOptions() {
    try {
      let response = await axios.get(`/options`);
      this.app.options = response.data;
      this.saveOptions();
***REMOVED*** catch(err) {
      console.error(err);
***REMOVED***
  ***REMOVED***


  /**
   * FUNCTIONS OVERWRITTEN BY STORAGE-CORE WHICH HANDLES ITS OWN DATA STORAGE IN ./core/storage-core.js
   **/

  saveTransaction(tx) {

    let message = "archive";
    let data = {***REMOVED***;
        data.request = "save";
        data.tx = tx;

    this.app.network.sendRequestWithCallback(message, data, function(res) {
      console.log("SAVED ARCHIVE DATA!");
***REMOVED***);

  ***REMOVED***



  deleteTransaction(tx) {

    let message = "archive";
    let data = {***REMOVED***;
        data.request = "delete";
        data.tx = tx;
	data.publickey = this.app.wallet.returnPublicKey();
	data.sig = this.app.crypto.signMessage(("delete_"+tx.transaction.sig), this.app.wallet.returnPrivateKey());

    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("DELETED ARCHIVE DATA");
***REMOVED***);

  ***REMOVED***


  loadTransactions(type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {***REMOVED***;
        data.request = "load";
        data.type = type;
        data.num = num;
        data.publickey = this.app.wallet.returnPublicKey();

    this.app.network.sendRequestWithCallback(message, data, function(obj) {
      console.log("LOADED ARCHIVE DATA");
      let txs = obj.txs.map(tx => new saito.transaction(JSON.parse(tx)));
      mycallback(txs);
***REMOVED***);

  ***REMOVED***

  loadTransactionsByKeys(keys, type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {***REMOVED***;
        data.request = "load_keys";
        data.keys = keys;
        data.type = type;
        data.num = num;

    this.app.network.sendRequestWithCallback(message, data, function(obj) {
      if (obj.txs == undefined) { mycallback([]); return; ***REMOVED***
      if (obj.txs.length == 0) { mycallback([]); return; ***REMOVED*** 
      let txs = obj.txs.map(tx => new saito.transaction(JSON.parse(tx)));
      mycallback(txs);
***REMOVED***);

  ***REMOVED***




  /**
   * DUMMY FUNCTIONS IMPLEMENTED BY STORAGE-CORE IN ./core/storage-core.js
   **/

  loadBlockById(bid) {***REMOVED***

  loadBlockByHash(bsh) {***REMOVED***

  loadBlockByFilename(filename) {***REMOVED***

  async loadBlocksFromDisk(maxblocks=0) {***REMOVED***

  returnFileSystem() { return null; ***REMOVED***

  async saveBlock() {***REMOVED***

  saveClientOptions() {***REMOVED***

  async returnBlockFilenameByHash(block_hash, mycallback) {***REMOVED***

  returnBlockFilenameByHashPromise(block_hash) {***REMOVED***

  async queryDatabase(sql, params, database) {***REMOVED***

  async executeDatabase(sql, params, database) {***REMOVED***

***REMOVED***

module.exports = Storage;

