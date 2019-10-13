// const ModTemplate = require('./templates/template');
const saito_lib = require('./saito/saito');

class Saito {

  constructor(config={}) {

    this.BROWSER           = 1;
    this.SPVMODE           = 0;
    this.options           = config;

    this.newSaito();

    this.modules    = new saito_lib.modules(this, config.mod_paths);

    // include our necessary functionality
    this.storage    = new config.storage(this);

    if (config.server) {
      this.server     = new config.server(this);
    }

    return this;
  }

  newSaito() {

    console.log("OUR OPTIONS", this.options);
    this.crypto     = new saito_lib.crypto();
    this.connection = new saito_lib.connection();
    // this.storage    = new saito_lib.storage(this);
    this.shashmap   = new saito_lib.shashmap(this);
    this.mempool    = new saito_lib.mempool(this);
    this.wallet     = new saito_lib.wallet(this);
    this.miner      = new saito_lib.miner(this);
//    this.archives   = new saito_lib.archives(this);
//    this.dns        = new saito_lib.dns(this);
//    this.keys       = new saito_lib.keychain(this);
    this.network    = new saito_lib.network(this);
    this.burnfee    = new saito_lib.burnfee(this);
    this.blockchain = new saito_lib.blockchain(this);
  }

  async init() {
    try {
      await this.storage.initialize();

      this.wallet.initialize();
      this.mempool.initialize();
      this.network.initialize();

      // this.keys.initialize();
      this.modules.mods = this.modules.mods_list.map(mod_path => {
        const Module = require(`../mods/${mod_path}`);
        return new Module(this);
      });

      this.modules.pre_initialize();
      // this.dns.initialize();
      this.modules.initialize();

      if (this.server) {
        this.server.initialize();
      }
    } catch(err) {
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
// ModTemplate, GameTemplate
