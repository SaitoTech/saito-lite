const SubstrateBasedCrypto = require("./lib/SubstrateBasedCrypto");

let kaoliniteTestServerEndpoint = "ws://138.197.202.211:9932";
let saitoWestendEndpoint = "ws://178.128.181.212:9932";
let saitoWestendEndpointSecure = "wss://saito.io:9931/argylewss/";

class Westend extends SubstrateBasedCrypto {
  constructor(app) {
    //super(app, 'WESTIE', kaoliniteTestServerEndpoint);
    super(app, 'WESTIE', saitoWestendEndpoint);
    this.name = 'Westend';
    this.description = 'Westend Polkadot Testnet application support for Saito. Installing this module will make Westnet your default in-browser cryptocurrency.';
    this.categories = "Cryptocurrency";
  }

  installModule(app) {
    app.wallet.setPreferredCrypto("WESTIE");
  }



}

module.exports = Westend;
