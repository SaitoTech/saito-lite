const EmailAddTemplate = require('./email-form.template.js');
const EmailList = require('../email-list/email-list');
var numeral = require('numeral');

module.exports = EmailAdd = {

    app: {},
    saito: {},
    emailList: {},

    render(emailList) {
        this.emailList = emailList;
        this.app = emailList.app;
        this.saito = this.app.app;

        document.querySelector(".email-body").innerHTML = EmailAddTemplate();

        this.addData();
        this.attachEvents();
    },

    addData() {
        document.querySelector('.email-identifier').innerHTML = 'Address: ' + this.saito.wallet.returnPublicKey();
        document.querySelector('.email-balance').innerHTML = numeral(this.saito.wallet.returnBalance()).format('0,0.0000');
    },

    attachEvents() {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction());

        document.querySelector('.raw-switch')
            .addEventListener('click', (e) => this.popluateRawMessage());

    },

    sendEmailTransaction() {
        let newtx = this.buildTransaction();
        this.saito.network.propagateTransaction(newtx);
        alert("Your message has been sent");
        this.emailList.render();
    },

    buildTransaction() {
        // let saito = this.email.app;

        let email_title = document.querySelector('.email-title').value;
        let email_address = document.querySelector('.email-to-address').value;

        if (email_address == "") {
          email_address = saito.wallet.returnPublicKey();
        }

        // let email_fee = document.querySelector('.email-fee').value;
        // let email_amount = document.querySelector('.email-amount').value;
        let email_text = document.querySelector('.email-text').value;

        // if (email_fee == '') { email_fee = 0.0; }
        // if (email_amount == '') { email_amount = 0.0; }

        let fee = parseFloat(email_fee);
        let amt = parseFloat(email_amount);

        let newtx = this.saito.wallet.createUnsignedTransaction(saito.wallet.returnPublicKey(), amt, fee);

        if (!newtx) {
          alert("Unable to send, please get tokens");
        }

        newtx.transaction.msg.module   = "Email";
        newtx.transaction.msg.title    = email_title;
        newtx.transaction.msg.message  = email_text;
        newtx = saito.wallet.signTransaction(newtx);

        return newtx;
    },

    popluateRawMessage() {
        console.log('lets get raw');
        var txJson = JSON.stringify(this.buildTransaction(), null, 4);
        var r = document.querySelector('.raw-message');
        r.textContent = txJson;
        document.querySelector('.email-text').style.display = "none";
        document.querySelector('.raw-switch').style.display = "none";
        r.style.display = "block";
        r.onkeyup = () => { this.verifyJSON() };
    },

    verifyJSON() {
      var message_input = document.querySelector('.raw-message');
      var str = message_input.value;
      try {
          JSON.parse(str);
      } catch (e) {
          message_input.style.background = "#FCC";
          message_input.style.color = "red";
          return false;
      }
      message_input.style.background = "#FFF";
      message_input.style.color = "#000";
      return true;
    }


}
