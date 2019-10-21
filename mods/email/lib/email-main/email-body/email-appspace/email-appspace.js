const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {


    render(app, data) {
        //EmailAppspaceHeader.render(app, data);
        document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();

	let modobj = data.parentmod.mods[data.parentmod.appspace_mod_idx].respondTo("email-appspace");
	if (modobj == null) { return; }

	modobj.render(app, data);
	modobj.attachEvents(app, data);

    },

    attachEvents(app, data) {

//        document.querySelector('.email-submit')
//            .addEventListener('click', (e) => this.sendEmailTransaction()
//
//
//	);

    },

}
