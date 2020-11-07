const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {

  render(app, mod) {

    document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();

    if (mod.appspace_mod == null) { return; }
    let modobj = mod.appspace_mod.respondTo("email-appspace");
    if (modobj == null) { return; }
    modobj.render(app, mod);

  },

  attachEvents(app, mod) {

    if (mod.appspace_mod == null) { return; }
    let modobj = mod.appspace_mod.respondTo("email-appspace");
    if (modobj == null) { return; }
    modobj.attachEvents(app, mod);

  },

}
