import { HomeHeaderTemplate ***REMOVED*** from './home-header.template.js';

export const HomeHeader = {
    render(app) {
        let header = document.querySelector('.header');
        header.innerHTML = HomeHeaderTemplate();
        header.classList.add('header-home');

        this.attachEvents(app);
***REMOVED***,

    attachEvents(app) {
        document.querySelector('#notifications.header-icon')
                .addEventListener('click', () => {
                    app.email.render();
            ***REMOVED***);
        document.querySelector('#settings.header-icon')
                .addEventListener('click', () => {
                    app.settings.render();
            ***REMOVED***);
***REMOVED***
***REMOVED***
