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
    // TODO: pendingtx only supports on user at a time!! We need to have a map
    // of these for each user!!
    this.pendingTx = null;
  }
  initialize(app) {
    this.load();
    if (!app.BROWSER) {
      const wsProvider = new WsProvider(this.endpoint);
      this._api = new ApiPromise({ provider: wsProvider });
      this._api.on('connected', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider connected');
      });
      this._api.on('disconnected', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider disconnected');
      });
      this._api.on('ready', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider ready');
      });
      this._api.on('error', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider error');
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
    super.webServer(app, expressapp, express);
    expressapp.get("/" + this.name + "/getbalance/:address/:sig", async (req, res) => {
      console.log("GET /" + this.name + "/getbalance/:address/:sig");
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
      res.status(200);
      res.write(JSON.stringify({balance: balance.free }));
      res.end();
    });
    expressapp.get("/" + this.name + "/buildtx/:from/:to/:amount", async (req, res) => {
      console.log("GET /" + this.name + "/buildtx");
      console.log(req.params);
      console.log(req.params.from);
      let api = await this.getApi();
      this.pendingTx = await api.tx.balances.transfer(req.params.to, req.params.howMuch);
      //console.log(this.pendingTx);
      const { nonce, data: balance } = await api.query.system.account(req.params.from);
      //const nonce = await api.query.system.accountNonce('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
      this.pendingSignable = api.createType('SignerPayload', {
        method: this.pendingTx,
        nonce,
        genesisHash: api.genesisHash,
        blockHash: api.genesisHash,
        runtimeVersion: api.runtimeVersion,
        version: api.extrinsicVersion
      });
      this.pendingExtrinsicPayload = api.createType('ExtrinsicPayload', this.pendingSignable.toPayload(), { version: api.extrinsicVersion });
      const hexPayload = this.pendingExtrinsicPayload.toHex();
      res.status(200);
      res.write(JSON.stringify({hexPayload: hexPayload}));
      res.end();
    });
    
    expressapp.get("/" + this.name + "/send/:from/:signature", async (req, res) => {
      console.log("GET /" + this.name + "/send");
      console.log(req.params.signature);
      try {
        // const address = this.keypair.address;
        this.pendingTx.addSignature(req.params.from, req.params.signature, this.pendingExtrinsicPayload);
        // // send the transaction now that is is signed
        const hash = await this.pendingTx.send();
        console.log("result");
        console.log(hash);
        res.status(200);
        res.write(JSON.stringify({result: result }));
        res.end();
      } catch (error) {
        console.error(error);
      }
    });
  }
}
module.exports = WestieCryptoServer;