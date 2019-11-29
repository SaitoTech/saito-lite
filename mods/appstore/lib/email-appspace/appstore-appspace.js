const AppStoreAppspaceTemplate 	= require('./appstore-appspace.template.js');
const AppStoreAppspacePublish   = require('./appstore-appspace-publish/appstore-publish.js');

module.exports = AooStoreAppspace = {

    render(app, data) {
      setTimeout(() => {
        document.querySelector(".email-appspace").innerHTML = AppStoreAppspaceTemplate();
      }, 2000);
    },

    attachEvents(app, data) {

      document.getElementById('appstore-publish-button')
              .onclick = () => {
                AppStoreAppspacePublish.render(app, data);
                AppStoreAppspacePublish.attachEvents(app, data);
              }
    }

}
