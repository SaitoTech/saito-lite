const SubstrateBasedCrypto = require("./lib/SubstrateBasedCrypto");

class Westend extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'WESTIE', 'ws://178.128.181.212:9932');
    this.name = 'Westend';
    this.description = 'Westend Polkadot Testnet application support for Saito. Installing this module will make Westnet your default in-browser cryptocurrency.';
    this.categories = "Cryptocurrency";
  }
}

module.exports = Westend;
