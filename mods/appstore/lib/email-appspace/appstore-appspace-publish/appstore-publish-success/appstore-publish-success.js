const AppStorePublishSuccessTemplate = require('./appstore-publish-success.template');

module.exports = AppStorePublishSuccess = {
  render(app, data) {
    document.querySelector(".email-appspace")
            .innerHTML = AppStorePublishSuccessTemplate();
  },

  attachEvents(app, data) {

    let obj = document.querySelector(".return_to_inbox").onclick = (e) => {
alert("return to inbox!");
    }

  },

}
