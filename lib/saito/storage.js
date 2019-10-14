'use strict';

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
   * DUMMY FUNCTIONS IMPLEMENTED BY STORAGE-CORE IN ./core/storage-core.js
   **/

  loadBlockById(bid) {***REMOVED***

  loadBlockByHash(bsh) {***REMOVED***

  loadBlockByFilename(filename) {***REMOVED***

  async loadBlocksFromDisk(maxblocks=0) {***REMOVED***

  returnFileSystem() { return null; ***REMOVED***

  saveClientOptions() {***REMOVED***

  async returnBlockFilenameByHash(block_hash, mycallback) {***REMOVED***

  returnBlockFilenameByHashPromise(block_hash) {***REMOVED***

  async queryDatabase(sql, params, database) {***REMOVED***

  async executeDatabase(sql, params, database) {***REMOVED***

***REMOVED***

module.exports = Storage;

