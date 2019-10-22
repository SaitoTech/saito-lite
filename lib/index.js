const saito_lib = require('./saito/saito');
const path = require('path');

//const logger = 
const logger = require('./saito_logger.js')

class Saito {

  constructor(config={}) {

    this.BROWSER           = 1;
    this.SPVMODE           = 0;
    this.options           = config;

    this.newSaito();

    this.modules    = new saito_lib.modules(this, config.mod_paths);

    // include our necessary functionality
    if (config.storage ) {
      this.storage    = new config.storage(this);
    }

    if (config.server) {
      this.server     = new config.server(this);
    }

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
//    this.archives   = new saito_lib.archives(this);
//    this.dns        = new saito_lib.dns(this);
    this.keys       = new saito_lib.keychain(this);
    this.network    = new saito_lib.network(this);
    this.burnfee    = new saito_lib.burnfee(this);
    this.blockchain = new saito_lib.blockchain(this);
  }

  // if (process.env.NODE_ENV !== 'production') {
  //   logger.add(new winston.transports.Console({
  //     format: winston.format.simple()
  //   }));
  // }

  async init() {
    logger.info('init saito');

    try {
      await this.storage.initialize();

      this.wallet.initialize();
      this.mempool.initialize();
      this.keys.initialize();

      this.modules.mods = this.modules.mods_list.map(mod_path => {
        const Module = require(`../mods/${mod_path}`);
	let x = new Module(this);
	x.dirname = path.dirname(mod_path);
        return x;
      });

      logger.info('init network');
      this.network.initialize();

      // this.dns.initialize();
      await this.modules.initialize();

      //
      // after mods exist, as this calls initializeHTML and attachEvents
      //
      this.browser.initialize();

      if (this.server) {
        this.server.initialize();
      }
    } catch(err) {
      logger.info(err);
    }
  }

  async reset(config) {
    this.options = config
    this.newSaito()
    await this.init();
  }

  shutdown() {
    logger.info('shutdown saito');
    this.network.close();
  }
}

module.exports.Saito = Saito;
module.exports.saito_lib = saito_lib;

