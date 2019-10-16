'use strict';

const saito = require('./saito');


class Storage {

  constructor(app, data, dest="blocks") {

    this.app                 = app || {***REMOVED***;

    return this;
  ***REMOVED***

  async initialize() {

    //
    // load options file
    //
    this.loadOptions();

    //
    // save the file
    //
    this.saveOptions();

    return;
  ***REMOVED***

  loadOptions() {
    if (typeof(Storage) !== "undefined") {
      let data = localStorage.getItem("options");
      if (data != "null")  {
        this.app.options = JSON.parse(data);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  saveOptions() {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("options", JSON.stringify(this.app.options));
***REMOVED***
  ***REMOVED***

  resetOptions() {
    return axios.get(`/options`)
      .then(response => {
        this.app.options = response.data;
        this.saveOptions();
  ***REMOVED***)
      .catch(error => {
        console.error(error);
  ***REMOVED***);
  ***REMOVED***


  /**
   * FUNCTIONS OVERWRITTEN BY STORAGE-CORE WHICH HANDLES ITS OWN DATA STORAGE IN ./core/storage-core.js
   **/

  saveTransaction() {

    let archive_server 		= {***REMOVED***;
        archive_server.host 	= "localhost";
        archive_server.port 	= 12101;
        archive_server.protocol = "http";

    let message = "archive";
    let data = new saito.transaction();
console.log(JSON.stringify(data));
        data.transaction.msg.archiving = "yes!";
    

console.log("I am... " + this.app.wallet.returnPublicKey());
console.log("sending tx to everyone on the network!");
console.log(JSON.stringify(data));

    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("SAVE ARCHIVE DATA!");
      console.log(JSON.stringify(data));
***REMOVED***);
    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("SAVE ARCHIVE DATA!");
      console.log(JSON.stringify(data));
***REMOVED***);

  ***REMOVED***



/*
  loadArchiveData(type="all", num=50,  mycallback) {

    var txs = [];
    var err = {***REMOVED***;

    let starting_point = this.messages.length - number;
    if (starting_point < 0) { starting_point = 0; ***REMOVED***;

    for (let n = starting_point, m = 0; n < this.messages.length; n++) {
      var t = new saito.transaction();
      try {
        if (this.messages[n].transaction != undefined) {
          t.transaction = this.messages[n].transaction;
          t.dmsg = this.messages[n].dmsg;
          txs[m] = t;
          m++;
    ***REMOVED*** else {***REMOVED***
  ***REMOVED*** catch (err) {***REMOVED***
***REMOVED***

    mycallback(err, txs);

  ***REMOVED***
*/



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

