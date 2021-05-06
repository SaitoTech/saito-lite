'use strict';


const saito    = require('../saito');
const Storage  = require('../storage');
const fs       = require('fs-extra');
const readline = require('readline');
const path     = require('path');
const sqlite   = require('sqlite');
const stream   = require('stream');

class StorageCore extends Storage {

  constructor(app, data, dest="blocks") {
    super(app);

    this.data_dir              = data || path.join(__dirname, '../../../data');
    this.config_dir            = path.join(__dirname, '../../../config');
    this.dest                  = dest;
    this.db                    = [];
    this.dbname                = [];
    this.loading_active        = false;

    this.file_encoding_save    = 'utf8';
    this.file_encoding_load    = 'utf8';
//    this.file_encoding_load    = 'binary';
    //this.file_encoding         = 'binary';

  }


  returnFileSystem() {
    return fs;
  }


  async returnDatabaseByName(dbname) {
    for (let i = 0; i < this.dbname.length; i++) {
      if ( dbname == this.dbname[i] ) {
        return this.db[i]; 
      } 
    }
    try {

      let db = await sqlite.open(this.data_dir + '/'+dbname+'.sq3');

      this.dbname.push(dbname);
      this.db.push(db);

      return this.db[this.db.length-1];

    } catch (err) {

      console.log("Error creating database for db-name: " + dbname);
      return null;

    }
  }


