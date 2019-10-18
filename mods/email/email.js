const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');

const EmailList = require('./lib/email-list/email-list');

class Email extends ModTemplate {

  constructor(app) {
    super(app);

    this.name = "Email";
    this.emails = [
      {
        title: "New Email",
        message: "This is a new email, just for you!",
        timestamp: new Date().getTime(),
      }
    ];
  }


  initializeHTML(app) {

    EmailList.render(this);

  }



  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    //
    // leaving this here for the short term, 
    // token manager can be a separate module
    // in the long-term, as the email client 
    // should just handle emails
    //
    this.getTokens();

    this.app.storage.loadTransactions("Email", 50, (txs) => {
      for (let i = 0; i < txs.lengthl; i++) {
        this.addEmail(txs[i]);
      }
    });

    if (this.app.BROWSER) { EmailList.render(this); }
  }



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {

      //
      // if transaction is for me
      //
      if (tx.isTo(app.wallet.returnPublicKey())) {

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
    let {title, message} = tx.returnMessage();
    this.emails.unshift({title, message, timestamp: tx.transaction.ts});
    if (this.app.BROWSER) { EmailList.render(this); }
  }


  getTokens() {
    let msg = {};
    msg.data = {address: this.app.wallet.returnPublicKey()};
    msg.request = 'get tokens';
    setTimeout(() => {
        this.app.network.sendRequest(msg.request, msg.data);
    }, 1000);
  }

}

module.exports = Email;
