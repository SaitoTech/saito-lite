//const ModTemplate = require('./modtemplate');
const AbstractCryptoModule = require('./abstractcryptomodule')
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');

/**
* An Implementation of AbstractCryptoModule that supports any substrate-based module
* @extends AbstractCryptoModule
* @example
* class Polkadot extends SubstrateBasedCrypto {
*   constructor(app) {
*     super(app, 'DOT', saitoEndpoint, "Polkadot's Existential Deposit is 1 DOT, be sure not to send less than 1 DOT or leave less than 1 DOT in your wallet.");
*     this.name = 'Polkadot';
*     this.description = 'Polkadot application layer for in-browser Polkadot applications. Install this module to make Polkadot your default in-browser cryptocurrency';
*     this.categories = "Cryptocurrency";
*   }
* ...
*/
class SubstrateBasedCrypto extends AbstractCryptoModule {

  /**
   * Construct SubstrateBasedCrypto
   * @param {Object} app - Saito Application Context
   * @param {String} ticker - Ticker symbol of underlying Cryptocurrency
   * @param {String} endpoint - URI of Substrate Endpoint location
   * @param {String} info - Option info about this module
   * @example 
   * super(app, "DOT", localhost:3838, 'DOT mainnet')
   */
  constructor(app, ticker, endpoint, info = '') {
    super(app, ticker);
    this.endpoint = endpoint;
    this.info = info;
    this.optionsStorage = {};
    this._api = null; // treat as private, please use getApi to access
    this.mods = [];
    this.keypair = null;
    this.keyring = null;
    this.eventEmitter = new EventEmitter();
  }
 /**
  * installModule runs when a node initialized a module for the first time
  * @param {Object} app - Saito Application Context
  */
  
  installModule(app) {
    app.wallet.setPreferredCrypto(this.name);
  }
 /**
  * Initialize Endpoint API connection and keyring
  * @param {Object} app - Saito Application Context
  */
  initialize(app) {
    if (app.BROWSER) {
      super.initialize(app);
      this.load();
      const wsProvider = new WsProvider(this.endpoint);
      this._api = new ApiPromise({ provider: wsProvider });
      this._api.on('connected', (stream) => {
        //console.log(this.description + ' Polkadot Socket Provider connected');
      });
      this._api.on('disconnected', (stream) => {
        //console.log(this.description + ' Polkadot Socket Provider disconnected');
      });
      this._api.on('ready', (stream) => {
        //console.log(this.description + ' Polkadot Socket Provider ready');
      });
      this._api.on('error', (stream) => {
        //console.log(this.description + ' Polkadot Socket Provider error');
      });
      this.keyring = new Keyring({ type: 'ed25519'});
      this.keyring.setSS58Format(0);
      if(!this.optionsStorage.keypair) {
        let keypair = this.keyring.addFromSeed(randomBytes(32), { name: 'polkadot pair' }, 'ed25519');
        this.optionsStorage.keypair = keypair.toJson();
        this.save();
      }
      this.keypair = this.keyring.addFromJson(this.optionsStorage.keypair);  
      this.keypair.decodePkcs8();
    }
  }
 /**
  * async getter for Endpoint API
  * @param {Object} app - Saito Application Context
  */
 
  async getApi() {
    await this._api.isReady;
    return this._api;
  }
  // Token decimals:
  //
  //     Polkadot (DOT): 10
  //     Kusama (KSM): 12
  getFormatedAmount(amount) {

  }
  fromFormatedAmount(amount) {

  }
  // existential deposit (ED) to prevent dust accounts from bloating state. If an account drops below the ED, it will be reaped,
  // Polkadot's ED is 1 DOT, while Kusama's is 0.0016666 KSM.

  
  /**
   * Forces input address into the desired format.
   * Input address can be any format, DOT, KSM, or Substrate.
   * https://polkadot.js.org/docs/api/start/create
   * @param {String} address - An address in any subtrate format. See: https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)
   * @param {String} format - The desired output format. format ∈ {"polkadot","kusama","substrateRaw"}
   */
  getFormattedAddress(address, format = "polkadot") {
    // https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)
    // https://wiki.polkadot.network/docs/en/learn-accounts
    //
    // Polkadot addresses always start with the number 1.
    // Kusama addresses always start with a capital letter like C, D, F, G, H, J...
    // Generic Substrate addresses start with 5.
    //
    // Give some semantics to the polkadot magic numbers
    let formats = {"polkadot": 0, "kusama": 2, "substrateRaw": 42 };
    return encodeAddress(decodeAddress(address), formats[format]);
  }
 /**
  * async getter for Endpoint API
  * @param {Object} app - Saito Application Context
  */
  getAddress() {
    if (this.ticker == "KSM") {
      return this.getFormattedAddress(this.keypair.address, "kusama");
    } else if (this.ticker == "WESTIE") {
      return this.getFormattedAddress(this.keypair.address, "substrateRaw");
    } else {
      return this.getFormattedAddress(this.keypair.address);
    }
  }
  async getBalance(){
    let api = await this.getApi();
    const { nonce, data: balance } = await api.query.system.account(this.keypair.publicKey);
    if (this.ticker == "WESTIE") {
      return balance.free/1000000000000;
    } else {
      return balance.free;
    }
  }
  async transfer(howMuch, to) {
    if (this.ticker == "WESTIE") {
      howMuch = howMuch*1000000000000;
    }
    let api = await this.getApi();
    const tx = await api.tx.balances.transfer(to, howMuch);
    const hash = await tx.signAndSend(this.keypair);
  }
  save() {
    let moduleOptions = this.app.storage.getModuleOptionsByName(this.name);
    moduleOptions.storage = this.optionsStorage;
    this.app.storage.saveOptions();
  }
  load() {
    let moduleOptions = this.app.storage.getModuleOptionsByName(this.name);
    if(moduleOptions) {
      if(!moduleOptions.storage) {
        moduleOptions.storage = {};
        this.save();
      }
      this.optionsStorage = moduleOptions.storage;
    } else {
      throw "Module Not Installed: " + this.name;
    }
  }
}
module.exports = SubstrateBasedCrypto;
