const ArcadeInfoboxAnnouncementsTemplate = require('./arcade-infobox-announcements.template');

module.exports = ArcadeInfoboxAnnouncements = {

  render(app, mod) {
    if (!document.getElementById("arcade-infobox-announcements")) {
      app.browser.addElementToDom(ArcadeInfoboxAnnouncementsTemplate(), "arcade-infobox");
    }
    if (mod.announcement != "") {
      document.getElementById("arcade-infobox-announcements").innerHTML = mod.announcement;
    }
  },

  attachEvents(app, mod) {

  },

}

