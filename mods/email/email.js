const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const EmailMain = require('./lib/email-main/email-main');

// external dependency
const numeral = require('numeral');

class Email extends ModTemplate {

  constructor(app) {
    super(app);

    this.name 		= "Email";
    this.chat 		= null;

    this.emails 	      = {***REMOVED***;
    this.emails.inbox 	= [];
    this.emails.sent 	  = [];
    this.emails.trash 	= [];
    this.emails.active  = "inbox";  	// inbox
				// outbox
				// trash

    this.mods   	= [];

    this.uidata		= {***REMOVED***;

  ***REMOVED***

  initialize(app) {
    //
    // what does this do? function names do not adequately indicate purpose
    //
    this.mods = this.app.modules.implementsKeys([
      'afterRender',
      'returnHTML',
      'returnButtonHTML',
    ]);

  ***REMOVED***


  initializeHTML(app) {

    this.uidata.mods	  = this.mods;
    this.uidata.parentmod = this;

    //
    // add all HTML elements to DOM
    //
    EmailMain.render(app, this.uidata);
    EmailMain.attachEvents(app, this.uidata);

    //
    // update chat module
    //
    //let chatManager = app.modules.returnModule("Chat");
    //this.chat = chatManager.respondTo("email");

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
    //this.getTokens();

    this.app.storage.loadTransactions("Email", 50, (txs) => {

      for (let i = 0; i < txs.length; i++) {
        this.emails.inbox.unshift(txs[i]);
  ***REMOVED***

      EmailList.render(this.app, this.uidata);
      EmailList.attachEvents(this.app, this.uidata);

***REMOVED***);

    if (this.app.BROWSER) {
      EmailList.render(this.app, this.uidata);
      EmailList.attachEvents(this.app, this.uidata);
***REMOVED***

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
    this.emails.inbox.unshift({title, message, timestamp: tx.transaction.ts***REMOVED***);
    if (this.app.BROWSER) { EmailList.render(this.app, this.uidata); ***REMOVED***
  ***REMOVED***


  getTokens() {
    let msg = {***REMOVED***;
    msg.data = {address: this.app.wallet.returnPublicKey()***REMOVED***;
    msg.request = 'get tokens';
    setTimeout(() => {
        this.app.network.sendRequest(msg.request, msg.data);
***REMOVED***, 1000);
  ***REMOVED***

  updateBalance() {
/**
    if (this.app.BROWSER) {
      document.querySelector('.email-balance').innerHTML
        = numeral(this.app.wallet.returnBalance()).format('0,0.0000');
***REMOVED***
***/
  ***REMOVED***

***REMOVED***

module.exports = Email;
