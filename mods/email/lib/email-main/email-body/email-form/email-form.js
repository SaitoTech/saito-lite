const EmailFormTemplate = require('./email-form.template.js');

module.exports = EmailForm = {

    app: {},
    saito: {},
    emailList: {},

    render(app, mod) {
        this.app = app;
        this.saito = this.app;
        let address = mod.parseHash(window.location.hash).toaddress
        document.querySelector(".email-body").innerHTML = EmailFormTemplate(address);

        if (document.querySelector('.create-button')) { document.querySelector('.create-button').classList.add("mobile-hide"); }

        this.addData();

        var editor = new MediumEditor('#email-text', {
          placeholder: false,
          buttonLabels: 'fontawesome',
          toolbar: {
            allowMultiParagraphSelection: true,
            buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
            diffLeft: 0,
            diffTop: -10,
            firstButtonClass: 'medium-editor-button-first',
            lastButtonClass: 'medium-editor-button-last',
            relativeContainer: null,
            standardizeSelectionStart: false,
            static: false,
            updateOnEmptySelection: true,
            anchor: {
              customClassOption: null,
              customClassOptionText: 'Button',
              linkValidation: true,
              placeholderText: 'Paste or type a link',
              targetCheckbox: true,
              targetCheckboxText: 'Open in new window'
            }
          }
        });
    
    },

    attachEvents(app, mod) {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction(app, mod));

        /*document.querySelector('.fa-dollar-sign')
            .addEventListener('click', (e) => {
            document.querySelector('.amount-value').toggleClass("hidden");
            document.querySelector('.amount-label').toggleClass("hidden");
        });*/
    },


    addData() {
        document.getElementById('email-from-address').value = `${this.saito.wallet.returnPublicKey()} (me)`;
    },

    async sendEmailTransaction(app, mod) {

        let email_title = document.querySelector('.email-title').value;
        let email_to = document.getElementById('email-to-address').value;
        let email_text = document.getElementById('email-text').innerHTML;
        let email_amount_elem = document.querySelector('.email-amount');
        let email_amount = 0.0;

	//
	// easy copy and paste error
	//
	if (email_to.indexOf(' (me)') > 0) {
	  email_to = email_to.substring(0, email_to.indexOf(' (me)'));
	}


        if (email_amount_elem)  {
            if (email_amount_elem.value > 0) {
                email_amount = parseFloat(email_amount_elem.value);
            }
        }

        email_to = await mod.addrController.returnPublicKey(email_to);

        let newtx = app.wallet.returnBalance() > 0 ?
            app.wallet.createUnsignedTransactionWithDefaultFee(email_to, email_amount) :
            app.wallet.createUnsignedTransaction(email_to, email_amount, 0.0);

        if (!newtx) {
          salert("Unable to send email. You appear to need more tokens");
	      return;
        }

        newtx.msg.module   = "Email";
        newtx.msg.title    = email_title;
        newtx.msg.message  = email_text;
        newtx = app.wallet.signTransaction(newtx);

        app.network.propagateTransaction(newtx);

        window.location.hash = "#page=email_list&subpage=inbox"
        
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
