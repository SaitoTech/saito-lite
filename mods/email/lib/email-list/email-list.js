// const EmailForm = require('../email-form/email-form.js');
const EmailDetail       = require('../email-detail/email-detail');
const EmailHeader       = require('../email-header/email-header');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    app: {},

    render(app, data={}) {

        if (app) { this.app = app; }

        EmailHeader.render(app, data);

        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        let { emails } = data.parentmod;

        emails[emails.active].forEach(tx => {
            document.querySelector('.email-list').innerHTML
                += EmailListRowTemplate(tx);
        });
    },

    attachEvents(app, data) {
/**
 * - how do we know which email is clicked on, etc.
 *
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                data.emailList = this;
                EmailForm.render(app, data);
                EmailForm.attachEvents(app);
            });
**/
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.addEventListener('click', (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; }

                let sig = e.currentTarget.id;
                let selected_email = data.parentmod.emails["inbox"].filter(email => {
                    return email.transaction.sig === sig
                });

                data.selected_email = selected_email[0];
		data.detail_header_title = data.selected_email.transaction.msg.title;
                data.emailList = this;

                EmailDetail.render(app, data);
            });
        });
    }
}
