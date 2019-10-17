const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');

const EmailList = require('./lib/email-list/email-list');

class Email extends ModTemplate {

  constructor(app) {
    super(app);

    this.name = "Email";
    this.emails = [
      {
        title: "New Email",
        message: "This is a new email, just for you!",
        timestamp: new Date().getTime(),
  ***REMOVED***
    ];
  ***REMOVED***


  initializeHTML(app) {

    EmailList.render(this);

  ***REMOVED***



  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete() {

    //
    // leaving this here for the short term, 
    // token manager can be a separate module
    // in the long-term, as the email client 
    // should just handle emails
    //
    this.getTokens();

    let txs = await this.app.storage.loadTransactions("Email", 50);
    for (let i = 0; i < txs.lengthl; i++) {
      this.addEmail(txs[i]);
***REMOVED***

    if (this.app.BROWSER) { EmailList.render(this); ***REMOVED***
  ***REMOVED***



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {

      //
      // if transaction is for me
      // 
      if (tx.isTo(app.wallet.returnPublicKey())) {

	//
	// great lets save this
	//
	app.storage.saveTransaction(tx);

	//
	// and update our email client
	//
        email.addEmail(tx);
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  addEmail(tx) {
    let {title, message***REMOVED*** = tx.returnMessage();
    this.emails.unshift({title, message, timestamp: tx.transaction.ts***REMOVED***);
    if (this.app.BROWSER) { EmailList.render(this); ***REMOVED***
  ***REMOVED***


  getTokens() {
    let msg = {***REMOVED***;
    msg.data = {address: this.app.wallet.returnPublicKey()***REMOVED***;
    msg.request = 'get tokens';
    setTimeout(() => {
        this.app.network.sendRequest(msg.request, msg.data);
***REMOVED***, 1000);
  ***REMOVED***

***REMOVED***

module.exports = Email;
