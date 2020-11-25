const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

class KSMCrypto extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'KSM', 'wss://rpc.polkadot.io');
    this.name = 'KSMCrypto';
    this.description = 'Kusama';
  }
}

module.exports = KSMCrypto;
