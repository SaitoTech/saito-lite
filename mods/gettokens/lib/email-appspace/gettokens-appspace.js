const GetTokensAppspaceTemplate 	= require('./gettokens-appspace.template.js');

module.exports = GetTokensAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = GetTokensAppspaceTemplate();
    },

    attachEvents(app, data) {
    },

}
