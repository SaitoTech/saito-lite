'use strict';

const saito    = require('../lib/saito/saito');
const fs       = require('fs-extra')
const path     = require('path');
const sqlite = require('sqlite');

class Storage {
  constructor(app, data, dest="blocks") {
    var dir = data || path.join(__dirname, '../data');

    this.app                 = app || {};
    this.directory           = dir;
    this.dest                = dest;
    this.db                  = null;
    this.loading_active      = false;

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




  async loadBlocksFromDisk(maxblocks=0) {

    this.loading_active = true;

    //
    // sort files by creation date, and then name
    // if two files have the same creation date
    //
    let dir   = `${this.directory}/${this.dest}/`;

    //
    // if this takes a long time, our server can
    // just refuse to sync the initial connection
    // as when it starts to connect, currently_reindexing
    // will be set at 1
    //
    let files = fs.readdirSync(dir);

    //
    // "empty" file only
    //
    if (files.length == 1) {
      this.loading_active = false;
      return;
    }

    files.sort(function(a, b) {
      var compres = fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
      if (compres == 0) {
        return parseInt(a) - parseInt(b);
      }
      return compres;
    });

    for (let i = 0; i < files.length; i++) {

      try {

        let fileID = files[i];
        if (fileID !== "empty") {

          let blk = this.loadBlockByFilename(fileID);

          if (blk == null || blk.is_valid == 0) {
            console.log("We have saved an invalid block: " + fileID);
            return null;
          }

          await this.app.blockchain.addBlockToBlockchain(blk, true);

        }
      } catch (err) {
      }
    }
  }




  /**
   * Saves a block to database and disk and shashmap
   *
   * @param {saito.block} blk block
   * @param {int} lc longest chain
   */
  async saveBlock(blk=null, lc=0) {
    try {
      let filename = `${this.directory}/${this.dest}/${blk.returnFilename()}`;
      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, blk.returnBlockFileData(), 'UTF-8');
      }
      return true;
    } catch (err) {
      console.log("ERROR 285029: error saving block to disk " + err);
    }
    return true;
  }



  loadBlockById(bid) {
    let bsh = this.app.blockchain.bid_bsh_hmap[bid];
    let ts  = this.app.blockchain.bsh_ts_hmap[bsh];
    let filename = ts+"-"+bsh+".blk";
    return this.loadBlockByFilename(filename);
  }

  loadBlockByHash(bsh) {
    let ts  = this.app.blockchain.bsh_ts_hmap[bsh];
    let filename = ts+"-"+bsh+".blk";
    return this.loadBlockByFilename(filename);
  }

  loadBlockByFilename(filename) {

    let block_filename = `${this.directory}/${this.dest}/${filename}`;

    try {
    //
    // readFileSync leads to issues loading from
    // disk. for some reason the only file is not
    // opened and we never hit thc inside
    //
    if (fs.existsSync(block_filename)) {

      let data = JSON.parse(fs.readFileSync(block_filename, 'utf8'));
      let blk = new saito.block(this.app, data);

      return blk;

    } else {
      console.error(`cannot open: ${block_filename} as it does not exist on disk`)
      return null;
    }
    } catch (err) {
      console.log("Error reading block from disk");
      console.error(err);
    }

    return null;
  }



  /**
   * Load the options file
   */
  async loadOptions() {

    //
    // servers
    //
    if (this.app.BROWSER == 0) {


      if (fs.existsSync(`${__dirname}/../config/options`)) {

        //
        // open options file
        //
        try {
          let optionsfile = fs.readFileSync(`${__dirname}/../config/options`, 'utf8');
          this.app.options = JSON.parse(optionsfile);
        } catch (err) {
          // this.app.logger.logError("Error Reading Options File", {message:"", stack: err});
          console.error(err);
          process.exit();
        }

      } else {

        //
        // default options file
        //
        this.app.options = JSON.parse('{"server":{"host":"localhost","port":12101,"protocol":"http"}}');

      }
    //////////////
    // browsers //
    //////////////
    } else {

      let data = null;

      ///////////////////////////////
      // fetch from Chrome Storage //
      ///////////////////////////////
      //
      // we should have already fetched
      // our data from the Chrome backend
      // storage. (start.js)
      //
      //if (this.app.CHROME == 1) {
      //  if (this.app.options == null) { this.app.options = {}; }
      //  return;
      //}

      ////////////////////////////
      // read from localStorage //
      ////////////////////////////
      if (typeof(Storage) !== "undefined") {
        data = localStorage.getItem("options");
        this.app.options = JSON.parse(data);
      }

      //////////////////////////
      // or fetch from server //
      //////////////////////////
      if (data == null) {

        //
        // jquery
        //
        $.ajax({
          url: '/options',
          dataType: 'json',
          async: false,
          success: (data) => {
            this.app.options = data;
            console.log("LOADING: " + JSON.stringify(this.app.options));
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("ERROR loading options file from server");
          }
        });
      }
    }
  }

  /**
   * Save the options file
   */
  saveOptions() {

    // if (this.app.options == null) { this.app.options = {}; }
    this.app.options = Object.assign({}, this.app.options);

    if (this.app.CHROME == 1) {
      chrome.storage.local.set({'options': JSON.stringify(this.app.options)});
      return;
    }

    //
    // servers
    //
    if (this.app.BROWSER == 0) {
      try {
        fs.writeFileSync(`${__dirname}/../config/options`, JSON.stringify(this.app.options), null, 4);
      } catch (err) {
        // this.app.logger.logError("Error thrown in storage.saveOptions", {message: "", stack: err});
        console.error(err);
        return;
      }

    //
    // browsers
    //
    } else {
      if (typeof(Storage) !== "undefined") {
        localStorage.setItem("options", JSON.stringify(this.app.options));
      }
    }
  }



  /**
   * Reset the options file
   */
  resetOptions() {

    //
    // prevents caching
    //
    let tmpdate = new Date().getTime();
    let loadurl = `/options?x=${tmpdate}`;

    return new Promise((resolve, reject) => {
      $.ajax({
        url: loadurl,
        dataType: 'json',
        async: false,
        success: (data) => {
          this.app.options = data;
          this.saveOptions();
          resolve();
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.error(err);
          reject();
        }
      });
    })

  }


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

    if (this.app.BROWSER == 1) { return; }
    let client_peer = Object.assign({}, this.app.server.server.endpoint, {synctype: "lite"});
    //
    // mostly empty, except that we tell them what our latest
    // block_id is and send them information on where our
    // server is located so that they can sync to it.
    //
    var t                      = {};
        t.keys                 = [];
        t.peers                = [];
        t.proxymod             = [];
        t.dns                  = [];
        t.blockchain           = {};
        t.registry             = this.app.options.registry;
        // t.dns                  = this.app.dns.dns.domains;
        t.peers.push(client_peer);
        t.proxymod.push(client_peer);

    //
    // write file
    //
    try {
      fs.writeFileSync(`${__dirname}/web/client.options`, JSON.stringify(t));
    } catch(err) {
      console.log(err);
      console.error(err);
      // this.app.logger.logError("Error thrown in storage.saveBlock", {message: "", stack: err});
    }

    // fs.writeFileSync("saito/web/client.options", JSON.stringify(t), (err) => {
    //   if (err) {
    //   console.log(err);
    //   this.app.logger.logError("Error thrown in storage.saveBlock", {message: "", stack: err});
    //   }
    // });

  }

  returnClientOptions() {

    if (this.app.BROWSER == 1) { return; }
    let client_peer = Object.assign({}, this.app.server.server.endpoint, {synctype: "lite"});
    //
    // mostly empty, except that we tell them what our latest
    // block_id is and send them information on where our
    // server is located so that they can sync to it.
    //
    var t                      = {};
        t.keys                 = [];
        t.peers                = [];
        t.proxymod             = [];
        t.dns                  = [];
        t.blockchain           = {};
        t.wallet               = {};
        t.registry             = this.app.options.registry;
        // t.dns                  = this.app.dns.dns.domains;
        t.peers.push(client_peer);
        t.proxymod.push(client_peer);

    //
    // write file
    //
    try {
      //fs.writeFileSync(`${__dirname}/web/client.options`, JSON.stringify(t));
      return t;
    } catch(err) {
      console.log(err);
      console.error(err);
      // this.app.logger.logError("Error thrown in storage.saveBlock", {message: "", stack: err});
    }

    // fs.writeFileSync("saito/web/client.options", JSON.stringify(t), (err) => {
    //   if (err) {
    //   console.log(err);
    //   this.app.logger.logError("Error thrown in storage.saveBlock", {message: "", stack: err});
    //   }
    // });

  }

  /**
   * TODO: uses a callback and should be moved to await / async promise
   **/
  async returnBlockFilenameByHash(block_hash, mycallback) {

    let sql    = "SELECT id, ts, block_id FROM blocks WHERE hash = $block_hash";
    let params = { $block_hash : block_hash };

    try {
      let row = await this.db.get(sql, params)
      if (row == undefined) {
        mycallback(null, "Block not found on this server");
        return
      }
      let filename = `${row.ts}-${block_hash}.blk`;
      mycallback(filename, null);
    } catch (err) {
      console.log("ERROR getting block filename in storage: " + err);
      mycallback(null, err);
    }

  }

  returnBlockFilenameByHashPromise(block_hash) {
    return new Promise((resolve, reject) => {
      this.returnBlockFilenameByHash(block_hash, (filename, err) => {
        if (err) { reject(err) }
        resolve(filename);
      })
    })
  }

  /**
   *
   * @param {*} sql
   * @param {*} params
   * @param {*} callback
   */
  async queryDatabase(sql, params, callback) {
    if (this.this.app.BROWSER == 1) { return; }
    var row = await this.db.get(sql, params)
    var err = {};
    if (row == undefined) { return null; }
    callback(null, row);
  }

  /**
   *
   * @param {*} sql
   * @param {*} params
   * @param {*} callback
   */
  async queryDatabaseArray(sql, params, callback) {
    if (this.app.BROWSER == 1) { return; }
    var rows = await this.db.all(sql, params)
    var err = {};
    if (rows == undefined) { return null; }
    callback(null, rows);
  }

}

module.exports = Storage;

