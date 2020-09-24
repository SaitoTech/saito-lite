const HomeHeaderTemplate = require('./header.template.js');
const HeaderDropdownTemplate = require('./header-dropdown.template');
const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');

const elParser = require('../../../../lib/helpers/el_parser');

module.exports = HomeHeader = {

  render(app) {
    let header = document.querySelector('.header');

    let ddmods = [];
    for (let i = 0; i < app.modules.mods.length; i++) {
      if (app.modules.mods[i].respondTo("header-dropdown") != null) {
        if (app.modules.mods[i].browser_active != 1) {
          ddmods.push(app.modules.mods[i]);
        }
      }
    }

    header.innerHTML = HomeHeaderTemplate(ddmods);
    header.classList.add('header-home');

    header.append(
      elParser(HeaderDropdownTemplate(ddmods))
    );
    header.append(
      elParser(HeaderSettingsDropdownTemplate(app))
    );


    let my_publickey = app.wallet.returnPublicKey();

    document.querySelector('.profile-photo').src = app.keys.returnIdenticon(my_publickey);
    document.querySelector('.profile-public-key').innerHTML = my_publickey;
    var id = '<div class="profile-register-link">anonymous account</div>';
    if (app.keys.returnIdentifierByPublicKey(my_publickey)) {
      id = app.keys.returnIdentifierByPublicKey(my_publickey);
    } else {
      document.querySelector('.profile-identifier')
        .onclick = async () => {
          document.getElementById('settings-dropdown').classList.add('show-right-sidebar-hard');
          var requested_id = await sprompt("Pick a handle or nickname. <br /><sub>Alphanumeric characters only - Do not include an @</sub.>");
          let register_success = app.modules.returnModule('Registry').registerIdentifier(requested_id);
          if (register_success) {
            id = `"${requested_id}@saito" requested.`;
            document.getElementById('settings-dropdown').classList.remove('show-right-sidebar-hard');
            document.getElementById('settings-dropdown').classList.add('show-right-sidebar');
            document.querySelector('.profile-identifier').innerHTML = id;
          }
        };
    }
    document.querySelector('.profile-identifier').innerHTML = id;

  },


  attachEvents(app) {

    let is_email_mod_active = 0;
    let is_qr_scanner_active = 0;
    for (let i = 0; i < app.modules.mods.length; i++) {
      if (app.modules.mods[i].name == "Email" && app.modules.mods[i].browser_active == 1) {
        is_email_mod_active = 1;
      }
      if (app.modules.mods[i].name == "QRScanner") {
        is_qr_scanner_active = 1;
      }
    }


    if (document.getElementById('navigator')) {
      document.getElementById('navigator').onclick = () => {
        let dropdown = document.getElementById('modules-dropdown');
        dropdown.toggleClass('show-right-sidebar');
      };
    }

    if (document.getElementById('settings')) {
      document.getElementById('settings').onclick = () => {
        let dropdown = document.getElementById('settings-dropdown');
        dropdown.toggleClass('show-right-sidebar');
      };
    }



    if (document.getElementById('header-dropdown-backup-wallet')) {
      document.getElementById('header-dropdown-backup-wallet').onclick = () => {
        try {
          let html = `

	Your keypair for using this service is:

	<p></p>

	PUBLIC KEY: ${app.wallet.returnPublicKey()}
	<br />
	PRIVATE KEY: ${app.wallet.returnPrivateKey()}

	<p></p>

	Please backup this information. Without it you will not be able to access your account in the future.

	<p></p>

	<a href="/covid19">Click here to return to the main page when done.</a>

	      `;

          let mainobj = null;

          try {
            main = document.querySelector(".main");
          } catch (err) { }

          if (main) {
            main.innerHTML = html;
          } else {
            document.body.inerHTML = html;
          }

        } catch (err) {

        }
      };
    }


    if (document.getElementById('header-dropdown-logout')) {
      document.getElementById('header-dropdown-logout').addEventListener('click', async (e) => {

        app.wallet.resetWallet();
        app.storage.saveOptions();

        window.location.reload();

      });
    }

    if (document.getElementById('header-dropdown-restore-wallet')) {
      document.getElementById('header-dropdown-restore-wallet').addEventListener('click', async (e) => {

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

            await app.wallet.saveWallet();
            window.location.reload();
          }
        } catch (e) {
          salert("Restore Private Key ERROR: " + e);
          console.log("Restore Private Key ERROR: " + e);
        }
      });
    }


    window.addEventListener('click', (e) => {
      if (document.querySelector('.header')) {
        if (e.target.id !== "navigator") {
          document.getElementById('modules-dropdown').classList.remove('show-right-sidebar');
        }

        if (e.target.id !== "settings") {
          document.getElementById('settings-dropdown').classList.remove('show-right-sidebar');
        }
      }
    });

  }
}
