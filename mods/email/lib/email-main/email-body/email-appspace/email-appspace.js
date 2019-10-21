const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {

    render(app, data) {

        document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();

	let modobj = data.parentmod.mods[data.parentmod.appspace_mod_idx].respondTo("email-appspace");
	if (modobj == null) { return; ***REMOVED***

	modobj.render(app, data);

***REMOVED***,

    attachEvents(app, data) {

      let modobj = data.parentmod.mods[data.parentmod.appspace_mod_idx].respondTo("email-appspace");
      modobj.attachEvents(app, data);

***REMOVED***,

***REMOVED***
