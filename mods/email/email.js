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

  initialize(app) {
    super.initialize(app);

    if (this.app.BROWSER) {
      this.getTokens();
      EmailList.render(this);
    }
  }

  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {
      email.addEmail(tx);
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
