var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Modzipper extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Modzipper";
    this.mods		= ['debug','chess','escrow','imperium','pandemic','poker','roles','testing','twilight','wallet','wordblocks'];

    this.zipped_and_submitted = 0;

    return this;
  ***REMOVED***




  onConfirmation(blk, tx, conf, app) {

    let modzipper_self = app.modules.returnModule("Modzipper");

    if (modzipper_self.zipped_and_submitted == 0) {

      for (let i = 0; i < modzipper_self.mods.length; i++) {

console.log("Zipping: " + modzipper_self.mods[i]); 

        var newtx = app.wallet.createUnsignedTransactionWithDefaultFee(app.wallet.returnPublicKey());
        if (newtx == null) { return; ***REMOVED***
        newtx.transaction.msg.module   = "AppStore";
        newtx.transaction.msg.request  = "submit module";
        newtx.transaction.msg.zip      = "ZIPFILE GOES HERE";
        newtx = this.app.wallet.signTransaction(newtx);
        app.network.propagateTransaction(newtx);

  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***





module.exports = Modzipper;

