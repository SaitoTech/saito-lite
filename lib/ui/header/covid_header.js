const HomeHeaderTemplate = require('./covid_header.template.js');
const HeaderDropdownTemplate = require('./covid_header-dropdown.template');
const HeaderSettingsDropdownTemplate = require('./covid_header-settings-dropdown.template');

const elParser = require('../../helpers/el_parser');

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
                    app.wallet.backupWallet();
          };
        }


        if (document.getElementById('header-dropdown-restore-wallet')) {
          document.getElementById('header-dropdown-restore-wallet').onclick = async () => {
               document.getElementById("settings-restore-account").click();
          };
        };

        document.getElementById('settings-restore-account').onchange = async function (e) {

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

		    try {
		            app.modules.returnModule('Arcade').onResetWallet();
		    } catch (err) {}
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




        window.addEventListener('click', (e) => {
            if (e.target.id !== "navigator") {
                document.getElementById('modules-dropdown').classList.remove('show-right-sidebar');
            }

            if (e.target.id !== "settings") {
                document.getElementById('settings-dropdown').classList.remove('show-right-sidebar');
            }
        });

    }
}
