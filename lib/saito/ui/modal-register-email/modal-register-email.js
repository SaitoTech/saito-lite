const ModalRegisterUsernameTemplate = require('./modal-register-username.template');
const SaitoOverlay = require('./../saito-overlay/saito-overlay');

class ModalRegisterEmail {

    constructor(app, callback = () => {}) {
      this.app = app;
      this.callback = callback;
    }

    render(app, mod) {

      mod.modal_overlay = new SaitoOverlay(app);
      mod.modal_overlay.render(app, mod);
      mod.modal_overlay.attachEvents(app, mod);

      if (!document.querySelector(".add-user")) { 
        mod.modal_overlay.showOverlay(app, mod, ModalRegisterEmailTemplate());
      }

    }

    attachEvents(app, mod) {
/***
      document.querySelector('.tutorial-skip').onclick = () => {
        mod.modal_overlay.hideOverlay();
      };

      document.querySelector('#registry-input').onclick = () => {
        document.querySelector('#registry-input').setAttribute("placeholder", "");
      };

    document.querySelector('#backup-email-button').onclick = () => {

      let submitted_email = document.querySelector("#registry-input").value;
      let subscribe = document.querySelector("#signup").checked;

      var hp = document.querySelector('#name').value;

      if (hp != "") {
        mod.modal_overlay.hideOverlay();
        return;
      }
      //
      // regexp to identify email addresses
      //
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(submitted_email).toLowerCase()) || submitted_email === "email@domain.com") {
        salert("Invalid email address!");
        return;
      };

      //
      // update profile
      //
      if (!app.options.profile) { app.options.profile = {}; }
      app.options.profile.email = submitted_email;


      //
      // update keychain
      //
      app.keys.updateEmail(app.wallet.returnPublicKey(), submitted_email);




***/
    }

}

module.exports = ModalRegisterEmail


