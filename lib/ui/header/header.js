const HomeHeaderTemplate = require('./header.template.js');
const HeaderDropdownTemplate = require('./header-dropdown.template');

const elParser = require('../../helpers/el_parser');

module.exports = HomeHeader = {
    render(app) {
        let header = document.querySelector('.header');
        header.innerHTML = HomeHeaderTemplate();
        header.append(
            elParser(HeaderDropdownTemplate())
        );
        header.classList.add('header-home');
    },

    attachEvents(app) {
        document.querySelector('#navigator')
                .addEventListener('click', (e) => {
                    let header_dropdown = document.querySelector('.header-dropdown');
                    header_dropdown.style.display = header_dropdown.style.display == "none" ? "block" : "none";
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
                document.querySelector('.header-dropdown').style.display = "none";
            }
        });

    }
}
