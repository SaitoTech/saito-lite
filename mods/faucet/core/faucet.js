const ModTemplate = require('../../../lib/templates/modtemplate.js');

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
    // const response = {
    //   payload: {***REMOVED***,
    //   error: {***REMOVED***
    // ***REMOVED***

    var publickey = message.data.address;

    if (publickey == null) {
      // res.setHeader('Content-type', 'json/application');
      // response.error.message =  "NO SAITO ADDRESS PROVIDED - FORM IMPROPERLY SUBMITTED"
      // res.send(JSON.stringify(response))
      console.error("NO PUBLICKEY PROVIDED, EXITING");
      return;
***REMOVED***

    let wallet_balance = this.app.wallet.returnBalance();

    if (wallet_balance < 1000) {
    // if we have less than 50 Saito in our wallets
    // if (this.app.wallet.returnBalance() < 5000000000) {
      // res.setHeader('Content-type', 'json/application');
      // response.error.message = "Our server does not have enough Saito to complete this sale. Please check back later."
      // res.send(JSON.stringify(response))
      console.log("\n\n\n *******THE FAUCE TIS POOR******* \n\n\n");
      return;
***REMOVED***

    // var unixtime = new Date().getTime();
    // var unixtime_check = unixtime - 86400000;

    // var sql = "SELECT count(*) AS count FROM mod_faucet WHERE publickey = $publickey AND unixtime > $unixtime";
    // var params = { $publickey : publickey , $unixtime : unixtime_check ***REMOVED***

    try {
      // var row = await this.app.storage.db.get(sql, params)

      // if (row.count != 0) {
      //   res.setHeader('Content-type', 'json/application');
      //   response.error.message = "You have already received your tokens. Wait 24 hours for the next drop"
      //   res.send(JSON.stringify(response))
      //   return;
      // ***REMOVED***

      // sql = "INSERT INTO mod_faucet (publickey, unixtime) VALUES ($publickey, $unixtime)";
      // params = { $publickey : publickey , $unixtime : unixtime ***REMOVED***
      // this.app.storage.db.all(sql, params)

      let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(publickey, 1000.0);

      if (newtx == null) {
***REMOVED*** res.setHeader('Content-type', 'json/application');
***REMOVED*** response.error.message = "Sorry, the faucet is out of money. Alert bearguy@saito"
***REMOVED*** res.send(JSON.stringify(response))
        console.log("NEWTX IS NULL");
        return;
  ***REMOVED***

      newtx.transaction.msg.module = "Email";
      newtx.transaction.msg.title  = "Saito Faucet - Transaction Receipt";
      newtx.transaction.msg.data   = 'You have received 1000 tokens from our Saito faucet.';
      newtx = this.app.wallet.signTransaction(newtx);

      this.app.network.propagateTransaction(newtx);

      // res.setHeader('Content-type', 'json/application');
      // res.charset = 'UTF-8';
      // response.payload.status = true
      // response.payload.message = "Success! Your tokens should arrive soon"
      // res.send(JSON.stringify(response))
      return;

***REMOVED*** catch(err) {
      // res.setHeader('Content-type', 'json/application');
      // response.error.message = err.message
      // res.send(JSON.stringify(response))
      console.log("ERROR CAUGHT IN FAUCET: ", err);
      return;
***REMOVED***
  ***REMOVED***
***REMOVED***

module.exports = Faucet;