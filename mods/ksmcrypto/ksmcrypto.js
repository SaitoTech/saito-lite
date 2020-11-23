const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring }  = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider }  = require('@polkadot/api');
const { randomBytes }   = require('crypto');
class KSMCrypto extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "KSMCrypto";
    this.description = "Payment Gateway for DOT cryptocurrency in Saito Application";
    this.categories = "Crptocurrency";
    this.ticker = "KSM";
    this.optionsStorage = {};
    this.app = app;
    this._api = null; // treat as private, please use getApi to access
    this.mods = [];
  }
  
  requestInterface(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        ticker: this.ticker,
        getBalance: this.getBal.bind(this),
        transfer: this.transfer.bind(this),
        getPubkey: this.getPubkey.bind(this),
        subscribe: null,
        getKeyring: null,
        buildRawTx: null,
      }
    }
    return null;
  }
  async initializeApi() { 
    const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    this._api = new ApiPromise({ provider: wsProvider });
    await this._api.isReady;
  }
  async getApi() {
    console.log("KSMCrypto getapi");
    await this._api.isReady;
    console.log("KSMCrypto ready...");
    return this._api;
  }
  async getPubkey() {
    return this.optionsStorage.keypair.address;
  }
  async getBal(){
    let api = await this.getApi();
    const { nonce, data: balance } = await api.query.system.account(this.optionsStorage.keypair.address);
    return balance.free;  
  }
  async transfer(howMuch, to) {
    console.log("transfer");
    console.log(howMuch);
    console.log(to);
    // let api = await this.getApi();
    // const txHash = await api.tx.balances
    //   .transfer(to, howMuch)
    //   .signAndSend(this.optionsStorage.keypair);
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
    console.log("****************** KSMCrypto initialize ******************");
    if(app.BROWSER) {
      super.initialize(app);
      const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
      this._api = new ApiPromise({ provider: wsProvider });
      this.getApi();
      this.load();
      // sr25519 only has a WASM interface
      const keyring = new Keyring({ type: 'ed25519', ss58Format: 2 });
      if(!this.optionsStorage.keypair) {
        this.optionsStorage.keypair = keyring.addFromSeed(randomBytes(32), { name: 'polkadot pair' }, 'ed25519');
        this.save();
      } else {
        this.optionsStorage.keypair = keyring.addFromJson(JSON.parse('{"address":"5ERZ1oCunsuRueffZBEfsScu169GReLHb84yaETzMQZcsjko","encoded":"4G+yKKzNBkVqGDh9TCcK7UJl6Xjn+l3q98RYrpzHakkAgAAAAQAAAAgAAADy8d3T+iSCaH4EjSwHU3tGBmbPOUGL3WI8eII/vt466R3k3Kc7bmSpIDutifmRg8gE2ay0uFie+iMpTZ/5U6KHi7jlo1NZ6nlxZSQBC4w1tBfCd3QfPA7usxrtnUGDVngL+WvbvJlh0nwWU8CKVJptRjtNrjv5QXhOLTcpdO8dmshN2DbJVWtn7iaalaLoB6ngzMhK1kGV76DTmp7j","encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"meta":{"genesisHash":null,"name":"saito","whenCreated":1606092444131}}'));
        this.save();
      }
    }
  }
  initializeHTML(app) {
    if (this.app.BROWSER == 0 || !this.browser_active) { return; };
    document.querySelector("#content .main").innerHTML = "<div id='greeting'>Hello World!</div>"
    addCss();
  }
}

module.exports = KSMCrypto;

