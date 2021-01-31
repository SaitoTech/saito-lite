const ModTemplate = require('./modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');


// TODO subscribe to and fire balance_change events in the eventEmitter
// TODO support of setting confirmations
// TODO esitmate fees
/**
* A Module to support KSM, DOT, or any other Substrate-based crypto.
* @extends ModTemplate
* @example
* class DogeCrypto extends AbstractCryptoModule {
*   getAddress() { ... }
*   async getBalance(){ ... }
*   async transfer(howMuch, to) { ... }
*   ...
* }
*/
class AbstractCryptoModule extends ModTemplate {
  /**
   * Initialize CryptoModule and check that subclass overrides abstract functions
   * @param {Object} app - Saito Application Context
   * @param {String} ticker - Ticker symbol of underlying Cryptocurrency
   * @example 
   * constructor(app, ticker, ...) {
   *   super(app, ticker);
   *   ...
   * }
   */
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
}

/**
 * Abstract method which should get balance from underlying crypto endpoint
 * @abstract
 * @return {Number}
 */
AbstractCryptoModule.prototype.getBalance = function() {
  throw new Error('getBalance must be implemented by subclass!');
};

/**
 * Abstract method which should transfer tokens via the crypto endpoint
 * @param {Number} howMuch - How much of the token to transfer
 * @param {String} to - Pubkey/address to send to
 * @abstract
 * @return {Number}
 */
AbstractCryptoModule.prototype.transfer = function() {
  throw new Error('getBalance must be implemented by subclass!');
};

/**
 * Abstract method which should get pubkey/address
 * @abstract
 * @return {String} Pubkey/address
 */
AbstractCryptoModule.prototype.getAddress = function() {
  throw new Error('getBalance must be implemented by subclass!');
};

module.exports = AbstractCryptoModule;
