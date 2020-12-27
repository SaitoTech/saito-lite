const AppStoreAppspacePublish = require('./appstore-appspace-publish/appstore-publish.js');
const EmailAppStoreTemplate = require('./appstore-appspace.template.js');


module.exports = AppStoreAppspace = {

  render(app, data) {
    document.querySelector(".email-appspace").innerHTML = EmailAppStoreTemplate();
  },


  attachEvents(app, data) {

    //
    // on-click publish
    //
    document.getElementById('appstore-publish-button').onclick = () => {
      AppStoreAppspacePublish.render(app, data);
      AppStoreAppspacePublish.attachEvents(app, data);
    }
    document.getElementById('appstore-publish-button').click();

  }


}

