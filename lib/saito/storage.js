'use strict';
const saito = require('./saito');
const EventEmitter = require('events');

class Storage {

  constructor(app, data, dest="blocks") {
    this.app                 = app || {};
  }

  async initialize() {
    await this.loadOptions();
    await this.loadRuntimeOptions();
    this.saveOptions();
    this.eventEmitter = new EventEmitter();
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

  //
  // lite-clients get runtime options as part of their options
  // files or nothing. once set, we will reload with the same
  // config each time.
  //
  async loadRuntimeOptions() {
    if (!this.app.options.runtime) { this.app.options.runtime = {}; }
    try {
      if (this.app.options.runtime["env"] === "DEV") {
        let response = await fetch(`/runtime`);
        this.app.options.runtime = await response.json();
        this.saveOptions();
      }
    } catch(err) {
      console.error(err);
    }
  }

  saveOptions() {

    //
    // only the active tab will save
    //
    if (this.app.BROWSER == 1) {
      if (this.app.browser.active_tab == 0) { 
        console.log("noping out as inactive tab!");
        return;
      } 
    }


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
  async deleteBlock(bid, bsh, lc) {
  }


  saveTransaction(tx) {

    let txmsg = tx.returnMessage();

    let message = "archive";
    let data = {};
        data.request = "save";
        data.tx = tx;
        data.type = txmsg.module;

    this.app.network.sendRequestWithCallback(message, data, function(res) {
    });

  }


  saveTransactionByKey(key, tx) {

    let txmsg = tx.returnMessage();

    let message = "archive";
    let data = {};
        data.request = "save_key";
        data.tx = tx;
        data.key = key;
        data.type = txmsg.module;

    this.app.network.sendRequestWithCallback(message, data, function(res) {
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
      let txs = [];
      if (obj) {
        if (obj.txs) {
          if (obj.txs.length > 0) {
            txs = obj.txs.map(tx => new saito.transaction(JSON.parse(tx)));
          }
        }
      }
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
      let txs = [];
      if (obj) {
        if (obj.txs) {
          if (obj.txs.length > 0) {
            txs = obj.txs.map(tx => new saito.transaction(JSON.parse(tx)));
          }
        }
      }
      mycallback(txs);
    });

  }


  //
  // temporary function which breaks a string containing both 
  // header and transactions received over the network into
  // header and transaction array for simplifying block creation
  //
  convertBlockStringToHeadersAndTransactionsJSON(blkstr="") {

    let obj = {};
        obj.headers = "";
        obj.transactions = [];

    if (blkstr.indexOf("\n") == -1) { obj.headers = blkstr; return obj; }

    let tmpar = blkstr.split("\n");

    if (tmpar.length > 0) {
      obj.headers = tmpar[0];
    }
    for (let i = 1; i < tmpar.length; i++) {
      obj.transactions.push(tmpar[i]);
    }

    return obj;

  }
  getModuleOptionsByName(modname) {
    for (var i = 0; i < this.app.options.modules.length; i++) {
      if(this.app.options.modules[i].name === modname) {
        return this.app.options.modules[i];
      }
    }
    return null;
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

  async returnDatabaseByName(dbname) { return null; }

  async returnBlockFilenameByHash(block_hash, mycallback) {}

  returnBlockFilenameByHashPromise(block_hash) {}

  async queryDatabase(sql, params, database) {}

  async executeDatabase(sql, params, database, mycallback=null) {}

}

module.exports = Storage;

