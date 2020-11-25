const saito = require('../../../lib/saito/saito');
const ModTemplate = require('../../../lib/templates/modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');

// A Module to support KSM, DOT, or any other Substrate-based crypto
class SubstrateBasedCrypto extends ModTemplate {

  constructor(app, ticker, endpoint) {
    super(app);
    this.ticker = ticker;
    this.endpoint = endpoint;
    this.categories = "Crptocurrency";
    this.optionsStorage = {};
    this.app = app;
    this._api = null; // treat as private, please use getApi to access
    this.mods = [];
    this.keypair = null;
    this.keyring = null;
  }
  
  requestInterface(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        name: this.name,
        description: this.description,
        ticker: this.ticker,
        getBalance: this.getBal.bind(this),
        transfer: this.transfer.bind(this),
        getAddress: this.getAddress.bind(this),
        subscribe: null,
        estimateFee: null,
      }
    }
    return null;
  }
  async getApi() {
    await this._api.isReady;
    return this._api;
  }
  // address can be any format
  getFormattedAddress(address, format = "polkadot") {
    // https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)
    // Give some semantics to the polkadot magic numbers
    let formats = {"polkadot": 0, "kusama": 2, "substrateRaw": 42 };
    return encodeAddress(decodeAddress(address), formats[format]);
  }
  getAddress() {
    return this.keypair.address;
  }
  async getBal(){
    let api = await this.getApi();
    // 5ERZ1oCunsuRueffZBEfsScu169GReLHb84yaETzMQZcsjko
    const { nonce, data: balance } = await api.query.system.account(this.keypair.publicKey);
    return balance.free;  
  }
  async transfer(howMuch, to) {
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
  initialize(app) {
    if(app.BROWSER) {
      super.initialize(app);
      this.load();
      const wsProvider = new WsProvider(this.endpoint);
      this._api = new ApiPromise({ provider: wsProvider });
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
}
module.exports = SubstrateBasedCrypto;