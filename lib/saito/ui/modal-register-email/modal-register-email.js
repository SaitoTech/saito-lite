const ModalRegisterEmailTemplate = require('./modal-register-email.template');
const SaitoOverlay = require('./../saito-overlay/saito-overlay');

class ModalRegisterEmail {

    constructor(app, callback = () => {}) {
      this.app = app;
      this.callback = callback;
    }

    render(app, mod) {

      mod.modal_overlay_email = new SaitoOverlay(app);
      mod.modal_overlay_email.render(app, mod);
      mod.modal_overlay_email.attachEvents(app, mod);

      if (!document.querySelector(".add-user")) { 
        mod.modal_overlay_email.showOverlay(app, mod, ModalRegisterEmailTemplate());
      }

    }

    attachEvents(app, mod) {

      document.querySelector('.tutorial-skip').onclick = () => {
        mod.modal_overlay_email.hideOverlay();
      };

      document.querySelector('#registry-input').onclick = () => {
        document.querySelector('#registry-input').setAttribute("placeholder", "");
      };


      document.querySelector('#backup-email-button').onclick = () => {

        let submitted_email = document.querySelector("#registry-input").value;
        let subscribe = document.querySelector("#signup").checked;

        //
        // regexp to identify email addresses
        //
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(submitted_email).toLowerCase()) || submitted_email === "email@domain.com") {
          salert("Invalid email address!");
          return;
        };

        //
        // update keychain
        //
        app.keys.updateEmail(app.wallet.returnPublicKey(), submitted_email);


	//
	// hide overlay
	//
        mod.modal_overlay_email.hideOverlay();

	//
	//
	//
	try {
	  window.location.reload();
	} catch (err) {
	  console.log("ERROR: " + err);
	}

      };

    }

}

module.exports = ModalRegisterEmail


