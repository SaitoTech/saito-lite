const saito_lib = require('../../lib/saito/saito');
const path = require('path');

class Saito {

  constructor(config={}) {

    this.BROWSER           = 1;
    this.SPVMODE           = 0;
    this.options           = config;
    this.config            = {};

    this.newSaito();

    this.modules    = new saito_lib.modules(this, config.mod_paths);

    return this;
  }

  newSaito() {
    this.crypto     = new saito_lib.crypto();
    this.connection = new saito_lib.connection();
    this.browser    = new saito_lib.browser(this);
    this.storage    = new saito_lib.storage(this);
    this.shashmap   = new saito_lib.shashmap(this);
    this.mempool    = new saito_lib.mempool(this);
    this.wallet     = new saito_lib.wallet(this);
    this.miner      = new saito_lib.miner(this);
    this.keys       = new saito_lib.keychain(this);
    this.network    = new saito_lib.network(this);
    this.networkapi = new saito_lib.networkapi(this);
    this.burnfee    = new saito_lib.burnfee(this);
    this.blockchain = new saito_lib.blockchain(this);

  }

  async init() {
    try {

      await this.storage.initialize();

      let _self = this;

      //
      // having initialized storage, we permit command-line arguments to alter runtime variables
      //
      process.argv.forEach(function (val, index, array) {
	let uvar = val.split("=")[0];
	let uval = val.split("=")[1];
        _self.options.runtime[uvar] = uval;
      });



      this.wallet.initialize();
      this.mempool.initialize();
      this.keys.initialize();

      this.modules.mods = this.modules.mods_list.map(mod_path => {
        const Module = require(`../../mods/${mod_path}`);
        let x = new Module(this);
        x.dirname = path.dirname(mod_path);
        return x;
      });

      //
      // browser sets active module
      //
      await this.browser.initialize();
      await this.modules.initialize();

      //
      // blockchain after modules create dbs
      //
      await this.blockchain.initialize();

      this.network.initialize();

      if (this.server) {
        this.server.initialize();
      }

    } catch(err) {
      console.log("Error occured initializing your Saito install. The most likely cause of this is a module that is throwing an error on initialization. You can debug this by removing modules from your config file to test which ones are causing the problem and restarting.");
      console.log(err);
    }

  }

  async reset(config) {
    this.options = config
    this.newSaito()
    await this.init();
  }

  shutdown() {
    this.network.close();
  }
}

module.exports.Saito = Saito;
module.exports.saito_lib = saito_lib;

