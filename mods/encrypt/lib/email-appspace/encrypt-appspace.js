const EncryptAppspaceTemplate 	= require('./encrypt-appspace.template.js');


module.exports = EncryptAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = EncryptAppspaceTemplate();
    },

    attachEvents(app, data) {
    }

}
