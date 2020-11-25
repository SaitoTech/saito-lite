const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

class DOTCrypto extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'DOT', 'wss://rpc.polkadot.io');
    this.name = 'DOTCrypto';
    this.description = 'Polkadot';
  }
}

module.exports = DOTCrypto;

