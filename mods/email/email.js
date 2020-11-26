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

    this.chat = null;
    this.events = ['chat-render-request'];
    this.icon_fa = "fas fa-wallet";

    this.header = new SaitoHeader(app);

    this.emails = {};
    this.emails.inbox = [];
    this.emails.sent = [];
    this.emails.trash = [];

    this.mods = [];
    this.header_title = "";

    // is this.appspace needed??? 
    this.appspace = 0;	// print email-body with appspace

//    this.uidata = {};
//    this.uidata.mods = [];
    this.count = 0;

    // add our address controller
    this.addrController = new AddressController(app, this.returnMenuItems());

  }

  render(app) {
    console.log("Email Render");
    super.render(app);

    let html = `
      <div id="content">
        <div class="email-container main">
          <div class="email-sidebar"></div>
          <div class="email-main"></div>
        </div>
      </div>
    `;
    app.browser.addElementToDom(html);

    this.header.render(app, this);
    this.header.attachEvents(app, this);
    
    this.renderSidebar(app);
    this.renderMain(app);
    
    // make visible
    document.getElementById('content').style.visibility = "visible";

    console.log("TODO - fark mode in email is cross-module");
    if (getPreference('darkmode')) { addStyleSheet("/forum/dark.css"); }

/***
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
***/
  }
  renderSidebar(app) {
    EmailSidebar.render(app, this);
    EmailSidebar.attachEvents(app, this);

  }
  renderMain(app) {
    EmailMain.render(app, this);
    EmailMain.attachEvents(app, this);
  }
  // TODO WRITE COMMENT HERE
  goToPage(page, subPage) {
    this.stateStack.push(window.location.hash);
    window.location.hash = `#loc=${page}|${subPage}`;
  }
  goBack() {
    
  }
  locationErrorFallback(){
    // error. Reset state and return to inbox.
    window.location.hash = `#page=email_list&subpage=inbox`;
  }
  parseHash(hash) {
    return hash.substr(1).split('&').reduce(function (result, item) {
      var parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {});
  }
  initialize(app) {
    super.initialize(app);
    if(app.BROWSER && this.browser_active) {
      console.log("email initilaize");
      //
      // add an email
      //
      let tx = app.wallet.createUnsignedTransaction();
      tx.msg.module = "Email";
      tx.msg.title = "Sent Message Folder";
      tx.msg.message = "This folder is where your sent messages are stored...";
      tx = this.app.wallet.signTransaction(tx);
      this.emails.sent.push(tx);
      
      window.addEventListener("hashchange", () => {

        if (this.parseHash(window.location.hash).selectedemail) {
          let selected_email = this.emails[subPage].filter(tx => {
              return tx.transaction.sig === this.parseHash(window.location.hash).selectedemail
          })[0];
          this.header_title = selected_email.msg.title;
        } else if(this.parseHash(window.location.hash).subpage) {
          this.header_title = this.parseHash(window.location.hash).subpage;  
        } else if(this.parseHash(window.location.hash).page === "email_form") {
          this.header_title = "Compose Email";
        }
        
        // document.querySelector('.email-navigator-item, .email-apps-item, .crypto-apps-item').forEach((elem, i) => {
        //   if (elem.classList.contains("active-navigator-item")) {
        //     elem.classList.remove("active-navigator-item");
        //   } 
        //   if(elem.)
        //     item2.classList.remove("active-navigator-item");
        //     e.currentTarget.classList.add("active-navigator-item");
        // });
        
        this.renderSidebar(app);
        this.renderMain(app);
      });
      // set the hash to match the state we want and force a hashchange event
      let oldHash = window.location.hash;
      window.location.hash = `#`;
      window.location.hash = oldHash;
    }

  }


/****
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
****/






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

      EmailList.render(this.app, this);
      EmailList.attachEvents(this.app, this);

      this.addrController.fetchIdentifiers(keys);

    });


    //EmailList.render(this.app, this);
    //EmailList.attachEvents(this.app, this);

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
          window.location.hash = `#page=email_form&toaddress=${address}`;
          // this.previous_state = this.active;
          // this.active = "email_form";
          // 
          // this.main.render(this.app, this.uidata);
          // this.main.attachEvents(this.app, this.uidata);

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
