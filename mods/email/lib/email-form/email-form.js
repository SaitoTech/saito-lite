const EmailAddTemplate = require('./email-form.template.js');
// const EmailList = require('../email-list/email-list');

var numeral = require('numeral');

module.exports = EmailForm = {

    app: {***REMOVED***,
    saito: {***REMOVED***,
    emailList: {***REMOVED***,

    render(emailList) {
        this.emailList = emailList;
        this.app = emailList.app;
        this.saito = this.app.app;

        document.querySelector(".email-body").innerHTML = EmailAddTemplate();

        this.addData();
        this.attachEvents();
***REMOVED***,

    addData() {
        document.getElementById('email-from-address').value = `(Myself) ${this.saito.wallet.returnPublicKey()***REMOVED***`;
        document.querySelector('.email-balance').innerHTML = numeral(this.saito.wallet.returnBalance()).format('0,0.0000');
***REMOVED***,

    attachEvents() {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction());

        document.querySelector('.raw-switch')
            .addEventListener('click', (e) => this.popluateRawMessage());

***REMOVED***,

    sendEmailTransaction() {
        let newtx = this.buildTransaction();
        this.saito.network.propagateTransaction(newtx);
        alert("Your message has been sent");
        this.emailList.render();
***REMOVED***,

    buildTransaction() {
***REMOVED*** let saito = this.email.app;

        let email_title = document.querySelector('.email-title').value;
        let email_address = document.getElementById('email-to-address').value;

        if (email_address == "") {
          email_address = this.saito.wallet.returnPublicKey();
    ***REMOVED***

***REMOVED*** let email_fee = document.querySelector('.email-fee').value;
***REMOVED*** let email_amount = document.querySelector('.email-amount').value;
        let email_text = document.querySelector('.email-text').value;

***REMOVED*** if (email_fee == '') { email_fee = 0.0; ***REMOVED***
***REMOVED*** if (email_amount == '') { email_amount = 0.0; ***REMOVED***

        let fee = 2.0; // parseFloat(email_fee);
        let amt = 0.0; // parseFloat(email_amount);

        let newtx = this.saito.wallet.createUnsignedTransaction(email_address, amt, fee);

        if (!newtx) {
          alert("Unable to send, please get tokens");
    ***REMOVED***

        newtx.transaction.msg.module   = "Email";
        newtx.transaction.msg.title    = email_title;
        newtx.transaction.msg.message  = email_text;
        newtx = this.saito.wallet.signTransaction(newtx);

        return newtx;
***REMOVED***,

    popluateRawMessage() {
        console.log('lets get raw');
        var txJson = JSON.stringify(this.buildTransaction(), null, 4);
        var r = document.querySelector('.raw-message');
        r.textContent = txJson;
        document.querySelector('.email-text').style.display = "none";
        document.querySelector('.raw-switch').style.display = "none";
        r.style.display = "block";
        r.onkeyup = () => { this.verifyJSON() ***REMOVED***;
***REMOVED***,

    verifyJSON() {
      var message_input = document.querySelector('.raw-message');
      var str = message_input.value;
      try {
          JSON.parse(str);
  ***REMOVED*** catch (e) {
          message_input.style.background = "#FCC";
          message_input.style.color = "red";
          return false;
  ***REMOVED***
      message_input.style.background = "#FFF";
      message_input.style.color = "#000";
      return true;
***REMOVED***


***REMOVED***
