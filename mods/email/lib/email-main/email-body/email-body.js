const EmailForm = require('./email-form/email-form');
const EmailDetail           = require('./email-detail/email-detail');
const EmailAppspace         = require('./email-appspace/email-appspace');
const EmailAppspaceTemplate = require('./email-appspace/email-appspace');
const EmailListTemplate     = require('./email-list/email-list.template.js');
const EmailListRowTemplate  = require('./email-list/email-list-row.template.js');

module.exports = EmailBody = {

    app: {},

    render(app, data={}) {

        if (app) { this.app = app; }

	//
	// render email list
	//
	if (data.parentmod.appspace == 0) {
          document.querySelector('.email-body').innerHTML = EmailListTemplate();
	  EmailList.render(app, data);
	}

	//
	// render application
	//
	if (data.parentmod.appspace == 1) {
          document.querySelector('.email-body').innerHTML = EmailAppspaceTemplate();
	  EmailAppspace.render(app, data);
	}
    },

    attachEvents(app, data) {

	if (data.parentmod.appspace == 0) {
	  EmailList.attachEvents(app, data);
	}
	if (data.parentmod.appspace == 1) {
	  EmailAppspace.attachEvents(app, data);
	}

    }
}

