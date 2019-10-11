var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate.js');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Wallet extends ModTemplate {

  constructor(app) {
    super(app);

    this.app             = app;
    this.name            = "Wallet";
    this.handlesEmail    = 1;

    this.emailAppName    = "Saito Wallet";
    return this;
  }

  onChainReorganization(bid, bsh, lc) {

  }


  onConfirmation(blk, tx, conf, app) {

    if (conf == 0) {
    }

  }



  shouldAffixCallbackToModule(module_name, tx=null) {
    if (tx != null) {
      let mypublickey = this.app.wallet.returnPublicKey();
      if (tx.transaction.from[0].add == mypublickey) { return 1; }
      if (tx.returnSlipsTo(mypublickey).length > 0) { return 1; }
    }
    return 0;
  }

}


module.exports = Wallet;

