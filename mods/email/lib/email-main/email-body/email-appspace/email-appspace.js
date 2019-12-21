const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {

    render(app, data) {

        document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();

        if (data.email.appspace_mod == null) { return; ***REMOVED***
	let modobj = data.email.appspace_mod.respondTo("email-appspace");
	if (modobj == null) { return; ***REMOVED***
	modobj.render(app, data);

***REMOVED***,

    attachEvents(app, data) {

      if (data.email.appspace_mod == null) { return; ***REMOVED***
      let modobj = data.email.appspace_mod.respondTo("email-appspace");
      if (modobj == null) { return; ***REMOVED***
      modobj.attachEvents(app, data);

***REMOVED***,

***REMOVED***
