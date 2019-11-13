const saito_lib = require('./saito/saito');
const path = require('path');

class Saito {

  constructor(config={***REMOVED***) {

    this.BROWSER           = 1;
    this.SPVMODE           = 0;
    this.options           = config;

    this.newSaito();

    this.modules    = new saito_lib.modules(this, config.mod_paths);

    // include our necessary functionality
    if (config.storage ) {
      this.storage    = new config.storage(this);
***REMOVED***

    if (config.server) {
      this.server     = new config.server(this);
***REMOVED***

    return this;
  ***REMOVED***

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
    this.burnfee    = new saito_lib.burnfee(this);
    this.blockchain = new saito_lib.blockchain(this);
    this.bank       = new saito_lib.bank(this);
  ***REMOVED***

  async init() {
    try {
      await this.storage.initialize();

      this.wallet.initialize();
      this.mempool.initialize();
      this.keys.initialize();

      this.modules.mods = this.modules.mods_list.map(mod_path => {
        const Module = require(`../mods/${mod_path***REMOVED***`);
	let x = new Module(this);
	x.dirname = path.dirname(mod_path);
        return x;
  ***REMOVED***);

      await this.blockchain.initialize();

      //
      // browser sets active module
      //
      await this.browser.initialize();
      await this.modules.initialize();


      this.network.initialize();

      // this.dns.initialize();

      //
      // after mods exist, as this calls initializeHTML and attachEvents
      //

      if (this.server) {
        this.server.initialize();
  ***REMOVED***
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***

  async reset(config) {
    this.options = config
    this.newSaito()
    await this.init();
  ***REMOVED***

  shutdown() {
    this.network.close();
  ***REMOVED***
***REMOVED***

module.exports.Saito = Saito;
module.exports.saito_lib = saito_lib;

