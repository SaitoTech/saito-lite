const SaitoHeaderTemplate = require('./templates/saito-header.template');

class SaitoHeader {

    constructor(app) {
      this.app = app;
      this.state = {
        ifaces: [],
        pubkey: "",
        profilePhoto: "",
        publicId: "",
      };
      
      this.state.ifaces = app.modules.requestInterfaces("header-dropdown");
      this.state.ifaces.forEach((iface) => {
        iface.link = (iface.browser_active === 1) ? "javascript:void(0)" : "/" + iface.name.toLowerCase();
        iface.css_classes = (iface.browser_active === 1) ? "header-icon-disabled" : "";
      });
      this.state.pubkey = app.wallet.returnPublicKey();
      this.state.profilePhoto = app.keys.returnIdenticon(this.state.pubkey);
      this.state.publicId = app.keys.returnIdentifierByPublicKey(this.state.pubkey);
    }

    render(app, mod) {

      newSaitoHeaderDiv = app.browser.makeElement("div", "saito-header", "header header-home");
      newSaitoHeaderDiv.innerHTML = SaitoHeaderTemplate(app, mod, this.state);

console.log("THIS iS OUR DIV: " + newSaitoHeaderDiv.innerHTML);
      
      let saitoHeaderDiv = document.getElementById("saito-header");
      if (saitoHeaderDiv) {
        saitoHeaderDiv.replaceWith(newSaitoHeaderDiv);
      } else {
        app.browser.prependElementToDom(newSaitoHeaderDiv, document.body);
      }

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

      if (!this.state.publicId) {
        let registryModule = app.modules.returnModule('Registry');
        if(registryModule) {
          document.querySelector('.profile-identifier').onclick = async () => {
            try {
              this.state.publicId = await registryModule.requestInterface("do-registry-prompt").doRegistryPrompt();
              this.render(app, mod);
            } catch(err) {
              salert("Unknwown error. " + err);
            }
          }  
        }
        
      } 
      // if (app.keys.returnIdentifierByPublicKey(my_publickey)) {
      //     id = app.keys.returnIdentifierByPublicKey(my_publickey);
      // } else {
      //     document.querySelector('.profile-identifier')
      //             .onclick = async () => {
      //                 document.getElementById('settings-dropdown').classList.add('show-right-sidebar-hard');
      
      //                 var requested_id = await sprompt("Pick a handle or nickname. <br /><sub>Alphanumeric characters only - Do not include an @</sub.>");
      //                 let register_success = app.modules.returnModule('Registry').registerIdentifier(requested_id);
      //                 if (register_success) {
      //                     id = `"${requested_id}@saito" requested.`;
      //                     document.getElementById('settings-dropdown').classList.remove('show-right-sidebar-hard');
      //                     document.getElementById('settings-dropdown').classList.add('show-right-sidebar');
      //                     document.querySelector('.profile-identifier').innerHTML = id;
      //                 }
      //             };
      // }
      
      
      
      
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
    attachEvents(app, mod) {
    }

}

module.exports = SaitoHeader
