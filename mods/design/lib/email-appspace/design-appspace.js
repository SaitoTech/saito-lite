const DesignAppspaceTemplate = require('./design-appspace.template.js');

module.exports = DesignAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = DesignAppspaceTemplate(app);
    },

    attachEvents(app, data) {},

}
