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
class WestieCryptoServer extends ModTemplate {
  constructor(app) {
    super(app);
    this.ticker = "WESTIER";
    this.name = 'WestieCryptoServer';
    this.description = 'Polkadot at Saito Endpoint';
    this.categories = "Cryptocurrency";
    this.app = app;
    this.endpoint = "ws://178.128.181.212:9932";
    this._api = null; // treat as private, please use getApi to access
    this.optionsStorage = {};
    this.keypair = null;
    this.keyring = null;
    this.dotcryptomod = null;
  }
  initialize(app) {
    this.load();
    if (!app.BROWSER) {
      const wsProvider = new WsProvider(this.endpoint);
      this._api = new ApiPromise({ provider: wsProvider });
      this._api.on('connected', (stream) => {
        console.log(this.description + ' Polkadot Socket Provider connected');
      });
      this._api.on('disconnected', (stream) => {
        console.log(this.description + ' Polkadot Socket Provider disconnected');
      });
      this._api.on('ready', (stream) => {
        console.log(this.description + ' Polkadot Socket Provider ready');
      });
      this._api.on('error', (stream) => {
        console.log(this.description + ' Polkadot Socket Provider error');
      });
    }
    
    
  }
  respondTo(type = "") {
    // if (type == "is_saito_infrastructure") {
    //   return {
    //     openPort: this.openPort.bind(this),
    //   }
    // }
    return null;
  }
  async onConfirmation(blk, tx, conf, app) {
    if (conf == 0 && !app.BROWSER) {
      console.log("WestieCryptoServer onConfirmation");
      console.log(tx);
      let authorizationTime = Date.now() + 24*60*1000;
      this.optionsStorage[tx.transaction.from[0].add] = authorizationTime;
      this.save();
    }
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
    return this._api;
  }
  webServer(app, expressapp, express) {

    expressapp.get("/" + this.name + "/getbalance/:address/:sig", async (req, res) => {
      // TODO: Authorize the signature!
      if (req.params.address == null) {
        //TODO: send a 403 or w/e
        return;
      }
      if (req.params.sig == null) {
        //TODO: send a 403 or w/e
        return;
      }
      let api = await this.getApi();
      const { nonce, data: balance } = await api.query.system.account(req.params.address);
      console.log("GET /" + this.name + "/getbalance/:address/:sig");
      console.log(req.params.address);
      console.log(balance);
      console.log(balance.free);
      res.status(200);
      res.write(JSON.stringify({balance: balance.free }));
      res.end();
    });
    super.webServer(app, expressapp, express);
  }
}
module.exports = WestieCryptoServer;