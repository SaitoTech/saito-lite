'use strict';

const saito = require('./saito');
const axios = require('axios');


class Storage {

  constructor(app, data, dest="blocks") {

    this.app                 = app || {};

    return this;
  }

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
  }

  loadOptions() {
    if (typeof(Storage) !== "undefined") {
      let data = localStorage.getItem("options");
      if (data != "null")  {
        this.app.options = JSON.parse(data);
      }
    }
  }

  saveOptions() {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("options", JSON.stringify(this.app.options));
    }
  }

  resetOptions() {
    return axios.get(`/options`)
      .then(response => {
        this.app.options = response.data;
        this.saveOptions();
      })
      .catch(error => {
        console.error(error);
      });
  }


  /**
   * FUNCTIONS OVERWRITTEN BY STORAGE-CORE WHICH HANDLES ITS OWN DATA STORAGE IN ./core/storage-core.js
   **/

  saveTransaction(tx) {

/****
    let archive_server 		= {};
        archive_server.host 	= "localhost";
        archive_server.port 	= 12101;
        archive_server.protocol = "http";
****/

    let message = "archive";
    let data = {};
        data.request = "save";
        data.tx = tx;

console.log("I am... " + this.app.wallet.returnPublicKey());
console.log("sending tx to everyone on the network!");
console.log(JSON.stringify(data));

    this.app.network.sendRequestWithCallback(message, data, function(res) {
      console.log("SAVED ARCHIVE DATA!");
      console.log(JSON.stringify(res));
    });

  }



  loadTransactions(type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {};
        data.request = "load";
        data.type = "all";
        data.num = 40;

console.log("\n\n\nASKING TO LOAD TRANSACTIONS -- sendrequest with callback " + JSON.stringify(data));

    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("LOAD ARCHIVE DATA IN STORAGE - CB TRIGGERED!");
      console.log(JSON.stringify(data));
      mycallback(data);
    });

  }




  /**
   * DUMMY FUNCTIONS IMPLEMENTED BY STORAGE-CORE IN ./core/storage-core.js
   **/

  loadBlockById(bid) {}

  loadBlockByHash(bsh) {}

  loadBlockByFilename(filename) {}

  async loadBlocksFromDisk(maxblocks=0) {}

  returnFileSystem() { return null; }

  async saveBlock() {}

  saveClientOptions() {}

  async returnBlockFilenameByHash(block_hash, mycallback) {}

  returnBlockFilenameByHashPromise(block_hash) {}

  async queryDatabase(sql, params, database) {}

  async executeDatabase(sql, params, database) {}

}

module.exports = Storage;

