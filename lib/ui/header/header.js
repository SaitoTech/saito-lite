const HomeHeaderTemplate = require('./header.template.js');
const Settings = require('../settings/settings');

module.exports = HomeHeader = {
    settings: {},
    render(app) {
        let header = document.querySelector('.header');
        header.innerHTML = HomeHeaderTemplate();
        header.classList.add('header-home');

        this.settings = new Settings(app);

        this.attachEvents(app);
    },

    attachEvents(app) {
        // document.querySelector('#notifications.header-icon')
        //         .addEventListener('click', () => {
        //             app.email.render();
        //         });

        document.querySelector('#settings.header-icon')
                .addEventListener('click', () => {
                    this.settings.render(app);
                });
    }
}
