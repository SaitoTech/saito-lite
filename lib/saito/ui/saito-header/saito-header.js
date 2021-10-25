const SaitoHeaderTemplate = require('./templates/saito-header.template');
const UIModTemplate = require('./../../../templates/uimodtemplate');
const SideMenu = require('./lib/side-menu');
const TextSizer = require('./lib/text-sizer');

class SaitoHeader extends UIModTemplate {

  constructor(app) {
    super(app);

    //
    // respond to which events
    //
    // demo example of ui components responding to events
    //
    //this.events = ['chat-render-request'];
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
    //
    this.initialize(app);

  }

  initialize(app) {

    super.initialize(app);

    app.connection.on('update_balance', (wallet) => { this.renderCrypto(app,this); });
    app.connection.on('update_identifier', (key) => { this.renderUsername(app, this); });
    app.connection.on('update_email',      (key) => { this.sideMenu.render(app,this); });
    app.connection.on("set_preferred_crypto", (data) => { this.renderCrypto(app, this); });


  }


  updateIdentifier(app) {
    try {
      let identifier = this.app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey());
      if (identifier == app.wallet.returnPublicKey() || identifier == "") {
      } else {
        document.getElementById("header-username").innerHTML = identifier;
      }
    } catch (err) {
    }
  }

  async loadBalance(cryptoMod) {
    try {
      let balance = await cryptoMod.formatBalance();
      let innerText = balance + " " + cryptoMod.ticker;
      document.querySelector(`#crypto-option-${cryptoMod.name}`).innerHTML = innerText;
    } catch (err) {
      console.log(err);
    }
  }
  render(app, mod) {
    try {
      //
      // UI component (modules) will show up sometimes if they're in the mod list
      // but in those cases mod will be undefined, so we can work-around the problem
      // by only rendering if there is a module here...
      //
      if (mod == null) { return; }

      if (!document.getElementById("saito-header")) { app.browser.addElementToDom(SaitoHeaderTemplate(app)); }

      this.renderPhoto(app, mod);
      this.renderUsername(app, mod);
      this.renderCrypto(app, mod);
      this.sideMenu.render(app, mod);
      TextSizer.render(app, mod);
      TextSizer.attachEvents(app, mod);

      this.attachEvents(app, mod);
    } catch (err) {

    }
  }

  async renderCrypto() {
    try {

      const available_cryptos = this.app.wallet.returnAvailableCryptos();
      const preferred_crypto = this.app.wallet.returnPreferredCrypto();  
    
      document.getElementById("profile-public-key").innerHTML = await this.app.wallet.returnPreferredCrypto().returnAddress();
      document.querySelector("#header-token-select").innerHTML = "";
      
      const html = `<option id="crypto-option-${preferred_crypto.name}" value="${preferred_crypto.ticker}">... ${preferred_crypto.ticker}</option>`;
      this.app.browser.addElementToElement(html, document.querySelector("#header-token-select"));
      this.loadBalance(preferred_crypto);

      //
      // add other options
      //
      for (let i = 0; i < available_cryptos.length; i++) {
        const crypto_mod = available_cryptos[i];
        if (crypto_mod.name != preferred_crypto.name) {
          const html = `<option id="crypto-option-${crypto_mod.name}" value="${crypto_mod.ticker}">... ${crypto_mod.ticker}</option>`;
          this.app.browser.addElementToElement(html, document.querySelector("#header-token-select"));
          this.loadBalance(available_cryptos[i]);  
        }
      }

      //
      // add final option (add new crypto)
      //
      const add_other_cryptos_html = `<option id="crypto-option-add-new" value="add-new">install new crypto...</option>`;
      this.app.browser.addElementToElement(add_other_cryptos_html, document.querySelector("#header-token-select"));  

      //
      // trigger select modal
      //
      let modal_select_crypto = new ModalSelectCrypto(app, preferred_crypto);
      modal_select_crypto.render(app, preferred_crypto);
      modal_select_crypto.attachEvents(app, preferred_crypto);

    } catch (err) {
    }

  }

  renderPhoto(app, mod) {
    try {
      document.getElementById("header-profile-photo").src = app.keys.returnIdenticon(app.wallet.returnPublicKey());
    } catch (err) {

    }
  }

  renderUsername(app, mod) {
    try {
      let username = app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey());
      if (username == "" || username == app.wallet.returnPublicKey()) { username = "Anonymous Account"; }
      document.getElementById("header-username").innerHTML = username;
    } catch (err) {

    }
  }

  receiveEvent(type, data) {
    if (type == 'chat-render-request') {
      //console.log("Header Component processing chat-render-request in " + this.name);
    }
  }


  attachEvents(app, mod) {

    if (!document) { return; }

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
    
    document.querySelectorAll('#header-logo-link').forEach((element) => {
      element.onclick = (event) => {
        let activeModule = app.modules.returnActiveModule();
        if(activeModule) {
          app.browser.logMatomoEvent("Navigation", `${activeModule.name}HeaderNavigationClick`, "HeaderLogoHomepageLink");  
        } else {
          app.browser.logMatomoEvent("Navigation", `UnknownModuleHeaderNavigationClick`, "HeaderLogoHomepageLink");  
          console.log("Error: No active module");
        }
      }
    });
    document.querySelectorAll("#profile-public-key").forEach((element, i) => {
      element.onmouseup = () => {
        var selObj = window.getSelection();
        if(selObj.toString() === element.innerHTML && element.innerHTML != "copied...") { // The user has selected this element
          document.execCommand("copy");
          let oldVal = element.innerHTML;
          element.innerHTML = "Copied"
          setTimeout(() => {
            element.innerHTML = oldVal;
          }, 300);
        }
      }
    });
    document.querySelectorAll('#header-token-select').forEach((element, i) => {
      element.onchange = (value) => {
        if (element.value === "add-new") {

          let current_default = this.app.wallet.returnPreferredCrypto();
          let select_box = document.querySelector('#header-token-select');
          select_box.value = current_default.name;;

          let appstore_mod = app.modules.returnModule("AppStore");
          if (appstore_mod) {
            let options = { search : "" , category : "Cryptocurrency" , featured : 1 };
            appstore_mod.openAppstoreOverlay(options);
          } else {
            salert("We cannot install additional cryptocurrencies without AppStore installed!");
          }
          return;
        }

        app.wallet.setPreferredCrypto(element.value, 1);
      }
    });
    
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
    
    if (document.getElementById('header-dropdown-faucet')) {
      document.getElementById('header-dropdown-faucet').onclick = () => {
        let newtx = app.wallet.createUnsignedTransaction(app.wallet.returnPublicKey(), 0.0);
        newtx.msg.module = "Reward";
        newtx.msg.action = "faucet";
        newtx = app.wallet.signTransaction(newtx);
        app.network.propagateTransaction(newtx);
        salert("Faucet request sent.<br/><br/><i>(Faucet will only pay once every 24 hours)<i/>");
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
      document.getElementById('header-dropdown-restore-wallet').onclick = async(e) => {
        
        document.getElementById('saito-header-file-input').addEventListener('change', function(e) {
          let file = e.target.files[0];
          app.wallet.restoreWallet(file);
        });
        document.querySelector('#saito-header-file-input').click();
      };

      //document.getElementById('header-dropdown-restore-wallet').addEventListener('click', async (e) => {
      //
      //  let privatekey = "";
      //  let publickey = "";
      //
      //  try {
      //
      //    privatekey = await sprompt("Enter Private Key:");
      //
      //    if (privatekey != "") {
      //      publickey = app.crypto.returnPublicKey(privatekey);
      //
      //      app.wallet.wallet.privatekey = privatekey;
      //      app.wallet.wallet.publickey = publickey;
      //      app.wallet.wallet.inputs = [];
      //      app.wallet.wallet.outputs = [];
      //      app.wallet.wallet.spends = [];
      //      app.wallet.wallet.pending = [];
      //
      //      await app.wallet.saveWallet();
      //      window.location.reload();
      //    }
      //  } catch (e) {
      //    salert("Restore Private Key ERROR: " + e);
      //    console.log("Restore Private Key ERROR: " + e);
      //  }
      //});


    }

    if (document.querySelector('.manage-account')) {
      document.querySelector('.manage-account').onclick = () => {
        window.location = '/wallet/#page=email_appspace&subpage=Settings';
      }
    }
  }
}

module.exports = SaitoHeader

