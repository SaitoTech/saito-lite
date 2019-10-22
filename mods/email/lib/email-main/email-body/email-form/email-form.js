const EmailFormTemplate = require('./email-form.template.js');
const EmailFormHeader = require("../../email-header/email-form-header");

module.exports = EmailForm = {

    app: {},
    saito: {},
    emailList: {},

    render(app, data={ emailList: {} }) {
        this.app = app;
        this.saito = this.app;

        document.querySelector(".email-body").innerHTML = EmailFormTemplate();

        this.addData();
    },

    attachEvents(app, data) {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction());
    },


    addData() {
        document.getElementById('email-from-address').value = `${this.saito.wallet.returnPublicKey()} (me)`;
    },

    sendEmailTransaction() {
        let newtx = this.buildTransaction();
        this.saito.network.propagateTransaction(newtx);
        alert("Your message has been sent");

        data.parentmod.active = "email_list";
        data.parentmod.main.render(app, data);
        data.parentmod.main.attachEvents(app, data);
    },

    buildTransaction() {
        // let saito = this.email.app;

        let email_title = document.querySelector('.email-title').value;
        let email_address = document.getElementById('email-to-address').value;

        if (email_address == "") {
          email_address = this.saito.wallet.returnPublicKey();
        }

        // let email_fee = document.querySelector('.email-fee').value;
        // let email_amount = document.querySelector('.email-amount').value;
        let email_text = document.querySelector('.email-text').value;

        // if (email_fee == '') { email_fee = 0.0; }
        // if (email_amount == '') { email_amount = 0.0; }

        let fee = 2.0; // parseFloat(email_fee);
        let amt = 0.0; // parseFloat(email_amount);

        let newtx = this.saito.wallet.createUnsignedTransaction(email_address, amt, fee);

        if (!newtx) {
          alert("Unable to send, please get tokens");
        }

        newtx.transaction.msg.module   = "Email";
        newtx.transaction.msg.title    = email_title;
        newtx.transaction.msg.message  = email_text;
        newtx = this.saito.wallet.signTransaction(newtx);

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
