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

  initialize(app) {
    super.initialize(app);

    if (this.app.BROWSER) { EmailList.render(this); ***REMOVED***
  ***REMOVED***

  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {
      email.addEmail(tx);
***REMOVED***

  ***REMOVED***

  onPeerHandshakeComplete(app, peer) { this.getTokens(); ***REMOVED***

  addEmail(tx) {
    let {title, message***REMOVED*** = tx.returnMessage();
    this.emails.unshift({title, message, timestamp: tx.transaction.ts***REMOVED***);

    if (this.app.BROWSER) { EmailList.render(this); ***REMOVED***
  ***REMOVED***

  getTokens() {
    let msg = {***REMOVED***;
    msg.data = {address: this.app.wallet.returnPublicKey()***REMOVED***;
    msg.request = 'get tokens';

    this.app.network.sendRequest(msg.request, msg.data);
  ***REMOVED***

***REMOVED***

module.exports = Email;