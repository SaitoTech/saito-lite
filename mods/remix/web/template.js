const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


class RemixTemplate extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "RemixTemplate";

  }





  onConfirmation(blk, tx, conf, app) {

    if (conf == 0) {

      //
      // if transaction is for me
      //
      if (tx.isTo(app.wallet.returnPublicKey())) {

        let txmsg = tx.returnMessage();

        //
        // do something !
        //
	conole.log("OUR DATA: " + txmsg);

	//
	// why not send ourselves an email
	//

      }
    }
  }

}

module.exports = Remix;
