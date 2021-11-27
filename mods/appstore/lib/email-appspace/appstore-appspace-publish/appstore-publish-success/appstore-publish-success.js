const AppStorePublishSuccessTemplate = require('./appstore-publish-success.template');
const AppStorePublishWaitingTemplate = require('./appstore-publish-waiting.template');
const SaitoOverlay = require('./../../../../../../lib/saito/ui/saito-overlay/saito-overlay');



module.exports = AppStorePublishSuccess = {

  render(app, mod) {

    if (!document.getElementById("appstore-app-install-overlay")) {
      app.browser.addElementToDom('<div id="appstore-app-install-overlay" class="appstore-app-install-overlay"></div>');
    }

    document.querySelector('.appstore-app-install-overlay').innerHTML = AppStorePublishWaitingTemplate(app, mod.data);
    document.querySelector('.appstore-app-install-overlay').style.display = "block";

/**

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, AppStorePublishWaitingTemplate());
**/

//    document.querySelector(".email-appspace").innerHTML = AppStorePublishSuccessTemplate();
  },

  attachEvents(app, mod) {

/***
    let obj = document.querySelector(".return-to-inbox").onclick = (e) => {
      let email_mod = app.modules.returnModule("Email");
      window.location.hash = email_mod.goToLocation("#page=email_list&subpage=inbox");
    }
***/

  },

}
