const RegistryAppspaceTemplate 	= require('./registry-appspace.template.js');

module.exports = RegistryAppspace = {
    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = RegistryAppspaceTemplate();
    },

    attachEvents(app, data) {
      document.querySelector('.registry-submit')
        .addEventListener('click', (e) => {
          let identifier = document.getElementById("identifier-requested").value;
          data.registry.registerIdentifier(identifier);
        });
    }

}
