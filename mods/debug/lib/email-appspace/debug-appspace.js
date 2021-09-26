const DebugAppspaceTemplate = require('./debug-appspace.template.js');
const jsonTree = require('json-tree-viewer');

module.exports = DebugAppspace = {

    render(app, mod) {
      document.querySelector(".email-appspace").innerHTML = DebugAppspaceTemplate();
try {
      var tree = jsonTree.create(app.options, document.getElementById("email-appspace-debug"));
} catch (err) {
  console.log("error creating jsonTree: " + jsonTree);
}
    },

    attachEvents(app, mod) {}

}
