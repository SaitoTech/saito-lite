const SaitoHeaderTemplate = require('./saito-header.template');
const SaitoHeaderIconTemplate = require('./saito-header-icon.template');
const HeaderDropdownTemplate = require('./header-dropdown.template');
const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');

function includeHTML(state) {
  var z, i, elmnt, file, xhttp, type;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("dev-include-html");
    if (file) {
      type = elmnt.hasAttribute("include-type");
      if(type) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              let state = state[type];
              elmnt.innerHTML = eval("`" + this.responseText + "`");
            }
            if (this.status == 404) {
              elmnt.innerHTML = "Page not found.";
            }
            elemt.removeAttribute("include-type");
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
      } else {
        console.log("doens't has attribute")
      }  
    }
  }
}

// function injectHTML() {
//   var z, i, elmnt, file, xhttp;
//   /* Loop through a collection of all HTML elements: */
//   z = document.getElementsByTagName("*");
//   for (i = 0; i < z.length; i++) {
//     elmnt = z[i];
//     /*search for elements with a certain atrribute:*/
//     file = elmnt.getAttribute("include-html");
//     if (file) {
//       /* Make an HTTP request using the attribute value as the file name: */
//       console.log("injectHTML")
//       console.log(file)
// 
// 
//       xhttp.open("GET", file, true);
//       xhttp.send();
//       /* Exit the function: */
//       return;
//     }
//   }
//   // fs.readFile(__dirname + '/web/txid', null, function (err, data) {
//   //   if (err) {
//   //     throw err;
//   //   } else {
//   // 
//   //   }
//   // });
// }

class SaitoHeader {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {
      if (document.querySelector("#saito-header")) {
        let header = document.querySelector("#saito-header");
        if(header) {
          // let ifaces = {};
          // app.modules.mods[i].respondTo("header-dropdown").forEach((mod, i) => {
          //   ifaces.append({
          //     link: (mod.browser_active === 1) ? "javascript:void(0)" : "/" + mod.name.toLowerCase(),
          //     css_classes: (mod.browser_active === 1) ? "header-icon-disabled" : "",
          //     name: mod.appname ? mod.appname : mod.name,
          //     icon_fa: mod.icon_fa,
          //     browser_active: mod.browser_active,
          //     slug: mod.returnSlug()
          //   })
          // });
          // 
          
          
          let ifaces = app.modules.requestInterfaces("header-dropdown");
          ifaces.forEach((iface) => {
            iface.link = (iface.browser_active === 1) ? "javascript:void(0)" : "/" + iface.name.toLowerCase();
            iface.css_classes = (iface.browser_active === 1) ? "header-icon-disabled" : "";
          });
          
          
          header.innerHTML = SaitoHeaderTemplate(ifaces);
          header.append(
            app.browser.htmlToElement(HeaderDropdownTemplate(ifaces))
          );
          header.append(
            app.browser.htmlToElement(HeaderSettingsDropdownTemplate(app))
          );
        }
      }
    }

    attachEvents(app, game_mod) {
      console.log("saitoheader attachevents");
      
      
      
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
        if (e.target.id !== "navigator") {
          document.getElementById('modules-dropdown').classList.remove('show-right-sidebar');
        }
        
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
        if (e.target.id !== "navigator") {
          document.getElementById('modules-dropdown').classList.remove('show-right-sidebar');
        }
        
        if (e.target.id !== "settings") {
          document.getElementById('settings-dropdown').classList.remove('show-right-sidebar');
        }
      });
      
    }

}

module.exports = SaitoHeader

