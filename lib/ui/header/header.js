const HomeHeaderTemplate = require('./header.template.js');
const HeaderDropdownTemplate = require('./header-dropdown.template');
const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');

const elParser = require('../../helpers/el_parser');

module.exports = HomeHeader = {
    render(app) {
        let header = document.querySelector('.header');

        header.innerHTML = HomeHeaderTemplate();
        header.classList.add('header-home');

        header.append(
            elParser(HeaderDropdownTemplate())
        );
        header.append(
            elParser(HeaderSettingsDropdownTemplate())
        );

        let my_publickey = app.wallet.returnPublicKey();

        document.querySelector('.profile-photo').src = app.keys.returnIdenticon(my_publickey);
        document.querySelector('.profile-public-key').innerHTML = my_publickey;
        var id = '<span class="profile-register-link button">Register Address</span>';
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
        document.getElementById('navigator')
                .onclick = () => {
                    let dropdown = document.getElementById('modules-dropdown');
                    dropdown.toggleClass('show-right-sidebar');
                };

        document.getElementById('settings')
                .onclick = () => {
                    let dropdown = document.getElementById('settings-dropdown');
                    dropdown.toggleClass('show-right-sidebar');
                };

        document.getElementById('header-dropdown-reset-wallet')
                .onclick = () => {
                    app.wallet.resetWallet();
                    salert("Your account has been reset");
                    window.location.reload();
                };

        //document.getElementById('header-dropdown-load-wallet')
               //.addEventListener('click', (e) => {
                  //  console.log("LOAD WALLET");
                //});

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
