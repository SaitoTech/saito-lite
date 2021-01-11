const SubstrateBasedCrypto = require("../dotcrypto/lib/SubstrateBasedCrypto");

const parityArchiveNodeEndpoint = 'wss://kusama-rpc.polkadot.io/';
const web3FoundationArchiveNodeEndpoint = 'wss://cc3-5.kusama.network/';
const saitoEndpoint = 'ws://206.189.221.128:9932';

class Kusama extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'KSM', saitoEndpoint, "Kusama is a Polkadot TESTNET supported by the Saito network. Kusama's Existential Deposit is 0.01 KSM, be sure not to send less than 1 DOT or leave less than 0.01 KSM in your wallet.");
    this.name = 'KSMCrypto';
    this.description = 'Kusama';
    this.categories = "Cryptocurrency";
  }
}

module.exports = Kusama;

