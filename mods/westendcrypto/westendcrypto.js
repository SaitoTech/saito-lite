const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

class WestendCrypto extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'WESTIE', 'ws://178.128.181.212:9932');
    this.name = 'WestendCrypto';
    this.description = 'Westend Polkadot Testnet';
  }
}

module.exports = WestendCrypto;
