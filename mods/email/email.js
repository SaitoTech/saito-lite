const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const EmailMain = require('./lib/email-main/email-main');
const EmailSidebar = require('./lib/email-sidebar/email-sidebar');


class Email extends ModTemplate {

  constructor(app) {
    super(app);

    this.name 			= "Email";
    this.chat 			= null;

    this.emails 		= {***REMOVED***;
    this.emails.inbox 		= [];
    this.emails.sent 		= [];
    this.emails.trash 		= [];
    this.emails.active  	= "inbox";
					// inbox
					// outbox
					// trash

    this.mods   		= [];

    this.active 		= "email_list";
    this.header_title		= "";

    this.selected_email		= null;

    // this.appspace		= 0;	// print email-body with appspace
    // this.appspace_mod_idx 	= -1; // index in mods of appspace module

    this.uidata			= {***REMOVED***;

  ***REMOVED***

  render(app, data) {

    EmailMain.render(app, data);
    EmailMain.attachEvents(app, data);

    EmailSidebar.render(app, data);
    EmailSidebar.attachEvents(app, data);


  ***REMOVED***

  initialize(app) {




    //
    // add an email
    //
    let tx = app.wallet.createUnsignedTransaction();
        tx.transaction.msg.module 	= "Email";
        tx.transaction.msg.title 	= "Welcome to Saito";
        tx.transaction.msg.message	= "This is a fresh email, added " + new Date().getTime();
    tx = this.app.wallet.signTransaction(tx);
    this.emails.inbox.push(tx);

        tx = app.wallet.createUnsignedTransaction();
        tx.transaction.msg.module 	= "Email";
        tx.transaction.msg.title 	= "Welcome to Saito";
        tx.transaction.msg.message	= "This is where your sent messages go...";
    tx = this.app.wallet.signTransaction(tx);
    this.emails.sent.push(tx);

  ***REMOVED***


  initializeHTML(app) {

    this.mods = this.app.modules.respondTo("email-appspace");

    this.uidata.mods	  = this.mods;
    this.uidata.parentmod = this;

    EmailMain.render(app, this.uidata);
    EmailMain.attachEvents(app, this.uidata);

    EmailSidebar.render(app, this.uidata);
    EmailSidebar.attachEvents(app, this.uidata);

    //
    // update chat module
    //
    //let chatManager = app.modules.returnModule("Chat");
    //this.chat = chatManager.respondTo("email");

  ***REMOVED***



  deleteTransaction(tx) {

    for (let i = 0; i < this.emails[this.emails.active].length; i++) {
      let mytx = this.emails[this.emails.active][i];
      if (mytx.transaction.sig == tx.transaction.sig) {
        this.app.storage.deleteTransaction(tx);
        this.emails[this.emails.active].splice(i, 1);
        this.emails['trash'].unshift(tx);
  ***REMOVED***
***REMOVED***

  ***REMOVED***


  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

/*****

    //
    // used in testing SAVE -- works now
    //
    //this.app.storage.saveTransaction(this.emails['inbox'][0]);


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
*****/

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
    if (this.app.BROWSER) {
      document.querySelector('.email-balance').innerHTML = this.app.wallet.returnBalance();
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Email;
