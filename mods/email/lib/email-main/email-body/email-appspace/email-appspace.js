const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {


    render(app, data) {
***REMOVED***EmailAppspaceHeader.render(app, data);
        document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();

	let modobj = data.parentmod.mods[data.parentmod.appspace_mod_idx].respondTo("email-appspace");
	if (modobj == null) { return; ***REMOVED***

	modobj.render(app, data);
	modobj.attachEvents(app, data);

***REMOVED***,

    attachEvents(app, data) {

//        document.querySelector('.email-submit')
//            .addEventListener('click', (e) => this.sendEmailTransaction()
//
//
//	);

***REMOVED***,

***REMOVED***
