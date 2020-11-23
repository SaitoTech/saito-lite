const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring }  = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider }  = require('@polkadot/api');
const { randomBytes }   = require('crypto');
class SaitoCrypto extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "SaitoCrypto";
    this.description = "Payment Gateway for DOT cryptocurrency in Saito Application";
    this.categories = "Crptocurrency";
    this.ticker = "SAITO";
    this.mods = [];
  }
  
  requestInterface(type = "") {
    if (type == "is_cryptocurrency") {
      return {
        // The ticker of the cryptocurrency
        ticker: this.ticker,
        // get balance of given address.
        //  getBalance(address)
        getBalance: async() => { return 0; },
        // transfer to another addresses
        transfer: null,
        // sign and send a raw transaction
        signAndSend: null,
        subscribe: null,
        getPubkey: async() => { return "asdf"; },
        getKeyring: null,
        buildRawTx: null,
      }
    }
    return null;
  }
  initialize(app) {
    super.initialize(app);
  }

    

}

module.exports = SaitoCrypto;

