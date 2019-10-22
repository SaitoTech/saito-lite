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
        logger.error(error);
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

    this.app.network.sendRequestWithCallback(message, data, function(res) {
      logger.info("SAVED ARCHIVE DATA!");
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
      logger.info("DELETED ARCHIVE DATA");
    });

  }



  loadTransactions(type="all", num=50,  mycallback) {

    let message = "archive";
    let data = {};
        data.request = "load";
        data.type = "all";
        data.num = 40;

    this.app.network.sendRequestWithCallback(message, data, function(obj) {
      logger.info("LOADED ARCHIVE DATA");
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