  async loadBlocksFromDisk(maxblocks=0) {

    this.loading_active = true;

    //
    // sort files by creation date, and then name
    // if two files have the same creation date
    //
    let dir   = `${this.data_dir}/${this.dest}/`;

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

          let blk = await this.loadBlockByFilename(fileID);
          if (blk == null) {
            console.log("block is null: " + fileID);
            return null;
          }
          if (blk.is_valid == 0) {
            console.log("We have saved an invalid block: " + fileID);
            return null;
          }

          await this.app.blockchain.addBlockToBlockchain(blk, true);
          console.log("Loaded block " + i + " of " + files.length);

        }
      } catch (err) {
        console.log("ERROR");
        console.log(err);
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
      let filename = `${ this.data_dir}/${this.dest}/${blk.returnFilename()}`;
      if (!fs.existsSync(filename)) {
	let fd = fs.openSync(filename, 'w'); 
        fs.writeSync(fd, blk.returnBlockHeaderData(), this.file_encoding_save);
	for (let i = 0; i < blk.transactions.length; i++) {
          fs.writeSync(fd, "\n", this.file_encoding_save);
          fs.writeSync(fd, JSON.stringify(blk.transactions[i], this.file_encoding_save));
	}
        fs.closeSync(fd);
      }
      return true;
    } catch (err) {
      console.log("ERROR 285029: error saving block to disk " + err);
    }
    return true;

  }



  /* deletes block from shashmap and disk */
  async deleteBlock(bid, bsh, lc) {

    var blk = await this.loadBlockByHash(bsh);
    if (blk == null) {} else {

      //
      // delete txs
      //
      if (blk.transactions != undefined) {
        for (let b = 0; b < blk.transactions.length; b++) {
          for (let bb = 0; bb < blk.transactions[b].transaction.to.length; bb++) {
            blk.transactions[b].transaction.to[bb].bid   = bid;
            blk.transactions[b].transaction.to[bb].bhash = bsh;
            blk.transactions[b].transaction.to[bb].tid   = blk.transactions[b].transaction.id;
            shashmap.delete_slip(blk.transactions[b].transaction.to[bb].returnIndex());
          }
        }
      }

      //
      // deleting file
      //
      let block_filename = await returnBlockFilenameByHashPromise(bsh);

      fs.unlink(block_filename, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  }






  async loadBlockById(bid) {
    let bsh = this.app.blockchain.bid_bsh_hmap[bid];
    let ts  = this.app.blockchain.bsh_ts_hmap[bsh];
    let filename = ts+"-"+bsh+".blk";
    let blk = await this.loadBlockByFilename(filename);
    return blk;
  }

  async loadBlockByHash(bsh) {
    let ts  = this.app.blockchain.bsh_ts_hmap[bsh];
    let filename = ts+"-"+bsh+".blk";
    let blk = await this.loadBlockByFilename(filename);
    return blk;
  }

  async loadBlockByFilename(filename) {

    let block_filename = `${ this.data_dir}/${this.dest}/${filename}`;

    try {
    //
    // readFileSync leads to issues loading from
    // disk. for some reason the only file is not
    // opened and we never hit thc inside
    //
    // we use readline to process the first line as
    // block headers and all subsequent lines (ordered)
    // as transactions for adding to blocks.
    //
    if (fs.existsSync(block_filename)) {

      let headers_processed = 0;

      const rl = readline.createInterface({
        input: fs.createReadStream(block_filename, this.file_encoding_load) ,
        crlfDelay: Infinity
      });

      // async await in every reading of the file causes problems
      let startReading = async () => {
        let blk = null;
        for await (const line of rl ) {
          if (headers_processed == 0) {
            //console.log(`HEADER: ${line}`);
            blk = new saito.block(this.app, JSON.parse(line));
            headers_processed = 1;
          } else {
            //console.log(`TRANSACTION: `);
            let tx = JSON.parse(line);
            blk.transactions.push(new saito.transaction(tx.transaction))
          }
        }
        return blk;
      };
      let blk = await startReading();

//      let data = JSON.parse(fs.readFileSync(block_filename, this.file_encoding_load));
//	console.log(data);
//      let blk = new saito.block(this.app, data);

      return blk;

    } else {
      console.error(`cannot open: ${block_filename} as it does not exist on disk`)
      return null;
    }
    } catch (err) {
      console.log("Error reading block from disk");
      console.error(err);
    }
    console.log("Block not being returned... returning null");
    return null;
  }



  /**
   * Load the options file
   */
  async loadOptions() {

    if (fs.existsSync(`${this.config_dir}/options`)) {

      //
      // open options file
      //
      try {
        let optionsfile = fs.readFileSync(`${this.config_dir}/options`, this.file_encoding_load);
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
  }

  async loadRuntimeOptions() {

    if (fs.existsSync(`${this.config_dir}/runtime.config.js`)) {

      //
      // open runtime config file
      //
      try {
        let configfile = fs.readFileSync(`${this.config_dir}/runtime.config.js`, this.file_encoding_load);
        this.app.options.runtime = JSON.parse(configfile);
      } catch (err) {
        // this.app.logger.logError("Error Reading Runtime Config File", {message:"", stack: err});
        console.error(err);
        process.exit();
      }

    } else {

      //
      // default options file
      //
      this.app.options.runtime = {};

    }
  }

  /**
   * Save the options file
   */
  saveOptions() {

    this.app.options = Object.assign({}, this.app.options);

    try {
      fs.writeFileSync(`${this.config_dir}/options`, JSON.stringify(this.app.options), null, 4);
    } catch (err) {
      // this.app.logger.logError("Error thrown in storage.saveOptions", {message: "", stack: err});
      console.error(err);
      return;
    }

  }

  // overwrite to stop the server from attempting to reset options live
  resetOptions() {}




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
        t.services             = this.app.options.services;
        t.dns                  = [];
        t.blockchain           = {};
        t.registry             = this.app.options.registry;
        t.appstore             = {};
        t.appstore.default     = this.app.wallet.returnPublicKey();
        t.peers.push(client_peer);

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

  }

  returnClientOptions() {

    if (this.app.BROWSER == 1) { return; }
    if (this.app.options) {
      if (this.app.options.client_options) {
        return JSON.stringify(this.app.options.client_options, null, 2);
      }
    }

    let client_peer = Object.assign({}, this.app.server.server.endpoint, {synctype: "lite"});
    //
    // mostly empty, except that we tell them what our latest
    // block_id is and send them information on where our
    // server is located so that they can sync to it.
    //
    var t                      = {};
        t.keys                 = [];
        t.peers                = [];
        t.services             = this.app.options.services;
        t.dns                  = [];
        t.runtime	       = this.app.options.runtime;
        t.blockchain           = {};
        t.wallet               = {};
        t.registry             = this.app.options.registry;
        //t.appstore             = {};
        //t.appstore.default     = this.app.wallet.returnPublicKey();
        t.peers.push(client_peer);

    //
    // return json
    //
    return JSON.stringify(t, null, 2);

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
  async executeDatabase(sql, params, database, mycallback=null) {
    try {
      let db = await this.returnDatabaseByName(database);
      if (mycallback == null) {
        return await db.run(sql, params);
      } else {
        return await db.run(sql, params, mycallback);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async queryDatabase(sql, params, database) {
    try {
      let db = await this.returnDatabaseByName(database);
      var rows = await db.all(sql, params)
      if (rows == undefined) { return []; }
      return rows;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

}

module.exports = StorageCore;

