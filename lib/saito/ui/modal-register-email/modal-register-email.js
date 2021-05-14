const ModalRegisterEmailTemplate = require('./modal-register-email.template');
const SaitoOverlay = require('../saito-overlay/saito-overlay');
const saito = require('../../saito');

const MODES = {
  "NEWSLETTER": 0,
  "PRIVATESALE": 1,
  "REGISTEREMAIL": 2,
  "BACKUP": 3,
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

      document.querySelectorAll('.tutorial-skip').forEach( el => {
        el.onclick = () => {
          this.modal_overlay_email.hideOverlay();
        }
      });

      document.querySelectorAll('#registry-input').forEach( el => {
        el.onclick = () => {
          document.querySelector('#registry-input').setAttribute("placeholder", "");
        }
      });

      document.querySelectorAll('#backup-email-button').forEach( el => {
        el.onclick = () => {
          let submitted_email = document.querySelector("#registry-input").value;
          let subscribe_newsletter = document.querySelector("#signup") && document.querySelector("#signup").checked;
          if(this.mode === MODES.NEWSLETTER) {
            this.doNewsletterSignup(app, mod, submitted_email);
          } else if(this.mode === MODES.PRIVATESALE) {
            this.doPrivateSaleSignup(app, mod, submitted_email, subscribe_newsletter);
          } else if(this.mode === MODES.REGISTEREMAIL) {
            this.doRegisterEmail(app, mod, submitted_email, subscribe_newsletter);
          } else if(this.mode === MODES.BACKUP) {
            // TODO: This mode doesnt' actually work. I think it's possible to
            // leverage mailrelay.js to maybe make this work...
            this.doEmailBackup(app, mod, submitted_email, subscribe_newsletter);
          } else {
            throw "No such mode: " + this.mode;
          }
          this.modal_overlay_email.hideOverlay();
          salert("Thanks for signing up!");
        }
      });
    }
    validateEmail(submitted_email) {
      //
      // regexp to identify email addresses
      //
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(submitted_email).toLowerCase()) || submitted_email === "email@domain.com") {
        salert("Invalid email address!");
        return false;
      };
      return true;
    }
    sendServiceRequest(submitted_email, request_type) {
      tx = new saito.transaction();
      tx.msg = {
        key: this.app.wallet.returnPublicKey(),
        email: submitted_email,
        time: Date.now()
      };
      this.app.modules.returnActiveModule().sendPeerRequestWithServiceFilter(
        "emailcollector",
        {
          request: request_type,
          data: tx
        },
        (rows) => {
          document.querySelector(".arcade-sidebar-done").innerHTML = "";
          rows.forEach(row => {
            if (typeof (row.label) != "undefined" || typeof (row.icon) != "undefined") {
              document.querySelector(".arcade-sidebar-done").innerHTML += RewardsSidebarRow(row.label, row.icon, row.count);
            }
          });
        },
        
      );
    }
    doRegisterEmail(app, mod, submitted_email, subscribe_newsletter) {
      if(!this.validateEmail(submitted_email)) { return; }
      app.keys.updateEmail(app.wallet.returnPublicKey(), submitted_email);
      if(subscribe_newsletter) {
        this.doNewsletterSignup(app, mod, submitted_email);
      }
      window.location.reload();
    }
    doEmailBackup(app, mod, submitted_email, subscribe_newsletter) {
      if(!this.validateEmail(submitted_email)) { return; }
      // TODO: send an email to the user here with their wallet...
      app.keys.updateEmail(app.wallet.returnPublicKey(), submitted_email);
      if(subscribe_newsletter) {
        this.doNewsletterSignup(app, mod, submitted_email);
      }
    }
    doPrivateSaleSignup(app, mod, submitted_email, subscribe_newsletter) {
      if(!this.validateEmail(submitted_email)) { return; }
      this.sendServiceRequest(submitted_email, "public sale signup");
      if(subscribe_newsletter) {
        this.doNewsletterSignup(app, mod, submitted_email);
      }
    }
    doNewsletterSignup(app, mod, submitted_email) {
      if(!this.validateEmail(submitted_email)) { return; }
      this.sendServiceRequest(submitted_email, "newsletter signup");
    }
}
ModalRegisterEmail.MODES = MODES;
module.exports = ModalRegisterEmail;


