const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');
const EmailMain = require('./lib/email-main/email-main');
const EmailSidebar = require('./lib/email-sidebar/email-sidebar');

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

    this.chat = null;
    this.events = ['chat-render-request'];
    this.icon_fa = "fas fa-wallet";

    this.emails = {};
    this.emails.inbox = [];
    this.emails.sent = [];
    this.emails.trash = [];
    this.emails.active = "inbox";
    // inbox
    // outbox
    // trash

    this.mods = [];

    this.active = "email_list";
    this.header_title = "";


    this.selected_email = null;

    this.appspace = 0;	// print email-body with appspace
    this.appspace_mod = null;
    this.appspace_mod_idx = -1; // index in mods of appspace module

    this.uidata = {};
    this.uidata.mods = [];
    this.count = 0;

    // add our address controller
    this.addrController = new AddressController(app, this.returnMenuItems());

  }

  render(app, data) {
    this.renderMain(app, data);
    this.renderSidebar(app, data);
  }

  renderMain(app, data) {
    EmailMain.render(app, data);
    EmailMain.attachEvents(app, data);
  }

  renderSidebar(app, data) {
    EmailSidebar.render(app, data);
    EmailSidebar.attachEvents(app, data);
  }

  initialize(app) {

    super.initialize(app);

    //
    // add an email
    //
    
    let tx = app.wallet.createUnsignedTransaction();
    tx.msg.module = "Email";
    tx.msg.title = "Sent Message Folder";
    tx.msg.message = "This folder is where your sent messages are stored...";
    tx = this.app.wallet.signTransaction(tx);
    this.emails.sent.push(tx);

  }


  
  respondTo(type = "") {
    if (type == "header-dropdown") {
      return {};
    }
    return null;
  }
  
  requestInterface(type = "", interfaceBuilder = null) {
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

  initializeHTML(app) {

    super.initializeHTML(app);

    if(getPreference('darkmode')) {
      addStyleSheet("/forum/dark.css");
    }

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    let x = [];
    x = this.app.modules.respondTo("email-appspace");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
    }
    x = this.app.modules.respondTo("email-chat");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
    }

    this.uidata.mods = this.mods;
    this.uidata.email = this;
    this.uidata.helpers = helpers;

    this.render(app, this.uidata);

  }



  deleteTransaction(tx) {

    for (let i = 0; i < this.emails[this.emails.active].length; i++) {
      let mytx = this.emails[this.emails.active][i];
      if (mytx.transaction.sig == tx.transaction.sig) {
        this.app.storage.deleteTransaction(tx);
        this.emails[this.emails.active].splice(i, 1);
        this.emails['trash'].unshift(tx);
      }
    }

  }


  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

    //
    // leaving this here for the short term,
    // token manager can be a separate module
    // in the long-term, as the email client
    // should just handle emails
    //
    // this.getTokens();

    //
    //
    //
    url = new URL(window.location.href);
    if (url.searchParams.get('module') != null) { return; }

    this.app.storage.loadTransactions("Email", 50, (txs) => {

      let keys = [];

      for (let i = 0; i < txs.length; i++) {
        let addtx = true;
        for (let k = 0; k < this.emails.inbox.length; k++) {
          if (txs[i].returnSignature() == this.emails.inbox[k].returnSignature()) {
            addtx = false;
          }
        }
        if (addtx) {
          this.emails.inbox.push(txs[i]);
          keys.push(txs[i].transaction.from[0].add);
        }
      }

      EmailList.render(this.app, this.uidata);
      EmailList.attachEvents(this.app, this.uidata);

      this.addrController.fetchIdentifiers(keys);

    });


    //EmailList.render(this.app, this.uidata);
    //EmailList.attachEvents(this.app, this.uidata);

  }



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {

      let publickey = app.wallet.returnPublicKey();

      //
      // if transaction is for me
      //
      if (tx.transaction.to[0].add == publickey) {

        //
        // great lets save this
        //
        app.storage.saveTransaction(tx);

        //
        // and update our email client
        //
        email.addEmail(tx);
      }
    }
  }


  addEmail(tx) {
    try {
      if (this.browser_active == 0) { this.showAlert(); }
      let addtx = true;
      for (let k = 0; k < this.emails.inbox.length; k++) {
        if (this.emails.inbox[k].returnSignature() == tx.returnSignature()) {
          addtx = false;
        }
      }
      if (addtx) {
        this.emails.inbox.unshift(tx);
        this.addrController.fetchIdentifiers([tx.transaction.from[0].add]);
        if (this.browser_active) { this.renderMain(this.app, this.uidata); }
      }
    } catch (err) {
      console.error(err);
    }
  }



  receiveEvent(type, data) {
    if (type == 'chat-render-request') {
      if (this.browser_active) {
        this.renderSidebar(this.app, this.uidata);
      }
    }

  }

  returnMenuItems() {
    return {
      'send-email': {
        name: 'Send Email',
        callback: (address) => {
          this.previous_state = this.active;
          this.active = "email_form";

          this.main.render(this.app, this.uidata);
          this.main.attachEvents(this.app, this.uidata);

          document.getElementById('email-to-address').value = address;
        }
      }
    }
  }

  getTokens() {

    let msg = {};
    msg.data = { address: this.app.wallet.returnPublicKey() };
    msg.request = 'get tokens';
    setTimeout(() => {
      console.log("sending request for funds...");
      this.app.network.sendRequest(msg.request, msg.data);
    }, 1000);
  }

  updateBalance() {
    if (this.browser_active) {
      if (document.querySelector('.email-balance')) {
        let balance = this.app.wallet.returnBalance();
        document.querySelector('.email-balance').innerHTML = balance + " SAITO";
      }
    }
  }

}

module.exports = Email;
