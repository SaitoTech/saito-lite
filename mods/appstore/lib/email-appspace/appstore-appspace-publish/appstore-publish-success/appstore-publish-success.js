const AppStorePublishSuccessTemplate = require('./appstore-publish-success.template');

module.exports = AppStorePublishSuccess = {

  render(app, mod) {
    document.querySelector(".email-appspace").innerHTML = AppStorePublishSuccessTemplate();
  },

  attachEvents(app, mod) {

    let obj = document.querySelector(".return-to-inbox").onclick = (e) => {
      let email_mod = app.modules.returnModule("Email");
      window.location.hash = email_mod.goToLocation("#page=email_list&subpage=inbox");
    }

  },

}
