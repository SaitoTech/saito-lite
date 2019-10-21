// const EmailForm = require('./email-form/email-form');
// const EmailDetail           = require('./email-detail/email-detail');
const EmailAppspace         = require('./email-appspace/email-appspace');
const EmailAppspaceTemplate = require('./email-appspace/email-appspace.template.js');
const EmailListTemplate     = require('./email-list/email-list.template.js');
// const EmailListRowTemplate  = require('./email-list/email-list-row.template.js');

module.exports = EmailBody = {

    app: {***REMOVED***,

    render(app, data={***REMOVED***) {

				if (app) { this.app = app; ***REMOVED***

				// reference itself for others to call
				data.parentmod.body = this;

	//
	// render email list
	//
	if (data.parentmod.appspace == 0) {
          document.querySelector('.email-body').innerHTML = EmailListTemplate();
	  EmailList.render(app, data);
	***REMOVED***

	//
	// render application
	//
	if (data.parentmod.appspace == 1) {
          document.querySelector('.email-body').innerHTML = EmailAppspaceTemplate();
	  EmailAppspace.render(app, data);
	***REMOVED***
***REMOVED***,

    attachEvents(app, data) {

	if (data.parentmod.appspace == 0) {
	  EmailList.attachEvents(app, data);
	***REMOVED***
	if (data.parentmod.appspace == 1) {
	  EmailAppspace.attachEvents(app, data);
	***REMOVED***

***REMOVED***
***REMOVED***

