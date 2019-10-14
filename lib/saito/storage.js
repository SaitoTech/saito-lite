'use strict';
// const saito    = require('./saito');
// const fs       = require('fs-extra')
// const path     = require('path');


class Storage {
  constructor(app, data, dest="blocks") {
    // var dir = data || path.join(__dirname, '../../data');
    // var dir = "";

    this.app                 = app || {***REMOVED***;
    // this.directory           = dir;
    // this.dest                = dest;
    // this.db                  = null;
    // this.loading_active      = false;

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



  loadBlockById(bid) {
    let bsh = this.app.blockchain.bid_bsh_hmap[bid];
    let ts  = this.app.blockchain.bsh_ts_hmap[bsh];
    let filename = ts+"-"+bsh+".blk";
    return this.loadBlockByFilename(filename);
  ***REMOVED***

  loadBlockByHash(bsh) {
    let ts  = this.app.blockchain.bsh_ts_hmap[bsh];
    let filename = ts+"-"+bsh+".blk";
    return this.loadBlockByFilename(filename);
  ***REMOVED***

  loadBlockByFilename(filename) {***REMOVED***


  async loadBlocksFromDisk(maxblocks=0) {***REMOVED***


  ///////////////////////
  // saveClientOptions //
  ///////////////////////
  //
  // when browsers connect to our server, we check to see
  // if the client.options file exists in our web directory
  // and generate one here if it does not.
  //
  // this is fed out to client browsers and serves as their
  // default options, specifying us as the node to which they
  // should connect and through which they can route their
  // transactions. :D
  //
  saveClientOptions() {

    if (this.app.BROWSER == 1) { return; ***REMOVED***
    let client_peer = Object.assign({***REMOVED***, this.app.server.server.endpoint, {synctype: "lite"***REMOVED***);
    //
    // mostly empty, except that we tell them what our latest
    // block_id is and send them information on where our
    // server is located so that they can sync to it.
    //
    var t                      = {***REMOVED***;
        t.keys                 = [];
        t.peers                = [];
        t.proxymod             = [];
        t.dns                  = [];
        t.blockchain           = {***REMOVED***;
        t.registry             = this.app.options.registry;
        t.dns                  = this.app.dns.dns.domains;
        t.peers.push(client_peer);
        t.proxymod.push(client_peer);

    //
    // write file
    //
    try {
      fs.writeFileSync(`${__dirname***REMOVED***/web/client.options`, JSON.stringify(t));
***REMOVED*** catch(err) {
      console.log(err);
      console.error(err);
      // this.app.logger.logError("Error thrown in storage.saveBlock", {message: "", stack: err***REMOVED***);
***REMOVED***

    // fs.writeFileSync("saito/web/client.options", JSON.stringify(t), (err) => {
    //   if (err) {
    //   console.log(err);
    //   this.app.logger.logError("Error thrown in storage.saveBlock", {message: "", stack: err***REMOVED***);
    //   ***REMOVED***
    // ***REMOVED***);

  ***REMOVED***

  /**
   * TODO: uses a callback and should be moved to await / async promise
   **/
  async returnBlockFilenameByHash(block_hash, mycallback) {***REMOVED***

  returnBlockFilenameByHashPromise(block_hash) {***REMOVED***

  /**
   *
   * @param {****REMOVED*** sql
   * @param {****REMOVED*** params
   * @param {****REMOVED*** callback
   */
  async queryDatabase(sql, params, callback) {***REMOVED***

  /**
   *
   * @param {****REMOVED*** sql
   * @param {****REMOVED*** params
   * @param {****REMOVED*** callback
   */
  async queryDatabaseArray(sql, params, callback) {***REMOVED***

***REMOVED***

module.exports = Storage;

