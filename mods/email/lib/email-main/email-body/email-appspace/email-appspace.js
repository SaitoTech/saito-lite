const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {

  render(app, data) {

    document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();

    if (data.email.appspace_mod == null) { return; }
    let modobj = data.email.appspace_mod.respondTo("email-appspace");
    if (modobj == null) { return; }
    modobj.render(app, data);

  },

  attachEvents(app, data) {

    if (data.email.appspace_mod == null) { return; }
    let modobj = data.email.appspace_mod.respondTo("email-appspace");
    if (modobj == null) { return; }
    modobj.attachEvents(app, data);

  },

}
