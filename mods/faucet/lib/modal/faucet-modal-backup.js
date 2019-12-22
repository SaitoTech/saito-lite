const elParser = require('../../../../lib/helpers/el_parser');
const FaucetModalBackupTemplate = require('./faucet-modal-backup.template.js');
const FaucetModalBackupPasswordTemplate = require('./faucet-modal-backup-password.template.js');


module.exports = FaucetModalBackup = {


  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = FaucetModalBackupTemplate();
    }
  },


  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {

      data.modal.destroy();

      let tx = app.wallet.createUnsignedTransaction();
          tx.transaction.msg.module       = "Email";
          tx.transaction.msg.title        = "Anonymous Mode Enabled";
          tx.transaction.msg.message      = `

You have started using Saito without backing up your wallet or registering a username. In anonymous-mode, your address is your public key on the network.

Please note: to prevent spammers from abusing the network, we do not give tokens to anonymous accounts by default. So your account will not start automatically earning tokens as you use the network. To fix this, purchase some tokens from someone in the community or ask a community member to send you some. Once you have funds in your account the network faucet will start working.

If you would like to backup your wallet manually, you can do so by clicking on the "gear" icon at the top-right of this page. We recommend that you do this periodically to avoid application-layer data loss.
      `;

     tx = app.wallet.signTransaction(tx);
     let emailmod = app.modules.returnModule("Email");

     if (emailmod != null) {
	setTimeout(() => {
          emailmod.addEmail(tx);
          app.storage.saveTransaction(tx);
	}, 1500);
      }
    };



    document.querySelector('#registry-input').onclick = () => {
      document.querySelector('#registry-input').setAttribute("placeholder", "");
    };




    document.querySelector('#registry-email-button').onclick = () => {

      document.querySelector(".welcome-modal-header").innerHTML = '<div>Almost Done!</div>';
      document.querySelector(".welcome-modal-main").innerHTML = '<div>Provide a password to encrypt your wallet before you send it to yourself. You will need this password to recover your wallet:</div><div class="password-inputs"></div>';
      document.querySelector(".welcome-modal-info").innerHTML = '<div>Provide a password to encrypt your wallet before you send it to yourself for backup. This password will be known only to you.</div>';
      document.querySelector(".password-inputs").innerHTML += FaucetModalBackupPasswordTemplate();
      document.querySelector(".submit-encrypt-wallet-btn").onclick = () => {

	let pass1 = document.querySelector("#password1").value;
	let pass2 = document.querySelector("#password2").value;

	if (pass1 !== pass2) {
	  salert("Your passwords are not the same: please re-enter!");
	  return;
	}

	let mywallet_json = JSON.stringify(app.options);
	let mywallet_json_encrypt = app.crypto.aesEncrypt(mywallet, pass1);

        data.modal.destroy();
 
        let tx = app.wallet.createUnsignedTransaction();
            tx.transaction.msg.module       = "Email";
            tx.transaction.msg.title        = "Wallet Backup Successful";
            tx.transaction.msg.message      = `

You will receive an encrypted copy of your wallet by email shortly.

To restore your wallet, click on the "gear" icon at the top-right of this page and select "Restore Wallet".

We recommend manually backing up your wallet periodically as you add friends and applications to your wallet. You can do this anytime by clicking on the "gear" icon at the top-right of this page and selecting the appropriate option.

Questions or comments? Contact us anytime.

-- The Saito Team

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
}



