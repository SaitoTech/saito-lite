const EmailAppspaceTemplate = require('./email-appspace.template.js');

module.exports = EmailAppspace = {

  render(app, mod) {

    document.querySelector(".email-body").innerHTML = EmailAppspaceTemplate();
    try {
      let subPage = app.browser.parseHash(window.location.hash).subpage;  
      let submod = app.modules.returnModule(subPage);
      let modobj = submod.respondTo("email-appspace");
      modobj.render(app, mod);
      if (modobj.attachEvents) {
        modobj.attachEvents(app, mod);
      }
    } catch(error) {
      mod.locationErrorFallback(`Error fetching module.<br/>${error}`, error);
    }
  },
}
