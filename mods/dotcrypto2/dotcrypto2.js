const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

class DOTCrypto2 extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'DOT', 'wss://rpc.polkadot.io');
    this.name = 'DOTCrypto2';
    this.description = 'Polkadot second Wallet for testing';
  }
}

module.exports = DOTCrypto2;
