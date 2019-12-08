const EmailFormTemplate = require('./email-form.template.js');
const EmailFormHeader = require("../../email-header/email-form-header/email-form-header");

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
            .addEventListener('click', (e) => this.sendEmailTransaction(app, data));
    },


    addData() {
        document.getElementById('email-from-address').value = `${this.saito.wallet.returnPublicKey()} (me)`;
    },

    async sendEmailTransaction(app, data) {

        let email_title = document.querySelector('.email-title').value;
        let email_text = document.querySelector('.email-text').value;
        let email_to = document.getElementById('email-to-address').value;
        let email_from = this.saito.wallet.returnPublicKey();

        email_to = await data.parentmod.addrController.returnPublicKey(email_to);

        let newtx = app.wallet.createUnsignedTransactionWithDefaultFee(email_to, 0.0);
        if (!newtx) {
          alert("Unable to send email. You appear to need more tokens");
	      return;
        }

        newtx.transaction.msg.module   = "Email";
        newtx.transaction.msg.title    = email_title;
        newtx.transaction.msg.message  = email_text;
        newtx = this.saito.wallet.signTransaction(newtx);

        app.network.propagateTransaction(newtx);

        data.parentmod.active = "email_list";
        data.parentmod.main.render(app, data);
        data.parentmod.main.attachEvents(app, data);

        alert("Your message has been sent");

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
