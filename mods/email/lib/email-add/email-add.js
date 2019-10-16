const EmailAddTemplate = require('./email-add.template.js');
const EmailList = require('../email-list/email-list');

module.exports = EmailAdd = {
    email: {***REMOVED***,
    emailList: {***REMOVED***,
    render(emailList) {
        this.emailList = emailList;
        this.email = emailList.email;
        document.querySelector(".main").innerHTML = EmailAddTemplate();
        this.attachEvents();
***REMOVED***,

    attachEvents() {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction());

***REMOVED***,

    sendEmailTransaction() {
        let saito = this.email.app;

        let email_title = document.querySelector('.email-title').value;
        let email_address = document.querySelector('.email-address').value;

        if (email_address == "") {
          email_address = saito.wallet.returnPublicKey();
    ***REMOVED***

        let email_fee = document.querySelector('.email-fee').value;
        let email_amount = document.querySelector('.email-amount').value;
        let email_text = document.querySelector('.email-text').value;

        if (email_fee == '') { email_fee = 0.0; ***REMOVED***
        if (email_amount == '') { email_amount = 0.0; ***REMOVED***

        let fee = parseFloat(email_fee);
        let amt = parseFloat(email_amount);

        let newtx = saito.wallet.createUnsignedTransaction(saito.wallet.returnPublicKey(), amt, fee);

        if (!newtx) {
          alert("Unable to send, please get tokens");
    ***REMOVED***

        newtx.transaction.msg.module = "Email";
        newtx.transaction.msg.data  = email_text;
        newtx.transaction.msg.title  = email_title;
        newtx = saito.wallet.signTransaction(newtx);

        saito.network.propagateTransaction(newtx);

        alert("Your email has been sent!");

        this.emailList.render();
***REMOVED***
***REMOVED***