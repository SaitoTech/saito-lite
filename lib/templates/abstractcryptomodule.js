const ModTemplate = require('./modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');

// A Module to support KSM, DOT, or any other Substrate-based crypto
// TODO subscribe to and fire balance_change events in the eventEmitter
// TODO support of setting confirmations
// TODO esitmate fees
class AbstractCryptoModule extends ModTemplate {

  constructor(app, ticker) {
    super(app);
    
    if (new.target === AbstractCryptoModule) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
    // TODO: make sure each method has the correct number of arguments via method.length()
    if (typeof this.getBalance != "function") {
      throw new TypeError("Must override getBalance");
    }
    if (typeof this.transfer != "function") {
      throw new TypeError("Must override transfer");
    }
    if (typeof this.getAddress != "function") {
      throw new TypeError("Must override getAddress");
    }
    // if (typeof this.estimateFee != "function") {
    //   throw new TypeError("Must override getBalance");
    // }
    // if (typeof this.setConfirmationThreshold != "function") {
    //   throw new TypeError("Must override getBalance");
    // }
    this.app = app;
    this.ticker = ticker;
    this.categories = "Cryptocurrency";
  }
  installModule(app) {
    this.app.wallet.setPreferredCrypto(this.name);
  }
  initialize(app) {
    
  }
}
module.exports = AbstractCryptoModule;
