const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

//
// this module pings the Rust client at startup. It is a development
// module to assist with upgrading Saito-Lite to support Rust
// Consensus
//
class Rust extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "EarlyBirds";

    this.description = "VIP Token Registration and Early Bird Bonuses";
    this.categories = "Utilities Communications";
    return this;
  }

  initialize(app) {
    app.networkapi.initialize();
  }

}
module.exports = Rust;

