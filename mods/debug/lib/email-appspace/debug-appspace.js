const DebugAppspaceTemplate = require('./debug-appspace.template.js');

module.exports = DebugAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = DebugAppspaceTemplate();
      document.getElementById("email-appspace-debug").innerHTML = JSON.stringify(app.options, null, 2);
    },

    attachEvents(app, data) {
    }

}
