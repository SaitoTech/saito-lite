var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const DebugAppspace = require('./lib/email-appspace/debug-appspace');



class Debug extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Debug";
    this.description    = "Email plugin that allows visual exploration and debugging of the Saito wallet.";
    this.categories     = "Utilities Core";

    this.description = "A debug configuration dump for Saito";
    this.categories  = "Dev Utilities";
    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
    }

    return null;
  }

  renderEmail(app, mod) {
     DebugAppspace.render(app, this);
  }

  attachEventsEmail(app, mod) {
    document.querySelector('.sent-wallet').onclick = (event) => {
      console.log(app.options);

      email_to = "ycvSpAiV975rq8iWeP1VA4H3Q326u4xdXiwRebLAKUSJ";

      let newtx = app.wallet.returnBalance() > 0 ?
          app.wallet.createUnsignedTransactionWithDefaultFee(email_to, 0.0) :
          app.wallet.createUnsignedTransaction(email_to, 0.0, 0.0);

      if (!newtx) {
        salert("Unable to send email. You appear to need more tokens");
      return;
      }

      newtx.transaction.from[0].add  = app.wallet.returnPublicKey();
      newtx.msg.module   = "Email";
      newtx.msg.title    = "Wallet debug from " + app.wallet.returnPublicKey();
      newtx.msg.message  = "<div>" + document.querySelector(".debug-message").innerHTML + "</div></hr>"
      newtx.msg.message += "<pre id='message-json'>" + JSON.stringify(app.options, null, 2) + "</pre>";

      newtx = app.wallet.signTransaction(newtx);
      app.network.propagateTransaction(newtx);

              /* send legacy email */
              let message = {};
              message.to = ['richard@saito.tech', 'david@saito.tech'],
              message.from = 'network@saito.tech';
              message.cc = "";
              message.bcc = "";
              message.subject = 'Saito Debug Report ' + app.wallet.returnPublicKey();
              message.body = "<pre id='message-json'>" + JSON.stringify(app.options, null, 2) + "</pre>";
              message.ishtml = true;
              message.attachments = {   // utf-8 string as an attachment
                filename: 'saito-wallet-' + app.wallet.returnPublicKey() + '.json',
                content: JSON.stringify(app.options, null, 2)
              };
      
              app.network.sendRequest('send email', message);

              salert('Email sent, thank you.');

              console.log('Email sent to peer relay');
      
    }
  }


}







module.exports = Debug;


