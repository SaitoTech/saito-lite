var saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');


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
  ***REMOVED***

  onChainReorganization(bid, bsh, lc) {***REMOVED***


  onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {***REMOVED***
  ***REMOVED***



  shouldAffixCallbackToModule(module_name, tx=null) {
    if (tx != null) {
      let mypublickey = this.app.wallet.returnPublicKey();
      if (tx.transaction.from[0].add == mypublickey) { return 1; ***REMOVED***
      if (tx.returnSlipsTo(mypublickey).length > 0) { return 1; ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***

***REMOVED***


module.exports = Wallet;
