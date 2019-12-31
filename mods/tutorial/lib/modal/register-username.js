const elParser = require('../../../../lib/helpers/el_parser');
const RegisterUsernameTemplate = require('./register-username.template.js');


module.exports = RegisterUsername = {


  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = RegisterUsernameTemplate();
    }
  },



  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {
      data.modal.destroy();
    }


    document.querySelector('#registry-modal-button').onclick = () => {

      data.modal.destroy();

      let tx = app.wallet.createUnsignedTransaction();
          tx.transaction.msg.module       = "Email";
          tx.transaction.msg.title        = "Address Registration Requested";
          tx.transaction.msg.message      = `
You have sent a request to register an address to the Saito DNS server. Please wait about a minute for the network to check your request and process it. We will update you once the registration attempt has succeeded (or failed).
      `;

     tx = app.wallet.signTransaction(tx);
     let emailmod = app.modules.returnModule("Email");

     if (emailmod != null) {
	setTimeout(() => {
          emailmod.addEmail(tx);
          app.storage.saveTransaction(tx);
	}, 1500);
      }
    }
  }
}



