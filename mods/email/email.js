const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');

const EmailContainer = require('./lib/email-container/email-container');

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

    this.emailMods = [];
  ***REMOVED***


  initialize(app) {
    this.emailMods = this.app.modules.implementsKeys([
      'afterRender',
      'returnHTML',
      'returnButtonHTML',
    ]);
    console.log(this.emailMods);
  ***REMOVED***


  initializeHTML(app) {
    EmailContainer.render(this);
  ***REMOVED***



  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    //
    // leaving this here for the short term,
    // token manager can be a separate module
    // in the long-term, as the email client
    // should just handle emails
    //
    this.getTokens();

    this.app.storage.loadTransactions("Email", 50, (txs) => {

      //for (let i = 0; i < txs.length; i++) {

	let msg = {***REMOVED***;
	    msg.title = "Loaded from remote server";
	    msg.message = "This email is not actually loaded from a remote server, but once the archives are saving transactions and returning them instead of just dummy text, we can easily correct this.";
	    msg.timestamp = new Date().getTime();

	this.emails.push(msg);
	EmailList.render(this);
	
***REMOVED***this.addEmail(msg);

      //***REMOVED***

***REMOVED***);

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

***REMOVED***
***REMOVED*** great lets save this
***REMOVED***
        app.storage.saveTransaction(tx);

***REMOVED***
***REMOVED*** and update our email client
***REMOVED***
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
