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
***REMOVED***,

    attachEvents(app) {
        document.getElementById('navigator')
                .addEventListener('click', (e) => {
                    let dropdown = document.getElementById('modules-dropdown');
                    dropdown.style.display = dropdown.style.display == "none" ? "block" : "none";
            ***REMOVED***);

        document.getElementById('settings')
                .addEventListener('click', (e) => {
                    let dropdown = document.getElementById('settings-dropdown');
                    dropdown.style.display = dropdown.style.display == "none" ? "block" : "none";
            ***REMOVED***);

***REMOVED***document.getElementById('header-dropdown-reset-wallet')
        ***REMOVED***.addEventListener('click', (e) => {
            ***REMOVED***app.storage.resetOptions();
           ***REMOVED*** window.location.reload();
       ***REMOVED*** ***REMOVED***);

***REMOVED***document.getElementById('header-dropdown-load-wallet')
       ***REMOVED***.addEventListener('click', (e) => {
          ***REMOVED***  console.log("LOAD WALLET");
        ***REMOVED******REMOVED***);

        window.addEventListener('click', (e) => {
            if (e.target.id !== "navigator") {
                document.getElementById('modules-dropdown').style.display = "none";
        ***REMOVED***

            if (e.target.id !== "settings") {
                document.getElementById('settings-dropdown').style.display = "none";
        ***REMOVED***
    ***REMOVED***);

***REMOVED***
***REMOVED***
