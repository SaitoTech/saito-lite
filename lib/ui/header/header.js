const HomeHeaderTemplate = require('./header.template.js');
const Settings = require('../settings/settings');

module.exports = HomeHeader = {
    settings: {***REMOVED***,
    render(app) {
        let header = document.querySelector('.header');
        header.innerHTML = HomeHeaderTemplate();
        header.classList.add('header-home');

        this.settings = new Settings(app);

        this.attachEvents(app);
***REMOVED***,

    attachEvents(app) {
***REMOVED*** document.querySelector('#notifications.header-icon')
***REMOVED***         .addEventListener('click', () => {
***REMOVED***             app.email.render();
***REMOVED***     ***REMOVED***);

        document.querySelector('#settings.header-icon')
                .addEventListener('click', () => {
                    this.settings.render(app);
            ***REMOVED***);
***REMOVED***
***REMOVED***
