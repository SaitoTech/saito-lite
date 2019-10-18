'use strict';

const saito = require('./saito');
const axios = require('axios');


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

/****
    let archive_server 		= {***REMOVED***;
        archive_server.host 	= "localhost";
        archive_server.port 	= 12101;
        archive_server.protocol = "http";
****/

    let message = "archive";
    let tx = new saito.transaction();
    let data = {***REMOVED***;
        data.request = "save";
        data.tx = tx;

console.log("I am... " + this.app.wallet.returnPublicKey());
console.log("sending tx to everyone on the network!");
console.log(JSON.stringify(data));

    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("SAVE ARCHIVE DATA!");
      console.log(JSON.stringify(data));
***REMOVED***);

  ***REMOVED***



  loadTransactions(type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {***REMOVED***;
        data.request = "load";
        data.type = "all";
        data.num = 40;

    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("LOAD ARCHIVE DATA IN STORAGE - CB TRIGGERED!");
      console.log(JSON.stringify(data));
      mycallback(data);
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

