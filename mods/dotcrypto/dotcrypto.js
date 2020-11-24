const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
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
    this.keypair = null;
    this.keyring = null;
  }
  
  requestInterface(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        ticker: this.ticker,
        getBalance: this.getBal.bind(this),
        transfer: this.transfer.bind(this),
        getAddress: this.getAddress.bind(this),
        subscribe: null,
        getKeyring: null,
        buildRawTx: null,
        //https://polkadot.js.org/docs/api/cookbook/tx/
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
    // give some semantics to the polkadot magic numbers
    let formats = {"polkadot": 0, "kusama": 2, "substrateRaw": 42 };
    return encodeAddress(decodeAddress(address), formats[format]);
  }
  getAddress() {
    return this.keypair.address;
    //return this.getFormattedAddress(this.keypair.address, "polkadot");
  }
  async getBal(){
    let api = await this.getApi();
    //5ERZ1oCunsuRueffZBEfsScu169GReLHb84yaETzMQZcsjko
    const { nonce, data: balance } = await api.query.system.account(this.keypair.publicKey);
    return balance.free;  
  }
  async transfer(howMuch, to) {
    console.log("transfer");
    // console.log(howMuch);
    // console.log(to);
    console.log(this.keypair.address);
    console.log(this.keyring.getPair(this.keypair.address));
    console.log(this.keyring.getPairs()[0]);
    let api = await this.getApi();
    const tx = await api.tx.balances.transfer(to, howMuch)
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
    console.log("****************** DOTCrypto initialize ******************");
    if(app.BROWSER) {
      super.initialize(app);
      const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      this._api = new ApiPromise({ provider: wsProvider });
      this.load();
      // sr25519 only has a WASM interface
      this.keyring = new Keyring({ type: 'ed25519'});
      this.keyring.setSS58Format(0);
      if(!this.optionsStorage.keypair) {
        let keypair = this.keyring.addFromSeed(randomBytes(32), { name: 'polkadot pair' }, 'ed25519');
        //let keypair = this.keyring.addFromMnemonic("calm leopard uncover will muscle match parrot finish hair drum total erupt", { name: 'polkadot pair' }, 'ed25519');
        //let keypair = this.keyring.addFromUri("calm leopard uncover will muscle match parrot finish hair drum total erupt", { name: 'first pair' }, 'sr25519');
        this.optionsStorage.keypair = keypair.toJson();
        this.save();
      }
      this.keypair = this.keyring.addFromJson(this.optionsStorage.keypair);  
      this.keypair.decodePkcs8()
      console.log(this.keypair);
      //this.keypair = this.keyring.addPair(this.optionsStorage.keypair);
      //
      // Need to go through the keyring API so that setSS58Format will work 
      // and the keypair will have all the functions it needs like signing.
      // if(this.optionsStorage.keypair.encoded) {
      //   this.keypair = this.keyring.addFromJson(this.optionsStorage.keypair);  
      // } else {
      //   this.keypair = this.keyring.addPair(this.optionsStorage.keypair);
      // }
      
      // if(this.optionsStorage.keypair5){
      //   this.keypair5 = this.keyring.addFromJson(this.optionsStorage.keypair5);  
      // }
      
      // if(this.optionsStorage.keypair3){
      //   this.keypair3 = this.keyring.addFromJson(this.optionsStorage.keypair3);  
      //   console.log(this.keypair2.isLocked);
      // }
      // if(this.optionsStorage.keypair2){
      //   this.keypair4 = this.keyring.addFromJson(this.optionsStorage.keypair4);  
      //   console.log(this.keypair2.isLocked);
      // }
      // console.log(this.keyring.getPairs()[0].isLocked);
      // console.log(this.keyring.getPairs()[1].isLocked);
      //console.log(this.keyring.getPair(""));
      // console.log("adsf");
      // console.log(this.optionsStorage.keypair.address);
      // console.log(this.keypair.address);
      // this.keyring.setSS58Format(2);
      // console.log(this.optionsStorage.keypair.address);
      // console.log(this.keypair.address);
      // this.keyring.setSS58Format(42);
      // console.log(this.optionsStorage.keypair.address);
      // console.log(this.keypair.address);
      
      // this.optionsStorage.keypair = {"address":"5ERZ1oCunsuRueffZBEfsScu169GReLHb84yaETzMQZcsjko","encoded":"BV/ziyal+U+c9/rxfq4ZHqZPshwil3JVWFlSb38s+zwAgAAAAQAAAAgAAABV2laOigO/8YOPxpalfZ9OAUAfhij2gde/ZfteoH2VNUrvn3Ud21ze9sESBA0v/zN3A4L6RfBKKKgKzGQmg9jtXirPB+xxM+8vPEmTGqZzSW7b0kQpj9/zG/N78h/nbFKRthLryCumERRzviWCx8IM5HMhMX9E/OXrl5gTs6idOZndWUulFKzpkzYjt94Hd/eLdQ0qp8sP5rZ1dxM+","encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"meta":{"genesisHash":"0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3","name":"saito","whenCreated":1606092444131}}
      // this.save();
    
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

module.exports = DOTCrypto;

