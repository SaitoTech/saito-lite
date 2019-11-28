const AdminAppspaceTemplate = require('./admin-appspace.template.js');

module.exports = AdminAppspace = {

    render(app, data) {
      document.querySelector(".alaunius-appspace").innerHTML = AdminAppspaceTemplate(app);
    },

    attachEvents(app, data) {
    },

}
