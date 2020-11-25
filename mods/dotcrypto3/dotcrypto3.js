const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

const parityArchiveNodeEndpoint = 'wss://rpc.polkadot.io';
const saitoEndpoint = 'ws://206.189.222.218:9932';
const mysteryPolkaStatsIOEndpoint = 'wss://polkastats.io/api/v3';

class DOTCrypto3 extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'DOT', parityArchiveNodeEndpoint, "Polkadot's Existential Deposit is 1 DOT, be sure not to send less than 1 DOT or leave less than 1 DOT in your wallet.");
    this.name = 'DOTCrypto3';
    this.description = 'Polkadot at Mystery Polkastats Endpoint';
  }
}

module.exports = DOTCrypto3;

