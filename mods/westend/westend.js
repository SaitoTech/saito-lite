const SubstrateBasedCrypto = require("../../lib/templates/substratebasedcrypto");

let kaoliniteTestServerEndpoint = "ws://138.197.202.211:9932";
let saitoWestendEndpoint = "ws://178.128.181.212:9932";
let saitoWestendEndpointSecure = "wss://saito.io:9931/argylewss/";

class Westend extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'WND', saitoWestendEndpointSecure);
    this.name = 'Westend';
    this.description = 'Westend Polkadot Testnet application support for Saito. Installing this module will make Westnet your default in-browser cryptocurrency.';
    this.categories = "Cryptocurrency";
  }
}

module.exports = Westend;
