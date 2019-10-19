var saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const WalletTemplate = require('./lib/wallet.template');

//////////////////
// CONSTRUCTOR  //
//////////////////
class Wallet extends ModTemplate {

  constructor(app) {
    super(app);

    this.app             = app;
    this.name            = "Wallet";
    this.handlesEmail    = 1;

    this.publickey       = app.wallet.returnPublicKey();
    // this.balance         = app.wallet.returnBalance();

    if (app.BROWSER == 1) {
      this.QRCode = require('./lib/qrcode');
***REMOVED***

    return this;
  ***REMOVED***

  generateQRCode(data) {
    return new this.QRCode(
      document.getElementById("qrcode"),
      data
    );
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


  /*
   MODULE HTML FUNCTIONS
  */
  returnButtonHTML() {
    return `<i class="fas fa-dollar-sign"><span style="margin-left: 7px">Wallet</span></i>`;
  ***REMOVED***

  returnHTML() {
    return WalletTemplate(this.app.wallet.returnBalance(), this.publickey);
  ***REMOVED***

  afterRender() {
    this.generateQRCode(this.publickey);
  ***REMOVED***

***REMOVED***


module.exports = Wallet;
