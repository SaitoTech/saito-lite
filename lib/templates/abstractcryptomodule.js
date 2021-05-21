const ModTemplate = require('./modtemplate');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');

/**
* A Module to support KSM, DOT, or other cryptos.
* @extends ModTemplate
* @example
* class DogeCrypto extends AbstractCryptoModule {
*   returnAddress() { ... }
*   async returnBalance(){ ... }
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

    this.previously_selected = 0;

    if (new.target === AbstractCryptoModule) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
    // TODO: make sure each method has the correct number of arguments via method.length()
    if (typeof this.returnBalance != "function") {
      throw new TypeError("Must override returnBalance");
    }
    if (typeof this.transfer != "function") {
      throw new TypeError("Must override transfer");
    }
    if (typeof this.returnAddress != "function") {
      throw new TypeError("Must override returnAddress");
    }
    if (typeof this.hasPayment != "function") {
      throw new TypeError("Must override hasPayment");
    }
    // if (typeof this.estimateFee != "function") {
    //   throw new TypeError("Must override returnBalance");
    // }
    // if (typeof this.setConfirmationThreshold != "function") {
    //   throw new TypeError("Must override returnBalance");
    // }
    this.app = app;
    this.ticker = ticker;
    this.categories = "Cryptocurrency";
    this.eventEmitter = new EventEmitter();
    this.isInitialized = false;
  }
  initialize(app) {
    this.isInitialized = true;
    this.eventEmitter.emit('initialized');
  }
  onIsInitialized() {
    return new Promise((resolve, reject) => {
      if(this.isInitialized) {
        resolve();
      }
      this.eventEmitter.on('initialized', () => {
        resolve();
      });
    });
  }
  async handlePeerRequest(app, req, peer, callback) {
    if (req.request == null) { return; }
    if (req.data == null) { return; }
    if(req.request === "cryptoAddressRequest" && req.data.recipient === this.app.wallet.returnPublicKey() && req.data.ticker === this.ticker) {
      callback({
        address: this.returnAddress()
      });
    }
  }
}


/**
 * Abstract method which should get balance from underlying crypto endpoint
 * @abstract
 * @return {Number}
 */
AbstractCryptoModule.prototype.renderModalSelectCrypto = function() {
  return null;
}
AbstractCryptoModule.prototype.attachEventsModalSelectCrypto = function() {
  return null;
}

/**
 * Abstract method which should get balance from underlying crypto endpoint
 * @abstract
 * @return {Number}
 */
AbstractCryptoModule.prototype.returnBalance = function() {
  throw new Error('returnBalance must be implemented by subclass!');
};

/**
 * Abstract method which should transfer tokens via the crypto endpoint
 * @abstract
 * @param {Number} howMuch - How much of the token to transfer
 * @param {String} to - Pubkey/address to send to
 * @abstract
 * @return {Number}
 */
AbstractCryptoModule.prototype.transfer = function() {
  throw new Error('transfer must be implemented by subclass!');
};

/**
 * Abstract method which should get pubkey/address
 * @abstract
 * @return {String} Pubkey/address
 */
AbstractCryptoModule.prototype.returnAddress = function() {
  throw new Error('returnAddress must be implemented by subclass!');
};

/**
 * Searches for a payment which matches the criteria specified in the parameters.
 * @abstract
 * @param {Number} howMuch - How much of the token was transferred
 * @param {String} from - Pubkey/address the transasction was sent from
 * @param {String} to - Pubkey/address the transasction was sent to
 * @param {timestamp} to - timestamp after which the transaction was sent
 * @return {Boolean}
 */
AbstractCryptoModule.prototype.hasPayment = function() {
  throw new Error('hasPayment must be implemented by subclass!');
};

module.exports = AbstractCryptoModule;
