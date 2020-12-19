const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { u8aToHex } = require('@polkadot/util');

const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');

// A Module to support KSM, DOT, or any other Substrate-based crypto
// TODO subscribe to and fire balance_change events in the eventEmitter
// TODO support of setting confirmations
// TODO esitmate fees
class WestieCryptoClient extends ModTemplate {
  constructor(app) {
    super(app);
    this.ticker = "WESTIER";
    this.name = 'WestieCryptoClient';
    this.serverName = "WestieCryptoServer";
    this.description = 'Polkadot through Saito Endpoint';
    this.categories = "Cryptocurrency";
    this.app = app;
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
      if (app.wallet.returnBalance() > 0 || true) {
        // TODO:
        // - Dont send 0.0 
        // - Send the transaction/authorization request to the node that's actually running DOTCryptoRouter
        let mySaitoAddress = app.wallet.returnPublicKey();
        let newtx = app.wallet.createUnsignedTransaction(mySaitoAddress, 0.0, 0.0);
        // Send a transaction to this module for authorization
        newtx.msg.module = this.serverName;
        //newtx.msg.
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
  async transfer(amount, to) {
    console.log("Transfer...");
    const buildtxResponse = await fetch("/" + this.serverName + "/buildtx/" + this.getAddress() + "/" + to + "/" + amount);
    let buildtxResponseObj = await buildtxResponse.json();
    console.log("buildtxResponse");
    console.log(buildtxResponse);
    console.log(buildtxResponseObj);
    // console.log(buildtxResponseObj.signable);
    // console.log(buildtxResponseObj.extrinsicPayload);
    console.log(buildtxResponseObj.hexPayload);
    let api = new ApiPromise({ provider: new WsProvider("ws://1.1.1.1") });
    // re-create the payload from the hex (we are assuming this is "somewhere else now")
    // TODO: send payload.version from the server....
    const payload = api.createType('ExtrinsicPayload', buildtxResponseObj.hexPayload, { version: 4 });
    // sign the actual payload
    const signature = this.keypair.sign(payload.toU8a(true));
    // convert signature back to hex to transfer back to the original
    const sigHex = u8aToHex(signature);
    // we also want the address of the signer to put inside process 1
    console.log("sigHex");
    console.log(sigHex);
    // const { signature } = buildtxResponseObj.extrinsicPayload.sign(this.keypair);
    const sendResponse = await fetch("/" + this.serverName + "/send/" + this.getAddress() + "/" + sigHex);
    console.log("sendResponse");
    console.log(sendResponse);
    // const signedTx = await buildtxResponseObj.signAsync(this.keypair);
    console.log("signedTx");
    console.log(signedTx);
    
    
    
    
    // let response = await fetch("/" + this.serverName + "/transfer");
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