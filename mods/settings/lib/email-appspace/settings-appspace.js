const SettingsAppspaceTemplate = require('./settings-appspace.template.js');

module.exports = SettingsAppspace = {

  render(app, data) {

    document.querySelector(".email-appspace").innerHTML = SettingsAppspaceTemplate(app);

    let settings_appspace = document.querySelector(".settings-appspace");
    if (settings_appspace) {
      for (let i = 0; i < app.modules.mods.length; i++) {
        if (app.modules.mods[i].respondTo("settings-appspace") != null) {
          let mod_settings_obj = app.modules.mods[i].respondTo("settings-appspace");
          mod_settings_obj.render(app, data);
        }
      }
    }

  },

  attachEvents(app, data) {

    let settings_appspace = document.querySelector(".settings-appspace");
    if (settings_appspace) {
      for (let i = 0; i < app.modules.mods.length; i++) {
        if (app.modules.mods[i].respondTo("settings-appspace") != null) {
          let mod_settings_obj = app.modules.mods[i].respondTo("settings-appspace");
          mod_settings_obj.attachEvents(app, data);
        }
      }
    }

    document.getElementById("privatekey").onclick = function (e) {
      document.getElementById("privatekey").toggleClass("password");
    }

    document.getElementById("see-password").onclick = function (e) {
      document.getElementById("privatekey").toggleClass("password");
    }


    //
    // install module (button)
    //
    Array.from(document.getElementsByClassName("modules_mods_checkbox")).forEach(ckbx => {

      ckbx.onclick = async (e) => {

        let thisid = parseInt(e.currentTarget.id);
        let currentTarget = e.currentTarget;

        if (e.currentTarget.checked == true) {
          let sc = await sconfirm("Reactivate this module?");
          if (sc) {
            app.options.modules[thisid].active = 1;
            app.storage.saveOptions();
            window.location = window.location;
          } else {
            window.location = window.location;
          }
        } else {
          let sc = await sconfirm("Remove this module?");
          if (sc) {
            app.options.modules[thisid].active = 0;
            app.storage.saveOptions();
            window.location = window.location;
          } else {
            currentTarget.checked = true;
          }
        }

      };
    });



    document.getElementById('backup-account-btn')
      .addEventListener('click', (e) => {
        app.wallet.backupWallet();
      });


    document.getElementById('restore-account-btn')
      .addEventListener('click', (e) => {
        document.getElementById("settings-restore-account").click();
      });


    document.getElementById('settings-restore-account')
      .onchange = async function (e) {

        //let confirm_password = await sconfirm("Did you encrypt this backup with a password. Click cancel if not:");
        let password_prompt = "";

        /*
        if (confirm_password) {

          password_prompt = await sprompt("Please provide the password you used to encrypt this backup:");
          if (!password_prompt) {
            salert("Wallet Restore Cancelled");
            return;
          }
        } else {
          password_prompt = "";
        }
        */

        password_prompt = await sprompt("Enter encryption password (blank for no password):");

        let groo = password_prompt;
        
        if (password_prompt === false) {
          salert("Wallet Restore Cancelled");
          return;
        }
        

        let selectedFile = this.files[0];
        var wallet_reader = new FileReader();
        wallet_reader.onloadend = function () {

          let decryption_secret = "";
          let decrypted_wallet = "";

          if (password_prompt != "") {
            decryption_secret = app.crypto.hash(password_prompt + "SAITO-PASSWORD-HASHING-SALT");
            try {
              decrypted_wallet = app.crypto.aesDecrypt(wallet_reader.result, decryption_secret);
            } catch (err) {
              salert(err);
            }
          } else {
            decrypted_wallet = wallet_reader.result;
          }

          try {
            let wobj = JSON.parse(decrypted_wallet);
            app.options = wobj;

            app.wallet.blockchain.resetBlockchain();

            app.modules.returnModule('Arcade').onResetWallet();
            app.storage.saveOptions();

            //
            // and reload
            //
            salert("Restoration Complete ... click to reload Saito");
            window.location = window.location;
          } catch (err) {
            salert("Error decrypting wallet file. Password incorrect");
          }
        };

        wallet_reader.readAsBinaryString(selectedFile);

      };




    document.getElementById('reset-account-btn')
      .onclick = (e) => {

        app.wallet.resetWallet();
        app.modules.returnModule('Arcade').onResetWallet();
        app.storage.saveOptions();

        salert("Wallet reset!");

        data.email.emails.inbox = [];
        data.email.emails.sent = [];
        data.email.emails.trash = [];

        data.email.body.render(app, data);
        data.email.body.attachEvents(app, data);

        app.wallet.blockchain.resetBlockchain();

    };

    document.getElementById('delete-account-btn')
      .onclick = async (e) => {

        await app.storage.resetOptions();
        await salert("Account deleted!");

        data.email.emails.inbox = [];
        data.email.emails.sent = [];
        data.email.emails.trash = [];

        app.wallet.blockchain.resetBlockchain();

        window.location = window.location;
    };

    document.getElementById('restore-privatekey-btn').onclick = async (e) => {

      await app.storage.resetOptions();

      let privatekey = "";
      let publickey = "";

      try {
        privatekey = await sprompt("Enter Private Key:");
        if (privatekey != "") {
          publickey = app.crypto.returnPublicKey(privatekey);

          app.wallet.wallet.privatekey = privatekey;
          app.wallet.wallet.publickey = publickey;
          app.wallet.wallet.inputs = [];
          app.wallet.wallet.outputs = [];
          app.wallet.wallet.spends = [];
          app.wallet.wallet.pending = [];

          app.wallet.blockchain.resetBlockchain();

          await app.wallet.saveWallet();
          window.location = window.location;
        }
      } catch (e) {
        salert("Restore Private Key ERROR: " + e);
        console.log("Restore Private Key ERROR: " + e);
      }

    };

  },

}
