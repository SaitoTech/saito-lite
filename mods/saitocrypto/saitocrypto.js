const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring }  = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider }  = require('@polkadot/api');
const { randomBytes }   = require('crypto');
const EventEmitter = require('events');

// Stub module for future integration if we want Saito to do is_cryptocurrency
class SaitoCrypto extends ModTemplate {
  constructor(app) {

    super(app);
    this.name = "SaitoCrypto";
    this.description = "Saito";
    this.categories = "Cryptocurrency";
    this.ticker = "SAITO";
    this.mods = [];
    this.app = app;
    this.eventEmitter = new EventEmitter();
  }
  
  requestInterface(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        name: this.name,
        description: this.description,
        ticker: this.ticker,
        getBalance: async() => {
          return this.app.wallet.returnBalance();
        },
        transfer: async(howMuch, to) => {
          console.log("implement me!!");
        },
        getAddress: async() => {
          return this.app.wallet.returnPublicKey();
        },
        eventEmitter: this.eventEmitter,
        //https://polkadot.js.org/docs/api/cookbook/tx/
        estimateFee: null,
      }
    }
    return null;
  }
  initialize(app) {
    super.initialize(app);
  }
}

module.exports = SaitoCrypto;

