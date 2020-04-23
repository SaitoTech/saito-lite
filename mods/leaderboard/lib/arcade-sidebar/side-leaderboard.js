const LeaderboardTemplate = require('./side-leaderboard.template');


module.exports = LeaderboardSidebar = {

  loaded : 0 ,

  render(app, data) {
    if (this.loaded == 0) {
      document.querySelector(".arcade-sidebar-leaderboard").innerHTML = LeaderboardTemplate(app);
    }
    this.loaded = 1;
  },

  attachEvents(app, data) {

  },


}

