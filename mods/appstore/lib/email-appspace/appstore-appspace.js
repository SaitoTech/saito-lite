const AppStoreAppspaceTemplate 	= require('./appstore-appspace.template.js');
const AppStoreAppspacePublish   = require('./appstore-appspace-publish/appstore-publish.js');

module.exports = AooStoreAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = AppStoreAppspaceTemplate();
    },

    attachEvents(app, data) {

      document.getElementById('appstore-publish-button')
              .onclick = () => {
                AppStoreAppspacePublish.render(app, data);
                AppStoreAppspacePublish.attachEvents(app, data);
              }
    }

}
