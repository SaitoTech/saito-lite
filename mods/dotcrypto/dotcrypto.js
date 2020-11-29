const SubstrateBasedCrypto = require("./lib/SubstrateBasedCrypto");

const parityArchiveNodeEndpoint = 'wss://rpc.polkadot.io';
const saitoEndpoint = 'ws://206.189.222.218:9932';
const mysteryEndpointFoundOnPolkaStatsIO = 'wss://polkastats.io/api/v3';

class DOTCrypto extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'DOT', saitoEndpoint, "Polkadot's Existential Deposit is 1 DOT, be sure not to send less than 1 DOT or leave less than 1 DOT in your wallet.");
    this.name = 'DOTCrypto';
    this.description = 'Polkadot at Saito Endpoint';
  }
}

module.exports = DOTCrypto;
