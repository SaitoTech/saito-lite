const FaucetAppspaceTemplate = require('./faucet-appspace.template.js');

module.exports = FaucetAppspace = {

    render(app, data) {
      document.querySelector(".email-main").innerHTML = FaucetAppspaceTemplate(app);
    },

    attachEvents(app, data) {

    },

}
