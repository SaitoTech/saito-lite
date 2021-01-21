const ModTemplate = require('../../lib/templates/modtemplate');
const EmailMain = require('./lib/email-main/email-main');
const EmailSidebar = require('./lib/email-sidebar/email-sidebar');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');

const AddressController = require('../../lib/ui/menu/address-controller');
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

    // Need to bind to this so it can be used in callbacks
//
// TODO - removed Dec 31
//
//    this.preferredCryptoChangeCallback = this.preferredCryptoChangeCallback.bind(this);
//    this.cacheAndRenderPreferredCryptoBalance = this.cacheAndRenderPreferredCryptoBalance.bind(this);    
//    this.preferredCryptoBalance = "loading...";

    this.mods = [];
    this.appspace = 0;	// print email-body with appspace

    this.count = 0;

    // add our address controller
    this.addrController = new AddressController(app, this.returnMenuItems());

  }



  initialize(app) {
    super.initialize(app);
    if(app.BROWSER && this.browser_active && (!app.options.email || !app.options.email.welcomesent)) {
      let mypubkey = app.wallet.returnPublicKey();
      let welcometx = app.wallet.createUnsignedTransaction(mypubkey, 0.0, 0.0);
      welcometx.msg.module   = "Email";
      welcometx.msg.title    = "Welcome to Saito";
      welcometx.msg.message  = `Saito is a high throughput blockchain. Sending a message with your transactions is both useful and reasonable!<br/><br/>
      This email was sent with your first transaction automatically.<br/><br/>
      The reward server should see that you've sent your first email and give you a reward which should also appear in your inbox.<br/><br/>
      A keypair has been generated for you. If you need more secure keys, it's possible to generate a paper wallet. However, in a Web3/Saito context it will sometimes be useful to generate keys which will be used only temporarily, perhaps to access a service for only 5 minutes or simply to set up a temporary keypair for use of some Web3 PKI infrastructure like negotiating an encrypted data tunnel or accessing web services anonymously.
      `;
      welcometx = app.wallet.signAndEncryptTransaction(welcometx);
      app.network.propagateTransaction(welcometx);
      
      // save welcomesent to options so we dont' send this over and over
      // todo: Could this just be done in installModule instead??
      if(!app.options.email){
        app.options.email = {};  
      }
      app.options.email.welcomesent = true;
      app.storage.saveOptions();

      
    }

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
    if(app.BROWSER != 1 || this.browser_active != 1 ) {return;}
    super.render(app);

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
//
// DEC 30 --- disabled as part of preferred module cleanup
//
//    this.app.wallet.subscribeToPreferredCryptoChangeEvent(this.preferredCryptoChangeCallback);
//    this.app.wallet.subscribeToPreferredCryptoBalanceChangeEvent(this.cacheAndRenderPreferredCryptoBalance);
//    this.cacheAndRenderPreferredCryptoBalance();
    
    window.addEventListener("hashchange", () => {
      this.rerender(app);
    });
    // set the hash to match the state we want and force a hashchange event
    let oldHash = window.location.hash;
    window.location.hash = `#`;
    window.location.hash = app.browser.initializeHash("#page=email_list&subpage=inbox", oldHash, {ready: "0"});
    
    
    // // make visible
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
      if (where[k].returnSignature() == tx.returnSignature()) {
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
    this.preferredCryptoBalance = "loading...";
    this.app.wallet.returnPreferredCryptoBalance().then((value) => {
      this.preferredCryptoBalance = value;
      this.renderBalance();
    });
    this.renderBalance();
  }
  async renderBalance() {
    if (document.getElementById("email-token")) { /// might not have rendered yet, no problem.
      document.getElementById("email-token").innerHTML = " " + this.app.wallet.returnPreferredCryptoTicker();
      document.getElementById("email-balance").innerHTML = await this.app.wallet.returnPreferredCryptoBalance();
    }
  }
  preferredCryptoChangeCallback() {
//
// TODO - removed Dec 30 
//
//    this.app.wallet.unsubscribeFromPreferredCryptoBalanceChangeEvent(this.cacheAndRenderPreferredCryptoBalance);
//    this.app.wallet.subscribeToPreferredCryptoBalanceChangeEvent(this.cacheAndRenderPreferredCryptoBalance);
//    this.cacheAndRenderPreferredCryptoBalance();
  }
}

module.exports = Email;
