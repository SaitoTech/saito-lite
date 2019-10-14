'use strict';

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
   * DUMMY FUNCTIONS IMPLEMENTED BY STORAGE-CORE IN ./core/storage-core.js
   *
   */

  loadBlockById(bid) {}

  loadBlockByHash(bsh) {}

  loadBlockByFilename(filename) {}

  async loadBlocksFromDisk(maxblocks=0) {}

  saveClientOptions() {}

  async returnBlockFilenameByHash(block_hash, mycallback) {}

  returnBlockFilenameByHashPromise(block_hash) {}

  async queryDatabase(sql, params, callback) {}

  async queryDatabaseArray(sql, params, callback) {}

}

module.exports = Storage;

