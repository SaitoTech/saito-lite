var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Roles extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Roles";

    this.roles		= [];
    this.groups 	= [];

    return this;

  }



  initializeHTML(app) {
    console.log("###########################");
    console.log("#### HEADLESS WEB APP #####");
    console.log("###########################");
  }


  initialize(app) {

/**** EXAMPLE OF HANDLING LINKS ***
    //
    // send an email
    //
    let email_title = "Confirm Membership";
    let email_text = `
Click on this link and we'll see what happens:

<a href="/roles?member=Empire&role=stormtrooper">Click on this link to confirm please</a>

    `;
    let email_to = app.wallet.returnPublicKey();
    let email_from = app.wallet.returnPublicKey();

    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee(email_to, 0.0);
    if (!newtx) {
      return;
    }

    newtx.transaction.msg.module   = "Email";
    newtx.transaction.msg.title    = email_title;
    newtx.transaction.msg.message  = email_text;
    newtx = app.wallet.signTransaction(newtx);

    let emailmod = app.modules.returnModule("Email");
    if (emailmod != null) {
try {
console.log("ADDING EMAIL TO ONCONFIRMATION!");
      emailmod.onConfirmation(null, newtx, 0, app);
} catch (err) {}
    }
*****************/

  }


  respondTo(type) {
    return null;
  }



}







module.exports = Roles;


