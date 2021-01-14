const ModalRegisterEmailTemplate = require('./modal-register-email.template');
const SaitoOverlay = require('../saito-overlay/saito-overlay');
const saito = require('../../saito');

const MODES = {
  "NEWSLETTER": 0,
  "PUBLICSALE": 1,
  "BACKUP": 2,
}
class ModalRegisterEmail {

    constructor(app, callback = () => {}) {
      this.app = app;
      this.callback = callback;
      this.mode = null;
    }

    render(app, mod, mode=MODES.NEWSLETTER) {
      this.mode = mode;  
      this.modal_overlay_email = new SaitoOverlay(app);
      this.modal_overlay_email.render(app, mod);
      this.modal_overlay_email.attachEvents(app, mod);

      if (!document.querySelector(".add-user")) { 
        this.modal_overlay_email.showOverlay(app, mod, ModalRegisterEmailTemplate(mode, MODES));
      }
    }
    
    attachEvents(app, mod) {

      document.querySelector('.tutorial-skip').onclick = () => {
        this.modal_overlay_email.hideOverlay();
      };

      document.querySelector('#registry-input').onclick = () => {
        document.querySelector('#registry-input').setAttribute("placeholder", "");
      };

      document.querySelector('#backup-email-button').onclick = () => {
        let submitted_email = document.querySelector("#registry-input").value;
        let subscribe_newsletter = document.querySelector("#signup") && document.querySelector("#signup").checked;
        if(this.mode === MODES.NEWSLETTER) {
          this.doNewsletterSignup(app, mod, submitted_email);
        } else if(this.mode === MODES.PUBLICSALE) {
          this.doPublicSaleSignup(app, mod, submitted_email, subscribe_newsletter);
        } else if(this.mode === MODES.BACKUP) {
          // TODO: This mode doesnt' actually work. I think it's possible to
          // leverage mailrelay.js to maybe make this work...
          this.doEmailBackup(app, mod, submitted_email, subscribe_newsletter);
        } else {
          throw "No such mode: " + this.mode;
        }
      };
    }
    success() {
      this.modal_overlay_email.hideOverlay();
      salert("Thanks for signing up!");
    }
    doEmailBackup(app, mod, submitted_email, subscribe_newsletter) {
      //
      // regexp to identify email addresses
      //
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(submitted_email).toLowerCase()) || submitted_email === "email@domain.com") {
        salert("Invalid email address!");
        return;
      };
      
      app.keys.updateEmail(app.wallet.returnPublicKey(), submitted_email);
      if(subscribe_newsletter) {
        this.doNewsletterSignup(app, mod, submitted_email);
      } else {
        this.success();
      }
      
      // try {
      //   window.location.reload();
      // } catch (err) {
      //   console.log("ERROR: " + err);
      // }
    }
    doNewsletterSignup(app, mod, submitted_email) {
      tx = new saito.transaction();
      tx.msg 	= {
        key: app.wallet.returnPublicKey(),
        email: submitted_email,
        time: Date.now()
      };
      app.network.sendRequest("newsletter signup", tx);
      this.success();
    }
    doPublicSaleSignup(app, mod, submitted_email, subscribe_newsletter) {
      tx = new saito.transaction();
      tx.msg 	= {
        key: app.wallet.returnPublicKey(),
        email: submitted_email,
        time: Date.now()
      };
      app.network.sendRequest("public sale signup", tx);
      if(subscribe_newsletter) {
        this.doNewsletterSignup(app, mod, submitted_email);
      } else {
        this.success();
      }
    }
}
ModalRegisterEmail.MODES = MODES;
module.exports = ModalRegisterEmail;


