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

      //check identifier taken
      var identifier = document.querySelector('#registry-input').value;
      var hp = document.querySelector('#name').value;

      if (hp == "") {
        app.modules.returnActiveModule().sendPeerDatabaseRequest("registry", "records", "*", "identifier = '" + identifier + "@saito'", null, (res) => {
          if (res.rows.length > 0) {
            salert("Identifier already in use. Please select another");
            //document.querySelector('#registry-input').value = "";
            //document.querySelector('#registry-input').focus();
            return;
          } else {
            //salert("Registration Submitted");
            let register_success = app.modules.returnModule('Registry').registerIdentifier(identifier);
            if (register_success) {
              salert("Success! You are now: " + identifier + "@saito");

              data.modal.destroy();
              /*
              let tx = app.wallet.createUnsignedTransaction();
              tx.transaction.msg.module = "Email";
              tx.transaction.msg.title = "Address Registration Requested";
              tx.transaction.msg.message = `
<p>You have sent a request to register an address to the Saito DNS server.</p>
<p>Please wait about a minute for the network to check your request and process it.</p>
<p>We will update you once the registration attempt has succeeded (or failed).</p>
      `;

              tx = app.wallet.signTransaction(tx);
              
              let emailmod = app.modules.returnModule("Email");

              if (emailmod != null) {
                setTimeout(() => {
                  emailmod.addEmail(tx);
                  app.storage.saveTransaction(tx);
                }, 1500);
              }
              */
            } else {
              salert("That's a bug, Jim.")
            }
          }
        });
      }
    }
  }
}



