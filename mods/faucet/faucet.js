var saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');



class Faucet extends ModTemplate {
  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Faucet";
  ***REMOVED***

  handlePeerRequest(app, message, peer, mycallback=null) {
    switch(message.request) {
      case 'get tokens':
        this.sendTokensSuccess(message);
        break;
      default:
        break;
***REMOVED***
  ***REMOVED***

  sendTokensSuccess(message) {
    var publickey = message.data.address;

    if (publickey == null) {
      console.error("NO PUBLICKEY PROVIDED, EXCITING");
      return;
***REMOVED***

    let wallet_balance = this.app.wallet.returnBalance();

    if (wallet_balance < 1000) {
      console.log("\n\n\n *******THE FAUCETI SPOOR******* \n\n\n");
      return;
***REMOVED***

    try {

      let faucet_self = this;
      let newtx = new saito.transaction();
      let total_fees = Big(1002.0);
      newtx.transaction.from = faucet_self.app.wallet.returnAdequateInputs(total_fees);
      newtx.transaction.ts   = new Date().getTime();

      // add change input
      var total_inputs = Big(0.0);
      for (let ii = 0; ii < newtx.transaction.from.length; ii++) {
        total_inputs = total_inputs.plus(Big(newtx.transaction.from[ii].amt));
  ***REMOVED***

      //
      // generate change address(es)
      //
      var change_amount = total_inputs.minus(total_fees);

      if (Big(change_amount).gt(0)) {
        newtx.transaction.to.push(new saito.slip(faucet_self.app.wallet.returnPublicKey(), change_amount.toFixed(8)));
        newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
  ***REMOVED***

      for (let i = 0; i < 8; i++) {
        newtx.transaction.to.push(new saito.slip(publickey, Big(125.0)));
        newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
  ***REMOVED***

/*

      let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(publickey, 1000.0);
      if (newtx == null) {
        console.log("NEWTX IS NULL");
        return;
  ***REMOVED***
*/

      newtx.transaction.msg.module    = "Email";
      newtx.transaction.msg.title     = "Saito Faucet - Transaction Receipt";
      newtx.transaction.msg.message   = 'You have received 1000 tokens from our Saito faucet.';
      newtx = this.app.wallet.signTransaction(newtx);




      this.app.network.propagateTransaction(newtx);
      return;

***REMOVED*** catch(err) {
      console.log("ERROR CAUGHT IN FAUCET: ", err);
      return;
***REMOVED***
  ***REMOVED***
***REMOVED***

module.exports = Faucet;
