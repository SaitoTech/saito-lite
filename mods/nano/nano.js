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
  // User has an "account" on the system, a multisig wallet
  // They can request to start a game with 50% of the funds in the wallet
  // When funds are "in play", other modules must be restricted from using those funds as collateral for other games
  //
  // createMultisigWallet
  // 
  // useMultisigWallet
  // hasMultisigWallet
  // isFunded
  // sendToPlayer
  // 
  

}

module.exports = Nano;

