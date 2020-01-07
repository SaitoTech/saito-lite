const elParser = require('../../../../lib/helpers/el_parser');
const WelcomeBackupTemplate = require('./welcome-backup.template.js');
const WelcomeBackupPasswordTemplate = require('./welcome-backup-password.template.js');


module.exports = WelcomeBackup = {


  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = WelcomeBackupTemplate();
    }
  },



  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {

      data.modal.destroy();

      let tx = app.wallet.createUnsignedTransaction();
      tx.transaction.msg.module = "Email";
      tx.transaction.msg.title = "Anonymous Mode Enabled";
      tx.transaction.msg.message = `

          <p>You have started using Saito without backing up your wallet or registering a username. In anonymous-mode, your address is your public key on the network.</p>
          <blockquote>Please note: to prevent spammers from abusing the network, we do not give tokens to anonymous accounts by default.
          <span>So your account will not start automatically earning tokens as you use the network.&nbsp;</span></blockquote>
          <p><span>To fix this, purchase some tokens from someone in the community or ask a community member to send you some. Once you have funds in your account the network faucet will start working.</span></p>
          <p>If you would like to backup your wallet manually, you can do so by clicking on the "gear" icon at the top-right of this page. We recommend that you do this periodically to avoid application-layer data loss.</p>      `;

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

    document.querySelector('#backup-email-button').onclick = () => {

      let submitted_email = document.querySelector("#registry-input").value;
      let subscribe = document.querySelector("#signup").checked;

      var hp = document.querySelector('#name').value;

      if (hp != "") {
        data.modal.destroy();
        return;
      }
      //
      // regexp to identify email addresses
      //
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(submitted_email).toLowerCase()) || submitted_email === "email@domain.com") {
        salert("Invalid email address!");
        return;
      };


      //
      // update Profile Info
      // 
      if (!app.options.profile) { app.options.profile = {}; }
      app.options.profile.email = submitted_email;

     

      document.querySelector(".welcome-modal-header").innerHTML = '<div>Almost Done!</div>';
      document.querySelector(".welcome-modal-main").innerHTML = '<div>We need to encrypt your wallet before it is sent over the network. You will need this password to recover your wallet:</div><div class="password-inputs"></div>';
      document.querySelector(".welcome-modal-info").innerHTML = '';
      document.querySelector(".password-inputs").innerHTML += WelcomeBackupPasswordTemplate();
      document.querySelector(".submit-encrypt-wallet-btn").onclick = () => {

        let pass1 = document.querySelector("#password1").value;
        let pass2 = document.querySelector("#password2").value;

        if (pass1 !== pass2) {
          salert("Your passwords are not the same: please re-enter!");
          return;
        }

	//
	// salt / hash and store pssword
	//
        app.options.profile.pass = app.crypto.hash(pass1 + "SAITO-PASSWORD-HASHING-SALT");
        app.storage.save();

	let mywallet_json = JSON.stringify(app.options);
	let mywallet_json_encrypt = app.crypto.aesEncrypt(mywallet, app.options.profile.pass);

        data.modal.destroy();

        let tx = app.wallet.createUnsignedTransaction();
        tx.transaction.msg.module = "Email";
        tx.transaction.msg.title = "Wallet Backup Successful";
        tx.transaction.msg.message = `

            <p>You will receive an encrypted copy of your wallet by email shortly.</p>
            <blockquote>
              To restore your wallet, click on the "gear" icon at the top-right of this page and select "Restore Wallet".
            </blockquote>
            <p>We recommend manually backing up your wallet periodically as you add friends and applications to your wallet. 
               You can do this anytime by clicking on the "gear" icon at the top-right of this page and selecting the appropriate option.</p>
            <p>Questions or comments? Contact us anytime.</p>
            <p><i>The Saito Team</i></p>

            `;

        tx = app.wallet.signTransaction(tx);
        let emailmod = app.modules.returnModule("Email");

        if (emailmod != null) {
          setTimeout(() => {
            emailmod.addEmail(tx);
            app.storage.saveTransaction(tx);
          }, 1500);
        }

        /* send legacy email */
        let message = {};
        message.to = submitted_email;
        message.from = 'testnet@saito.tech';
        message.cc = "";
        message.bcc = "";
        message.subject = 'Saito Wallet Backup';
        message.body = `

        <p>You will receive an encrypted copy of your wallet by email shortly.</p>
        <blockquote>
          To restore your wallet, click on the "gear" icon at the top-right of this page and select "Restore Wallet".
        </blockquote>
        <p>We recommend manually backing up your wallet periodically as you add friends and applications to your wallet. 
           You can do this anytime by clicking on the "gear" icon at the top-right of this page and selecting the appropriate option.</p>
        <p>Questions or comments? Contact us anytime.</p>
        <p><i>The Saito Team</i></p>        
                    `;
        message.ishtml = true;
        message.attachments = {   // utf-8 string as an attachment
          filename: 'saito-wallet-backup.enc',
          content: mywallet_json_encrypt
        };

        app.network.sendRequest('user wallet backup', app.wallet.returnPublicKey());
        console.log('user wallet backup');

        if(subscribe == true) {
          let subs = {
            key: app.wallet.returnPublicKey(),
            email: submitted_email,
            time: Date.now()
          };
          app.network.sendRequest('user subscription', subs);
          console.log('user wallet backup');
        }
        
        app.network.sendRequest('send email', message);
        console.log('Email sent to peer relay');


      }
    }
  }
}



