const SubstrateBasedCrypto = require("../../lib/templates/substratebasedcrypto");

const parityArchiveNodeEndpoint = 'wss://kusama-rpc.polkadot.io/';
const web3FoundationArchiveNodeEndpoint = 'wss://cc3-5.kusama.network/';
const saitoEndpoint = 'ws://206.189.221.128:9932';
const saitoEndpointSecure = 'wss://saito.io:9931/kusamawss/';

class Kusama extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'KSM', saitoEndpointSecure, "Kusama is a Polkadot TESTNET supported by the Saito network. Kusama's Existential Deposit is 0.01 KSM, be sure not to send less than 1 DOT or leave less than 0.01 KSM in your wallet.");
    this.name = 'Kusama';
    this.description = 'Kusama Polkadot testnet for Saito. Installing this module will make Kusama your default in-browser cryptocurrency.';
    this.categories = "Cryptocurrency";
  }

  installModule(app) {
    app.wallet.setPreferredCrypto("KSM");
  }
}

module.exports = Kusama;

