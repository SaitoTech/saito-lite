const ArcadeInfoboxTemplate = require('./arcade-infobox.template');

module.exports = LeaderboardArcadeInfobox = {

  render(app, data) {
    if (!document.getElementById("leaderboard-container")) {
      app.browser.addElementToDom(ArcadeInfoboxTemplate(), "arcade-infobox");
    }
  },

  attachEvents(app, data) {

  },

}

