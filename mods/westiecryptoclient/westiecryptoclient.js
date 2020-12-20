const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { u8aToHex } = require('@polkadot/util');
const { TypeRegistry } = require('@polkadot/types');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');
//const { createSignedTx, createSigningPayload, methods } = require('@substrate/txwrapper')

class WestieCryptoClient extends ModTemplate {
  constructor(app) {
    super(app);
    this.ticker = "WESTIER";
    this.name = 'WestieCryptoClient';
    this.serverName = "WestieCryptoServer";
    this.description = 'Polkadot through Saito Endpoint';
    this.categories = "Cryptocurrency";
    this.app = app;
    this.endpoint = "ws://178.128.181.212:9932";
    this._api = null; // treat as private, please use getApi to access
    this.optionsStorage = {};
    this.keypair = null;
    this.keyring = null;
    this.eventEmitter = new EventEmitter();
    this.dotcryptomod = null;
  }
  initialize(app) {
    this.load();
    this.dotcryptomod = app.modules.returnModule("DOTCrypto");
    try {
      this.dotCryptoRespondTo = this.dotcryptomod.respondTo("is_cryptocurrency");
    } catch(err) {
      console.log("Perhaps you need to install the DOTCrypto module!!")
      console.log(err);
      throw err;
    }
    if (app.BROWSER) {
      const wsProvider = new WsProvider(this.endpoint);
      this._api = new ApiPromise({ provider: wsProvider });
      if (app.wallet.returnBalance() > 0 || true) {
        // TODO:
        // - Dont send 0.0 
        // - Send the transaction/authorization request to the node that's actually running DOTCryptoRouter
        let mySaitoAddress = app.wallet.returnPublicKey();
        let newtx = app.wallet.createUnsignedTransaction(mySaitoAddress, 0.0, 0.0);
        // Send a transaction to this module for authorization
        newtx.msg.module = this.serverName;
        app.network.propagateTransaction(newtx);
      }  
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
    return null;
  }
  async onConfirmation(blk, tx, conf, app) {
    if (conf == 0 && !app.BROWSER) {
      let authorizationTime = Date.now() + 24*60*1000;
      this.optionsStorage[tx.transaction.from[0].add] = authorizationTime;
      this.save();
    }
  }
  getAddress() {
    return this.keypair.address;
  }
  async getBal(){
    // TODO: Send a signature!
    let response = await fetch("/" + this.serverName + "/getbalance/" + this.getAddress() + "/dummiesig");
    let responseObj = await response.json();
    return responseObj.balance;
  }
  async getApi() {
    await this._api.isReady;
    return this._api;
  }
  async transfer(amount, to) {
    console.log("Transfer...");
    const buildtxResponse = await fetch("/" + this.serverName + "/buildtx/" + this.getAddress() + "/" + to + "/" + amount);
    let buildtxResponseObj = await buildtxResponse.json();
    //let api = new ApiPromise({ provider: new WsProvider("ws://1.1.1.1") });
    let api = await this.getApi();
    const payload = api.createType('ExtrinsicPayload', buildtxResponseObj.hexPayload, { version: 4 });
    const signature = this.keypair.sign(payload.toU8a(true));
    const sigHex = u8aToHex(signature);
    // const registry = new TypeRegistry();
    // const metadataRpc = await rpcToNode('state_getMetadata');
    // // const { signature } = buildtxResponseObj.extrinsicPayload.sign(this.keypair);
    // const signature2 = signWith(this.keypair, buildtxResponseObj.signingPayload, {
    //   metadataRpc,
    //   registry,
    // });
    const sendResponse = await fetch("/" + this.serverName + "/send/" + this.getAddress() + "/" + sigHex);
    console.log("sendResponse");
    console.log(sendResponse);
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
}
module.exports = WestieCryptoClient;