const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

class Nano extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Nano";
    this.description = "Payment Gateway for NANO cryptocurrency payments in Saito Application";
    this.categories = "Financial Cryptocurrency";

    this.mods = [];

  }

  respondTo(type = "") {
    if (type == "is_cryptocurrency") {
      let obj = {};
      obj.ticker = "NANO";
    }
    return null;
  }

}

module.exports = Nano;

