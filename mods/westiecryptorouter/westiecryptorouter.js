const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');

// A Module to support KSM, DOT, or any other Substrate-based crypto
// TODO subscribe to and fire balance_change events in the eventEmitter
// TODO support of setting confirmations
// TODO esitmate fees
class WestieCryptoRouter extends ModTemplate {
super(app, 'WESTIE', 'ws://178.128.181.212:9932');
  constructor(app) {
    super(app);
    this.ticker = "WESTIER";
    this.name = 'WestieCryptoRouter';
    this.description = 'Polkadot at Saito Endpoint';
    this.categories = "Cryptocurrency";
    this.app = app;
    this.endpoint = "ws://178.128.181.212:9932";
    this._api = null; // treat as private, please use getApi to access
    this.optionsStorage = {};
    this.dotcryptomod = null;
  }
  initialize(app) {
    this.dotcryptomod = app.modules.returnModule("DOTCrypto");
    console.log(this.dotcryptomod);
    try {
      this.dotCryptoRespondTo = this.dotcryptomod.respondTo("is_cryptocurrency");
    } catch(err) {
      console.log("Perhaps you need to install the DOTCrypto module!!")
      console.log(err);
      throw err;
    }
    if (app.BROWSER) {
      if (app.wallet.returnBalance() > 0 || true) {
        // TODO:
        // - Dont send 0.0 
        // - Send the transaction/authorization request to the node that's actually running DOTCryptoRouter
        let newtx = app.wallet.createUnsignedTransaction(mySaitoAddress, 0.0, 0.0);
        // Send a transaction to this module for authorization
        newtx.msg.module = this.name;
      }  
    }
    // this.dotCryptoRespondTo.eventEmitter.on("balance_change", (balance) => {
    //   this.eventEmitter.emit("balance_change", balance);
    // });
  }
  respondTo(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        name: this.name,
        description: this.description,
        info: this.info,
        ticker: this.ticker,
        getBalance: this.getBal.bind(this),
        transfer: this.transfer.bind(this),
        getAddress: this.getAddress.bind(this),
        eventEmitter: this.eventEmitter,
        estimateFee: null,
        setConfirmationThreshold: null, // TODO: Implement me!
      }
    }
    if (type == "is_saito_infrastructure") {
      return {
        openPort: this.openPort.bind(this),
      }
    }
    return null;
  }
  async onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {
      
      console.log("DotCryptoRouter onConfirmation");
      console.log(tx);
      let authorizationTime = Date.now() + 24*60*1000;
      this.optionsStorage[tx.transaction.from[0].add] = authorizationTime;
      this.save();
    }
  }
  
  openPort() {
    // let newtx = app.wallet.returnBalance() > 0 ?
    //     app.wallet.createUnsignedTransactionWithDefaultFee(mySaitoAddress, 0.0) :
    //     app.wallet.createUnsignedTransaction(mySaitoAddress, 0.0, 0.0);

    //newtx.msg.module = "CryptoRouter";
    //app.network.propagateTransaction(newtx);
  }
  getAddress() {
    
  }
  async getBal(){
    
  }
  async transfer(howMuch, to) {
    
  }
  
  save() {
    let moduleOptions = this.app.storage.getModuleOptionsByName(this.name);
    moduleOptions.storage = this.optionsStorage;
    this.app.storage.saveOptions();
  }
  load() {
    // TODO: replace this with an actual database
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
  
  async getApi() {
    await this._api.isReady;
    
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
    
    return this._api;
    
  }
  webServer(app, expressapp, express) {
    expressapp.get(this.name + '/getbalance', function (req, res) {
      // app.modules.getRespondTos("send-reward").forEach((itnerface, i) => {
      //   itnerface.makePayout(req.query.pubkey, 10000);
      // 
      // });
      async getBal(){
        let api = await this.getApi();
        const { nonce, data: balance } = await api.query.system.account(this.keypair.publicKey);
        return balance.free;  
      }
      
      res.status(200);
      res.write(JSON.stringify({balance: this.dotCryptoRespondTo.getBalance() }));
      res.end();
    });
    expressapp.get("/getserverkey", function(req, res){
      res.type('application/json');
      //res.setHeader('Content-type', 'text/html');
      res.status(200);
      res.write(JSON.stringify({pubkey: app.wallet.returnPublicKey()}));
      res.end();
    });
    super.webServer(app, expressapp, express);
  }
}
module.exports = WestieCryptoRouter;