const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring }  = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider }  = require('@polkadot/api');
const { randomBytes }   = require('crypto');
class WestendCrypto extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "WestendCrypto";
    this.description = "Payment Gateway for DOT cryptocurrency in Saito Application";
    this.categories = "Crptocurrency";
    this.ticker = "WESTIE";
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
    const wsProvider = new WsProvider('ws://localhost');
    this._api = new ApiPromise({ provider: wsProvider });
    await this._api.isReady;
  }
  async getApi() {
    console.log("WestendCrypto getapi");
    console.log(this._api);
    await this._api.isReady;
    console.log("WestendCrypto ready...");
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
    console.log("WestendCrypto transfer");
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
    console.log("****************** WestendCrypto initialize ******************");
    if(app.BROWSER) {
      super.initialize(app);
      const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      this._api = new ApiPromise({ provider: wsProvider });
      this.getApi();
      this.load();
      // sr25519 only has a WASM interface
      const keyring = new Keyring({ type: 'ed25519', ss58Format: 2 });
      if(!this.optionsStorage.keypair) {
        this.optionsStorage.keypair = keyring.addFromSeed(randomBytes(32), { name: 'polkadot pair' }, 'ed25519');
        this.save();
      }
    }
  }

  initializeHTML(app) {
    if (this.app.BROWSER == 0 || !this.browser_active) { return; };
    document.querySelector("#content .main").innerHTML = "<div id='greeting'>Hello World!</div>"
    addCss();
  }
  tryLoadFromLocalStorage() {
    
  }
  getBalance() {
    
  }
  
  
  // const unsub = await api.query.system.account(ADDR, ({ nonce, data: balance }) => {
  //   console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
  // });
  
  
  // createAccount(seed)
  // create
  
  // User has an "account" on the system, a multisig wallet
  // They can request to start a game with 50% of the funds in the wallet
  // When funds are "in play", other modules must be restricted from using those funds as collateral for other games
  //
  // createMultisigWallet
  // 
  // useMultisigWallet
  // hasMultisigWallet
  // isFunded
  // sendToPlayer
  // 
  

}

module.exports = WestendCrypto;

