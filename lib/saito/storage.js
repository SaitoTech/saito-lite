'use strict';
const saito = require('./saito');

class Storage {

  constructor(app, data, dest="blocks") {
    this.app                 = app || {};
  }

  async initialize() {
    await this.loadOptions();
    this.saveOptions();
    return;
  }

  async loadOptions() {
    if (typeof(Storage) !== "undefined") {

      let data = localStorage.getItem("options");
      if (data != "null" && data != null)  {
        this.app.options = JSON.parse(data);
      } else {

        try {
          let response = await fetch(`/options`);
          this.app.options = await response.json();
          this.saveOptions();
        } catch(err) {
          console.error(err);
        }

      }
    }
  }

  saveOptions() {
    try {
      if (typeof(Storage) !== "undefined") {
        localStorage.setItem("options", JSON.stringify(this.app.options));
      }
    } catch (err) {
      console.log(err);
    }
  }

  async resetOptions() {
    try {
      let response = await fetch(`/options`);
      this.app.options = await response.json();
      this.saveOptions();
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * FUNCTIONS OVERWRITTEN BY STORAGE-CORE WHICH HANDLES ITS OWN DATA STORAGE IN ./core/storage-core.js
   **/

  saveTransaction(tx) {

console.log("saving this tx... " + tx.transaction.msg.module);

    let message = "archive";
    let data = {};
        data.request = "save";
        data.tx = tx;

    this.app.network.sendRequestWithCallback(message, data, function(res) {
      console.log("SAVED ARCHIVE DATA!");
    });

  }

  deleteTransaction(tx) {

    let message = "archive";
    let data = {};
        data.request = "delete";
        data.tx = tx;
        data.publickey = this.app.wallet.returnPublicKey();
        data.sig = this.app.crypto.signMessage(("delete_"+tx.transaction.sig), this.app.wallet.returnPrivateKey());

    this.app.network.sendRequestWithCallback(message, data, function(data) {
      console.log("DELETED ARCHIVE DATA");
    });

  }

  loadTransactions(type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {};
        data.request = "load";
        data.type = type;
        data.num = num;
        data.publickey = this.app.wallet.returnPublicKey();

    this.app.network.sendRequestWithCallback(message, data, function(obj) {
      console.log("LOADED ARCHIVE DATA");
console.log("THIS IS FETCHED: " + JSON.stringify(obj));
      let txs = obj.txs.map(tx => new saito.transaction(JSON.parse(tx)));
      mycallback(txs);
    });

  }

  loadTransactionsByKeys(keys, type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {};
        data.request = "load_keys";
        data.keys = keys;
        data.type = type;
        data.num = num;

    this.app.network.sendRequestWithCallback(message, data, function(obj) {
      if (obj == undefined) { mycallback([]); return; }
      if (obj.txs == undefined) { mycallback([]); return; }
      if (obj.txs.length == 0) { mycallback([]); return; } 
      let txs = obj.txs.map(tx => new saito.transaction(JSON.parse(tx)));
      mycallback(txs);
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

