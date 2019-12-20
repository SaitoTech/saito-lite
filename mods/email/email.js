const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');
const EmailMain = require('./lib/email-main/email-main');
const EmailSidebar = require('./lib/email-sidebar/email-sidebar');

const AddressController = require('../../lib/ui/menu/address-controller');


class Email extends ModTemplate {

  constructor(app) {
    super(app);

    this.name 			= "Email";
    this.chat 			= null;
    this.events			= ['chat-render-request'];

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

    this.appspace		= 0;	// print email-body with appspace
    this.appspace_mod		= null;
    this.appspace_mod_idx 	= -1; // index in mods of appspace module

    this.uidata			= {***REMOVED***;
    this.uidata.mods		= [];
    this.count = 0;

    // add our address controller
    this.addrController = new AddressController(app, this.returnMenuItems());

  ***REMOVED***

  render(app, data) {
    this.renderMain(app, data);
    this.renderSidebar(app, data);
  ***REMOVED***

  renderMain(app, data) {
    EmailMain.render(app, data);
    EmailMain.attachEvents(app, data);
  ***REMOVED***

  renderSidebar(app, data) {
    EmailSidebar.render(app, data);
    EmailSidebar.attachEvents(app, data);
  ***REMOVED***

  initialize(app) {

    super.initialize(app);

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



  respondTo(type="") {
    if (type == "header-dropdown") { 
      return {***REMOVED***; 
***REMOVED***
    return null;
  ***REMOVED***




  initializeHTML(app) {

    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    let x = [];
    x = this.app.modules.respondTo("email-appspace");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
***REMOVED***
    x = this.app.modules.respondTo("email-chat");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
***REMOVED***

    this.uidata.mods	  = this.mods;
    this.uidata.parentmod = this;

    this.render(app, this.uidata);

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

    if (this.browser_active == 0) { return; ***REMOVED***

    //
    // leaving this here for the short term,
    // token manager can be a separate module
    // in the long-term, as the email client
    // should just handle emails
    //
    this.getTokens();

    this.app.storage.loadTransactions("Email", 50, (txs) => {

      let keys = [];

      for (let i = 0; i < txs.length; i++) {
        this.emails.inbox.unshift(txs[i]);
        keys.push(txs[i].transaction.from[0].add);
  ***REMOVED***

      EmailList.render(this.app, this.uidata);
      EmailList.attachEvents(this.app, this.uidata);

      this.addrController.fetchIdentifiers(keys);

***REMOVED***);


    EmailList.render(this.app, this.uidata);
    EmailList.attachEvents(this.app, this.uidata);

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
    try {
      this.emails.inbox.unshift(tx);
      this.addrController.fetchIdentifiers([tx.transaction.from[0].add]);
      if (this.browser_active) { this.renderMain(this.app, this.uidata); ***REMOVED***
***REMOVED*** catch (err) {
***REMOVED***
  ***REMOVED***



  receiveEvent(type, data) {

    console.log("EVENT RECEIVED: ");

    if (type == 'chat-render-request') {
      if (this.browser_active) {
        this.renderSidebar(this.app, this.uidata);
  ***REMOVED***
***REMOVED***

  ***REMOVED***

  returnMenuItems() {
    return {
      'send-email': {
        name: 'Send Email',
        callback: (address) => {
          this.previous_state = this.active;
          this.active = "email_form";

          this.main.render(this.app, this.uidata);
          this.main.attachEvents(this.app, this.uidata);

          document.getElementById('email-to-address').value = address;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  getTokens() {

    let msg = {***REMOVED***;
    msg.data = {address: this.app.wallet.returnPublicKey()***REMOVED***;
    msg.request = 'get tokens';
    setTimeout(() => {
        console.log("sending request for funds...");
        this.app.network.sendRequest(msg.request, msg.data);
***REMOVED***, 1000);
  ***REMOVED***

  updateBalance() {
    if (this.browser_active) {
      let balance = this.app.wallet.returnBalance();
      document.querySelector('.email-balance').innerHTML = balance + " SAITO";
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Email;
