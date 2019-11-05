const HomeHeaderTemplate = require('./header.template.js');
const HeaderDropdownTemplate = require('./header-dropdown.template');
const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');

const elParser = require('../../helpers/el_parser');

module.exports = HomeHeader = {
    render(app) {
        let header = document.querySelector('.header');
        header.innerHTML = HomeHeaderTemplate();
        header.append(
            elParser(HeaderDropdownTemplate())
        );
        header.append(
            elParser(HeaderSettingsDropdownTemplate())
        );
        header.classList.add('header-home');
    },

    attachEvents(app) {
        document.getElementById('navigator')
                .addEventListener('click', (e) => {
                    let dropdown = document.getElementById('modules-dropdown');
                    dropdown.style.display = dropdown.style.display == "none" ? "block" : "none";
                });

        document.getElementById('settings')
                .addEventListener('click', (e) => {
                    let dropdown = document.getElementById('settings-dropdown');
                    dropdown.style.display = dropdown.style.display == "none" ? "block" : "none";
                });

        document.getElementById('header-dropdown-reset-wallet')
                .addEventListener('click', (e) => {
                    app.storage.resetOptions();
                    window.location.reload();
                });

        document.getElementById('header-dropdown-load-wallet')
                .addEventListener('click', (e) => {
                    console.log("LOAD WALLET");
                });

        window.addEventListener('click', (e) => {
            if (e.target.id !== "navigator") {
                document.getElementById('modules-dropdown').style.display = "none";
            }

            if (e.target.id !== "settings") {
                document.getElementById('settings-dropdown').style.display = "none";
            }
        });

    }
}
