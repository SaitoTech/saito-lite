const SaitoHeaderTemplate = require('./templates/saito-header.template');

class SaitoHeader {

    constructor(app) {
      this.app = app;
    };
      

    render(app, mod) {

      if (!document.getElementById("saito-header")) { app.browser.addElementToDom(SaitoHeaderTemplate(app)); }

      this.renderPhoto(app, mod);
      this.renderBalance(app, mod);
      this.renderUsername(app, mod);
      this.renderSideInMenu(app, mod);

      //
      // TODO move events into render functions
      //
      this.attachEvents(app, mod);

    }

    renderPhoto(app, mod) {
      document.getElementById("header-profile-photo").src = app.keys.returnIdenticon(app.wallet.returnPublicKey());
    }

    async renderBalance(app, mod) {
      document.getElementById("header-balance").innerHTML = (await app.wallet.returnCryptoBalance() + " " + app.wallet.returnPreferredCrypto());
    }

    renderUsername(app, mod) {
      document.getElementById("header-username").innerHTML = app.keys.returnUsername(app.wallet.returnPublicKey());
    }

    renderSideMenu(app, mod) {

      let html = '';

      let show_backup  = 1;
      let show_restore = 1;
      let show_myqrcode  = 0;
      let show_qrcode  = 0;
      let show_settings  = 1;

      html = `
        <div id="settings-dropdown" class="header-dropdown">
          <div class="personal-info">
            <img class="profile-photo" />
            <div class="account-info">
              <div class="profile-identifier">anonymous account</div>
              <div class="profile-public-key"></div>
            </div>
          </div>
          <center><hr width="98%" style="color:#888"/></center>
          <div class="wallet-actions">
            <div class="wallet-action-row" id="header-dropdown-backup-wallet">
              <span class="scan-qr-info"><i class="settings-fas-icon fas fa-copy"></i> Backup Access Keys</span>
            </div>
            <div class="wallet-action-row" id="header-dropdown-restore-wallet">
              <span class="scan-qr-info"><i class="settings-fas-icon fas fa-redo"></i> Restore Access Keys</span>
            </div>
            <div class="wallet-action-row" id="header-dropdown-settings">
              <span class="scan-qr-info"><i class="settings-fas-icon fas fa-wrench"></i> Settings </span>
            </div>
            <div class="wallet-action-row" id="header-dropdown-scan-qr">
              <span class="scan-qr-info"><i class="settings-fas-icon fas fa-qrcode"></i> Scan </span>
            </div>
          </div>
        </div>
      `;

       return html;

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

      if (document.getElementById('navigator')) {
         document.getElementById('navigator').onclick = () => {
           let dropdown = document.getElementById('modules-dropdown');
           dropdown.toggleClass('show-right-sidebar');
         };
      }

      if (document.getElementById('header-mini-wallet')) {
        document.getElementById('header-mini-wallet').onclick = () => {
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
      
      if (document.querySelector('.manage-account')) {
        document.querySelector('.manage-account').onclick = () => {
          window.location = '/wallet/?module=settings';
        }
      }
    }


/***

    renderDropdown(app, mod) {

      let ifaces = app.modules.requestInterfaces("header-dropdown");
      ifaces.forEach((iface) => {
        iface.link = (iface.browser_active === 1) ? "javascript:void(0)" : "/" + iface.name.toLowerCase();
        iface.css_classes = (iface.browser_active === 1) ? "header-icon-disabled" : "";
      });

console.log("rendering dropdown");
      // update the HTML with stuff...
      //this.state.pubkey = app.wallet.returnPublicKey();
      //this.state.profilePhoto = app.keys.returnIdenticon(this.state.pubkey);
      //this.state.publicId = app.keys.returnIdentifierByPublicKey(this.state.pubkey);

    }
***/


}

module.exports = SaitoHeader

