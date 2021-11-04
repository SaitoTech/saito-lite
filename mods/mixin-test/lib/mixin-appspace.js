const MixinAppspaceTemplate = require('./mixin-appspace.template.js');


module.exports = MixinAppspace = {


  render(app, mod) {

    document.querySelector(".email-appspace").innerHTML = MixinAppspaceTemplate(app);


  },

  attachEvents(app, mod) {}


}
