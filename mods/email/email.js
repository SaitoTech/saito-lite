const ModTemplate = require('../../lib/templates/modtemplate');
const EmailMain = require('./lib/email-main/email-main');
const EmailSidebar = require('./lib/email-sidebar/email-sidebar');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');

const helpers = require('../../lib/helpers/index');


class Email extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Email";
    this.appname = "Wallet";
    this.description = "Essential wallet, messaging platform and extensible control panel for Saito applications";
    this.categories = "Core Messaging Admin Productivity Utilities";
    this.app_path = "wallet";
    this.app = app;
    this.chat = null;
    this.events = ['chat-render-request'];
    this.icon_fa = "fas fa-wallet";

    this.header = null;

    this.emails = {};
    this.emails.inbox = [];
    this.emails.sent = [];
    //this.emails.trash = [];

    this.mods = [];
    this.appspace = 0;	// print email-body with appspace

    this.count = 0;

  }

  initializeHTML(app) {
    window.addEventListener("hashchange", () => {
      this.rerender(app);
    });
    // set the hash to match the state we want and force a hashchange event
    let oldHash = window.location.hash;
    window.location.hash = `#`;
    window.location.hash = app.browser.initializeHash("#page=email_list&subpage=inbox", oldHash, {ready: "0"});

    this.app.connection.on("update_balance", async (wallet) => {
      let bobj = document.getElementById("email-balance");
      if (bobj) {
	let bal = await wallet.returnPreferredCryptoBalance();
	bobj.innerHTML = bal;
      }
    });
    if (app.BROWSER && this.browser_active && (!app.options.email || !app.options.email.welcomesent)) {

      let welcometx = app.wallet.createUnsignedTransaction();

      welcometx.msg.module   = "Email";
      welcometx.msg.title    = "Welcome to Saito";
      welcometx.msg.message  = `Saito is a network that runs blockchain applications in your browser!
  <br/><br/>
      We are currently under development, which mean any tokens in your account are TESTNET tokens which will disappear when the network is upgraded. If you are interested in purchasing tokens for use on the production network, please see our <a href="https://saito.io">main site</a> for instructions on how to do so. If you're curious what else you can do on Saito besides reading this message, why not check out the <a href="https://saito.io/arcade">Saito Arcade</a>?
        <br/><br/>
      Have questions? Why not join us on <a href="">Saito Telegram</a>?
      `;
      //welcometx = app.wallet.signAndEncryptTransaction(welcometx);
      this.addEmail(welcometx);
    }
  }

  initialize(app) {
    super.initialize(app);
    app.connection.on("set_preferred_crypto", (modname) => {
      this.cacheAndRenderPreferredCryptoBalance();
    });
  }
  rerender(app) {
    if(app.BROWSER != 1 || this.browser_active != 1 ) {return;}
    let page = app.browser.parseHash(window.location.hash).page;
    if (page) {
      // Render
      this.renderSidebar(app);
      this.renderMain(app);
    } else {
      this.locationErrorFallback();
    }
  }
  render(app) {
    if (app.BROWSER != 1 || this.browser_active != 1 ) {return;}
    super.render(app);

    // TODO: next week, email layout with page header
    /* 
          <div class="page-header">
            <h1 class="page-title">Wallet</h1>
            <p class="page-subtitle">Wallet demo. Transfer cryptocurrencies with messages.</p>
          </div>
    */

    let html = `
      <div id="content__">
        <div class="email-container main">
          <div class="email-sidebar"></div>
          <div class="email-main"></div>
        </div>
      </div>
    `;
    app.browser.addElementToDom(html);

    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }
    this.header.render(app, this);
    this.header.attachEvents(app, this);
    
    // this.renderMain(app);
    // this.renderSidebar(app);
    //

    //document.getElementById('content').style.visibility = "visible";

    //console.log("TODO - fark mode in email is cross-module");
    if (getPreference('darkmode')) { addStyleSheet("/forum/dark.css"); }

  }
  renderSidebar(app) {
    if(app.BROWSER != 1 || this.browser_active != 1 ) {return;}
    EmailSidebar.render(app, this);
    EmailSidebar.attachEvents(app, this);

  }
  renderMain(app) {
    if(app.BROWSER != 1 || this.browser_active != 1 ) {return;}
    EmailMain.render(app, this);
    EmailMain.attachEvents(app, this);
  }
  locationErrorFallback(msg = null, error = null){
    // error. Reset state and return to inbox.
    window.location.hash = this.goToLocation("#page=email_list&subpage=inbox");
    if(msg) {
      salert(msg);
    }
    if(error) {
      console.log(error);
      throw error;
    }
  }
  goToLocation(newHash){
    return this.app.browser.buildHashAndPreserve(newHash, window.location.hash, "ready");
  }
  getSelectedEmail(selectedemailSig, subPage){
    let selected_email = this.emails[subPage].filter(tx => {
        return tx.transaction.sig === selectedemailSig
    })[0];
    return selected_email;
  }

  respondTo(type = "") {
    if (type == "header-dropdown") {        
      return {
        name: this.appname ? this.appname : this.name,
        icon_fa: this.icon_fa,
        browser_active: this.browser_active,
        slug: this.returnSlug()
      };
    }
    return null;
  }

  deleteTransaction(tx, subPage) {
    let confirmed = sconfirm("Are you sure you want to delete these emails?");
    if(confirmed) {
      for (let i = 0; i < this.emails[subPage].length; i++) {
        let mytx = this.emails[subPage][i];
        if (mytx.transaction.sig == tx.transaction.sig) {
          this.app.storage.deleteTransaction(tx);
          this.emails[subPage].splice(i, 1);
          // this.emails['trash'].unshift(tx);
        }
      }  
    }
  }


  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }
    url = new URL(window.location.href);
    if (url.searchParams.get('module') != null) { return; }

    this.app.storage.loadTransactions("Email", 50, (txs) => {
      for (let i = 0; i < txs.length; i++) {
	txs[i].decryptMessage(app);
        this.addTransaction(txs[i]);
      }
      let readyCount = app.browser.getValueFromHashAsNumber(window.location.hash, "ready")
      window.location.hash = app.browser.modifyHash(window.location.hash, {ready: readyCount + 1});
    });
  }

  onConfirmation(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let email_mod = app.modules.returnModule("Email");
    if (conf == 0) {
      email_mod.addTransaction(tx);
    }
  }
  addTransaction(tx) {

    let publickey = this.app.wallet.returnPublicKey();
    if (tx.transaction.to[0].add == publickey) {
      this.app.storage.saveTransaction(tx);
      this.addEmail(tx);
    }
    if (tx.transaction.from[0].add == publickey) {
      this.app.storage.saveTransaction(tx);
      this.addSentEmail(tx);
    }
  }
  addToBox(tx, where) {
    for (let k = 0; k < where.length; k++) {
      if (where[k].returnSignature(this.app) == tx.returnSignature(this.app)) {
        return;
      }
    }
    where.unshift(tx);
  }

  addSentEmail(tx) {
    this.addToBox(tx, this.emails.sent);
  }
  addEmail(tx) {
    if (this.browser_active == 0) { this.showAlert(); }
    this.addToBox(tx, this.emails.inbox);
    this.render(this.app);
  }
 
  // receiveEvent(type, data) {
  //   if (type == 'chat-render-request') {
  //     if (this.browser_active) {
  //       this.renderSidebar(this.app, this.uidata);
  //     }
  //   }
  // }

  returnMenuItems() {
    // ######## TODO ######
    // make sure this works....
    return {
      'send-email': {
        name: 'Send Email',
        callback: (address) => {
          window.location.hash = this.app.browser.modifyHash(window.location.hash, {toaddres: address})
        }
      }
    }
  }

  cacheAndRenderPreferredCryptoBalance() {
    this.preferredCryptoBalance = "...";
    this.app.wallet.returnPreferredCrypto().formatBalance().then((value) => {
      this.preferredCryptoBalance = value;
      this.renderBalance();
    });
    this.renderBalance();
  }
  async renderBalance() {
    if (document.getElementById("email-token")) {
      document.getElementById("email-token").innerHTML = " " + this.app.wallet.returnPreferredCrypto().ticker;
      document.getElementById("email-balance").innerHTML = this.preferredCryptoBalance;
    }
  }
  returnAddressHTML(key) {
    let identifier = this.app.keys.returnIdentifierByPublicKey(key);
    let id = !identifier ? key : identifier
    return `<span class="saito-address saito-address-${key}">${id}</span>`
  }

  async returnAddressHTMLPromise(key) {
    let identifier = await this.returnIdentifier(key);
    let id = !identifier ? key : identifier
    return `<span class="saito-address saito-address-${key}">${id}</span>`
  }
  async returnPublicKey(addr_input) {
    if (this.app.crypto.isPublicKey(addr_input)) { return addr_input }
    try {
      var resp = await this.app.keys.fetchPublicKeyPromise(addr_input);
    } catch(err) {
      console.error(err);
    }
    if (resp.rows.length > 0) {
      let record = resp.rows[0];
      return record.publickey ? record.publickey : record;
    } else {
      console.log("response did not contain any rows...")
    }
    return null
  }
}

module.exports = Email;
