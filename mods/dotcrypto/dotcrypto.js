const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring }  = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider }  = require('@polkadot/api');
const { randomBytes }   = require('crypto');
class DOTCrypto extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "DOTCrypto";
    this.description = "Payment Gateway for DOT cryptocurrency in Saito Application";
    this.categories = "Crptocurrency";
    this.ticker = "DOT";
    this.optionsStorage = {};
    this.app = app;
    this._api = null; // treat as private, please use getApi to access
    this.mods = [];
  }
  
  requestInterface(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        // The ticker of the cryptocurrency
        ticker: this.ticker,
        // get balance of given address.
        //  getBalance(address)
        getBalance: this.getBal.bind(this),
        // transfer to another addresses
        transfer: null,
        // sign and send a raw transaction
        signAndSend: null,
        subscribe: null,
        getPubkey: this.getPubkey.bind(this),
        getKeyring: null,
        buildRawTx: null,
      }
    }
    return null;
  }
  async initializeApi() { 
    console.log("initializeApi");
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    //const wsProvider = new WsProvider('wss://localhost:8888');
    //const wsProvider = new WsProvider('ws://localhost:8887');
    //const wsProvider = new WsProvider('ws://localhost');
    //const wsProvider = new WsProvider('ws://138.197.202.211');
    
    console.log("made provider");
    // returns an API instance when connected, decorated and ready-to use...
    //const api = await ApiPromise.create({ provider: wsProvider });  
    //this._api = await ApiPromise.create({ provider: wsProvider });  
    this._api = new ApiPromise({ provider: wsProvider });
    console.log("made api");
    await this._api.isReady;
    console.log("api ready...");
    
    let ADDR = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';
    ADDR = "13MfMQeGbBb73HAAGRctG8GomWg3mXumP2vnrrRqxBBbqiQH";
    console.log("isReady");
  }
  async getApi() {
    await this._api.isReady;
    return this._api;
  }
  async getPubkey() {
    return this.optionsStorage.keypair.address;
  }
  async getBal(){
    console.log("getbalance");
    try {
      //const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      //const wsProvider = new WsProvider('wss://localhost:8888');
      //const wsProvider = new WsProvider('ws://localhost:8887');
      
      //const wsProvider = new WsProvider('ws://138.197.202.211');
      
      // returns an API instance when connected, decorated and ready-to use...
      //const wsProvider = new WsProvider('ws://localhost');
      // const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      // console.log("made provider");
      // const api = await ApiPromise.create({ provider: wsProvider });  
      // //this._api = await ApiPromise.create({ provider: wsProvider });   
      // console.log("made api");
      // await api.isReady;
      // console.log("api read");
      // const { nonce, data: balance } = await api.query.system.account(this.optionsStorage.keypair.address);
      // console.log("got balance");
      let api = await this.getApi();
      const { nonce, data: balance } = await api.query.system.account(this.optionsStorage.keypair.address);
      
      return balance.free;  
    } catch(error) {
      console.log("catch?????");
      console.log(error);
    }
    
    
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
    console.log("****************** DOTCrypto initialize ******************");
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');

    this._api = new ApiPromise({ provider: wsProvider });
    
    this.load();
    
    if(!this.optionsStorage.keypair) {
      // sr25519 only has a WASM interface
      const keyring = new Keyring({ type: 'ed25519', ss58Format: 2 });
      this.optionsStorage.keypair = keyring.addFromSeed(randomBytes(32), { name: 'polkadot pair' }, 'ed25519');
      this.save();
    }
    
    super.initialize(app);
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

module.exports = DOTCrypto;

