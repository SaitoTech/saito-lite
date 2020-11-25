const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

class WestendCrypto extends SubstrateBasedCrypto {
  constructor(app) {
    // At the moment the port isn't open, if you want to use this module
    // open an ssh tunnel.
    // ssh -L 9933:localhost:9934 root@178.128.181.212
    super(app, 'DOT', 'ws://178.128.181.212:9932');
    this.name = 'WestendCrypto';
    this.description = 'Polkadot Testnet Westend';
  }
}

module.exports = WestendCrypto;
