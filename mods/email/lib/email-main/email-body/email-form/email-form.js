const saito = require('../../../../../../lib/saito/saito');
const EmailFormTemplate = require('./email-form.template.js');
const EmailFormHeader = require("../../email-header/email-form-header/email-form-header");
const Big = require('big.js');

module.exports = EmailForm = {

    app: {},
    saito: {},
    emailList: {},

    render(app, data={ emailList: {} }) {
        this.app = app;
        this.saito = this.app;

        document.querySelector(".email-body").innerHTML = EmailFormTemplate();

        this.addData();

        var editor = new MediumEditor('#email-text', {
            placeholder: true,
            buttonLabels: 'fontawesome',
            toolbar: {
                // These are the default options for the toolbar,
                //   if nothing is passed this is what is used 
                allowMultiParagraphSelection: true,
                buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
                diffLeft: 0,
                diffTop: -10,
                firstButtonClass: 'medium-editor-button-first',
                lastButtonClass: 'medium-editor-button-last',
                relativeContainer: null,
                standardizeSelectionStart: false,
                static: false,
                // options which only apply when static is true 
                align: 'center',
                sticky: false,
                updateOnEmptySelection: false
            }
        });
    },

    attachEvents(app, data) {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction(app, data));

        document.querySelector('.fa-dollar-sign')
            .addEventListener('click', (e) => {
            document.querySelector('.amount-value').toggleClass("hidden");
            document.querySelector('.amount-label').toggleClass("hidden");
        })
    },


    addData() {
        document.getElementById('email-from-address').value = `${this.saito.wallet.returnPublicKey()} (me)`;
    },

    async sendEmailTransaction(app, data) {

        let email_title = document.querySelector('.email-title').value;
        let email_text = document.querySelector('#email-text').innerHTML;
        let email_to = document.getElementById('email-to-address').value;
        let email_amount_elem = document.querySelector('.email-amount');
        let email_from = this.saito.wallet.returnPublicKey();
        let email_amount = 0.0;

        if (email_amount_elem)  {
            if (email_amount_elem.value > 0) {
                email_amount = email_amount_elem.value;
            }
        }

        email_to = await data.email.addrController.returnPublicKey(email_to);

        // Add amt here
        let newtx = app.wallet.createUnsignedTransaction(email_to, email_amount, 0.0);
        if (!newtx) {
          salert("Unable to send email. You appear to need more tokens");
	      return;
        }

        newtx.transaction.msg.module   = "Email";
        newtx.transaction.msg.title    = email_title;
        newtx.transaction.msg.message  = email_text;
        newtx = this.saito.wallet.signTransaction(newtx);

        app.network.propagateTransaction(newtx);

        data.email.active = "email_list";
        data.email.main.render(app, data);
        data.email.main.attachEvents(app, data);

        salert("Your message has been sent");

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
