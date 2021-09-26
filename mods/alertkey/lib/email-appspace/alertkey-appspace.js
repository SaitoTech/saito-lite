const AlertKeyAppspaceTemplate = require('./alertkey-appspace.template.js');

module.exports = AlertKeyAppspace = {

  render(app, mod) {

    document.querySelector(".email-appspace").innerHTML = AlertKeyAppspaceTemplate(app);

  },

  attachEvents(app, mod) {

    try {

    } catch (err) {

    }

  },

}

