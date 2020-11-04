const SaitoHeaderTemplate = require('./templates/saito-header.template');

class SaitoHeader {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {

      let ifaces = app.modules.requestInterfaces("header-dropdown");
      ifaces.forEach((iface) => {
        iface.link = (iface.browser_active === 1) ? "javascript:void(0)" : "/" + iface.name.toLowerCase();
        iface.css_classes = (iface.browser_active === 1) ? "header-icon-disabled" : "";
      });
          
      if (!document.getElementById("saito-header")) { app.browser.addElementToDom(SaitoHeaderTemplate(app, mod, ifaces)); }

    }


    attachEvents(app, mod) {

      let is_email_mod_active = 0;
      let is_qr_scanner_active = 0;
      for (let i = 0; i < app.modules.mods.length; i++) {
        if (app.modules.mods[i].name == "Email" && app.modules.mods[i].browser_active == 1) {
          is_email_mod_active = 1;
        }
        if (app.modules.mods[i].name == "QRScanner") {
          is_qr_scanner_active = 1;
        }
      }
      
      if (document.getElementById('settings')) {
        document.getElementById('settings').onclick = () => {
          let dropdown = document.getElementById('settings-dropdown');
          dropdown.toggleClass('show-right-sidebar');
        };
      }
      
      if (document.getElementById('header-dropdown-myqrcode')) {
        document.getElementById('header-dropdown-myqrcode').onclick = () => {
          if (is_email_mod_active == 1) {
            let elements = document.getElementsByClassName("email-apps-item");
            for (let i = 0; i < elements.length; i++) {
              if (elements[i].innerHTML === "MyQRCode") {
                elements[i].click();
              }
            }
          } else {
            window.location = '/wallet/?module=myqrcode';
          }
        };
      }
      
      if (document.getElementById('header-dropdown-scan-qr')) {
        document.getElementById('header-dropdown-scan-qr').onclick = () => {
          if (is_qr_scanner_active == 1) {
            let qrscanner = app.modules.returnModule("QRScanner");
            qrscanner.startScanner();
          } else {
            salert("QR Scanner not installed or disabled");
          }
        };
      }
      
      if (document.getElementById('header-dropdown-my-profile')) {
        document.getElementById('header-dropdown-my-profile').onclick = () => {
          if (is_email_mod_active == 1) {
            let elements = document.getElementsByClassName("email-apps-item");
            for (let i = 0; i < elements.length; i++) {
              if (elements[i].innerHTML === "Profile") {
                elements[i].click();
              }
            }
          } else {
            window.location = '/wallet/?module=profile';
          }
        };
      }
      
      if (document.getElementById('header-dropdown-add-contacts')) {
        document.getElementById('header-dropdown-add-contacts').onclick = () => {
          let t = app.modules.returnModule("Tutorial");
          if (t) { t.inviteFriendsModal(); }
        };
      }
      
      if (document.getElementById('header-dropdown-reset-wallet')) {
        document.getElementById('header-dropdown-reset-wallet').onclick = () => {
          app.wallet.resetWallet();
        };
      }
      
      if (document.getElementById('header-dropdown-backup-wallet')) {
        document.getElementById('header-dropdown-backup-wallet').onclick = () => {
          app.wallet.backupWallet();
        };
      }
      
      if (document.getElementById('header-dropdown-settings')) {
        document.getElementById('header-dropdown-settings').onclick = () => {
          if (is_email_mod_active == 1) {
            let elements = document.getElementsByClassName("email-apps-item");
            for (let i = 0; i < elements.length; i++) {
              if (elements[i].innerHTML === "Settings") {
                elements[i].click();
              }
            }
          } else {
            window.location = '/wallet/?module=settings';
          }
        };
      }
      
      
      if (document.getElementById('header-dropdown-backup-wallet')) {
        document.getElementById('header-dropdown-backup-wallet').onclick = () => {
          app.wallet.backupWallet();
        };
      }
      
      
      if (document.getElementById('header-dropdown-restore-wallet')) {
        document.getElementById('header-dropdown-restore-wallet').addEventListener('click', async (e) => {
          
          let privatekey = "";
          let publickey = "";
          
          try {
            
            privatekey = await sprompt("Enter Private Key:");
            
            if (privatekey != "") {
              publickey = app.crypto.returnPublicKey(privatekey);
              
              app.wallet.wallet.privatekey = privatekey;
              app.wallet.wallet.publickey = publickey;
              app.wallet.wallet.inputs = [];
              app.wallet.wallet.outputs = [];
              app.wallet.wallet.spends = [];
              app.wallet.wallet.pending = [];
              
              await app.wallet.saveWallet();
              window.location.reload();
            }
          } catch (e) {
            salert("Restore Private Key ERROR: " + e);
            console.log("Restore Private Key ERROR: " + e);
          }
        });
      }
      
      window.addEventListener('click', (e) => {
        if (e.target.id !== "settings") {
          document.getElementById('settings-dropdown').classList.remove('show-right-sidebar');
        }
      });
      
      if (document.querySelector('.manage-account')) {
        document.querySelector('.manage-account').onclick = () => {
          window.location = '/wallet/?module=settings';
        }
      }
      
      /**** LOAD WALLET        
      if (document.getElementById('.header-dropdown-load-wallet')) {
        document.getElementById('.header-dropdown-load-wallet').onclick = () => {
          window.location = '/wallet/?module=settings';
        }
      }
      *****/
      
      window.addEventListener('click', (e) => {
        if (e.target.id !== "settings") {
          document.getElementById('settings-dropdown').classList.remove('show-right-sidebar');
        }
      });
      
    }

}

module.exports = SaitoHeader

