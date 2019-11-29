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
***REMOVED***,

    attachEvents(app) {
        document.getElementById('navigator')
                .onclick = () => {
                    let dropdown = document.getElementById('modules-dropdown');
                    dropdown.toggleClass('show-right-sidebar');
            ***REMOVED***;

        document.getElementById('settings')
                .onclick = () => {
                    let dropdown = document.getElementById('settings-dropdown');
                    dropdown.toggleClass('show-right-sidebar');
            ***REMOVED***;

        document.getElementById('header-dropdown-reset-wallet')
                .onclick = () => {
                    app.storage.resetOptions();
                    window.location.reload();
            ***REMOVED***;

***REMOVED***document.getElementById('header-dropdown-load-wallet')
       ***REMOVED***.addEventListener('click', (e) => {
          ***REMOVED***  console.log("LOAD WALLET");
        ***REMOVED******REMOVED***);

        window.addEventListener('click', (e) => {
            if (e.target.id !== "navigator") {
                document.getElementById('modules-dropdown').classList.remove('show-right-sidebar');
        ***REMOVED***

            if (e.target.id !== "settings") {
                document.getElementById('settings-dropdown').classList.remove('show-right-sidebar');
        ***REMOVED***
    ***REMOVED***);

***REMOVED***
***REMOVED***
