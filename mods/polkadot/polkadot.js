const SubstrateBasedCrypto = require("../../lib/templates/substratebasedcrypto");

const parityArchiveNodeEndpoint = 'wss://rpc.polkadot.io';
const saitoEndpoint = 'ws://206.189.222.218:9932';
const saitoEndpointSecure = 'wss://saito.io:9931/polkadotwss/'; // This routes through ssl to 206.189.222.218:9932
const mysteryEndpointFoundOnPolkaStatsIO = 'wss://polkastats.io/api/v3';
class Polkadot extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'DOT', saitoEndpointSecure, "Polkadot's Existential Deposit is 1 DOT, be sure not to send less than 1 DOT or leave less than 1 DOT in your wallet.");
    this.name = 'Polkadot';
    this.description = 'Polkadot application layer for in-browser Polkadot applications. Install this module to make Polkadot your default in-browser cryptocurrency';
    this.categories = "Cryptocurrency";
  }

  installModule(app) {
    app.wallet.setPreferredCrypto("DOT");
  }

}

module.exports = Polkadot;
