const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


class RemixTemplate extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "RemixTemplate";

  ***REMOVED***





  onConfirmation(blk, tx, conf, app) {

    if (conf == 0) {

      //
      // if transaction is for me
      //
      if (tx.isTo(app.wallet.returnPublicKey())) {

***REMOVED***

***REMOVED***
***REMOVED*** do something !
***REMOVED***
	conole.log("OUR DATA: " + txmsg);

	//
	// why not send ourselves an email
	//

  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Remix;
