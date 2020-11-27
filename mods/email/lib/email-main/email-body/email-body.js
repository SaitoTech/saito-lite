const EmailForm          = require('./email-form/email-form');
const EmailDetail        = require('./email-detail/email-detail');
const EmailAppspace         = require('./email-appspace/email-appspace');
const EmailCryptoAppspace         = require('./email-cryptoappspace/email-cryptoappspace');
//const EmailAppspaceTemplate = require('./email-appspace/email-appspace.template.js');
const EmailListTemplate     = require('./email-list/email-list.template.js');


module.exports = EmailBody = {

    app: {},

    render(app, mod) {

        mod.body = this;
        let page = mod.parseHash(window.location.hash).page
        switch(page) {
            case "email_list":
                EmailList.render(app, mod);
                EmailList.attachEvents(app, mod);
                break;
            case "email_form":
                EmailForm.render(app, mod);
                EmailForm.attachEvents(app, mod);
                break;
            case "email_detail":
                EmailDetail.render(app, mod);
                EmailDetail.attachEvents(app, mod);
                break;
            case "email_appspace":
                //document.querySelector('.email-body').innerHTML = EmailAppspaceTemplate();
                EmailAppspace.render(app, mod);
                //EmailAppspace.attachEvents(app, mod);
                break;
            case "crypto_page":
                EmailCryptoAppspace.render(app, mod);
                break;
            default:
                mod.locationErrorFallback(`Page not found: ${page}`);
                break;
        }
    },

    attachEvents(app, mod) {
        if (document.querySelector('#email.create-button')) {
            document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
              window.location.hash = `#page=email_form`;
            });
        }
    }
}

