const SaitoHeaderTemplate = require('./templates/saito-header.template');
const UIModTemplate = require('./../../../templates/uimodtemplate');
const SideMenu = require('./lib/side-menu')
class SaitoHeader extends UIModTemplate {

  constructor(app) {
    super(app);
    //
    // respond to which events
    //
    this.events = ['chat-render-request'];
    this.name = "SaitoHeader UIComponent";
    this.app = app;
    if(app.BROWSER) {
      this.sideMenu = new SideMenu(app);
    }
    //
    // now initialize, since UI components are created
    // after all other modules have initialized, we need
    // to run any missed functions here in the constructor
    // in this case, initialize, as that is what processes
    // receiveEvent, etc.
    super.initialize(app);
  }
  initialize() {
    
  }
  render(app, mod) {
    if (!document.getElementById("saito-header")) { app.browser.addElementToDom(SaitoHeaderTemplate(app)); }

    this.renderKey(app, mod);
    this.renderPhoto(app, mod);
    this.renderUsername(app, mod);
    this.sideMenu.render(app, mod);
    app.wallet.subscribeToPreferredCryptoBalanceChangeEvent(this.renderBalance);
    app.wallet.subscribeToPreferredCryptoChangeEvent(() => {
      app.wallet.subscribeToPreferredCryptoBalanceChangeEvent(this.renderBalance);
      this.renderBalance();
    });
    this.renderBalance();
    //
    // TODO move events into render functions
    //
    this.attachEvents(app, mod);
  }

  renderKey(app, mod) {
    document.getElementById("profile-public-key").innerHTML = app.wallet.returnPublicKey();
  }

  renderPhoto(app, mod) {
    document.getElementById("header-profile-photo").src = app.keys.returnIdenticon(app.wallet.returnPublicKey());
  }

  async renderBalance() {
    document.getElementById("header-token").innerHTML = " " + this.app.wallet.getPreferredCryptoTicker();
    document.getElementById("header-balance").innerHTML = "loading...";
    document.getElementById("header-balance").innerHTML = await this.app.wallet.getPreferredCryptoBalance();
  }

  renderUsername(app, mod) {
    let username = app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey());
    if (username == "" || username == app.wallet.returnPublicKey()) { username = "Anonymous Account"; }
    document.getElementById("header-username").innerHTML = username;
  }

  receiveEvent(type, data) {
    if (type == 'chat-render-request') {
      console.log("Header Component processing chat-render-request in " + this.name);
    }
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

    // if (document.getElementById('header-dropdown-myqrcode')) {
    //   document.getElementById('header-dropdown-myqrcode').onclick = () => {
    //     if (is_email_mod_active == 1) {
    //       let elements = document.getElementsByClassName("email-apps-item");
    //       for (let i = 0; i < elements.length; i++) {
    //         if (elements[i].innerHTML === "MyQRCode") {
    //           elements[i].click();
    //         }
    //       }
    //     } else {
    //       window.location = '/wallet/?module=myqrcode';
    //     }
    //   };
    // }

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
          window.location = '/wallet/#page=email_appspace&subpage=Profile';
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
          window.location = '/wallet/#page=email_appspace&subpage=Settings';
        }
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
        window.location = '/wallet/#page=email_appspace&subpage=Settings';
      }
    }
  }
}

module.exports = SaitoHeader

