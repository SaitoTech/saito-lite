const DebugAppspaceTemplate = require('./debug-appspace.template.js');
const jsonTree = require('json-tree-viewer');

module.exports = DebugAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = DebugAppspaceTemplate();
      var tree = jsonTree.create(app.options, document.getElementById("email-appspace-debug"));
    },

    attachEvents(app, data) {}

}
