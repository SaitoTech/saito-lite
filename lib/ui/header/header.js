const HomeHeaderTemplate = require('./header.template.js');

module.exports = HomeHeader = {
    render(app) {
        let header = document.querySelector('.header');
        header.innerHTML = HomeHeaderTemplate();
        header.classList.add('header-home');

        this.attachEvents(app);
***REMOVED***,

    attachEvents(app) {
***REMOVED*** document.querySelector('#notifications.header-icon')
***REMOVED***         .addEventListener('click', () => {
***REMOVED***             app.email.render();
***REMOVED***     ***REMOVED***);

***REMOVED*** document.querySelector('#settings.header-icon')
***REMOVED***         .addEventListener('click', () => {
***REMOVED***             app.settings.render();
***REMOVED***     ***REMOVED***);
***REMOVED***
***REMOVED***
