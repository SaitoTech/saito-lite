'use strict';

const saito = require('./saito');
const axios = require('axios');


class Storage {

  constructor(app, data, dest="blocks") {
    this.app                 = app || {};
    return this;
  }


  async initialize() {
    this.loadOptions();
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
try {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("options", JSON.stringify(this.app.options));
    }
} catch (err) {
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
      let txs = [];
      for (let i = 0; i < obj.txs.length; i++) { txs[i] = new saito.transaction(JSON.parse(obj.txs[i])); }
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

