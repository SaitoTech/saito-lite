const LeaderboardTemplate = require('./side-leaderboard.template');


module.exports = LeaderboardSidebar = {


  render(app, data) {
    document.querySelector(".arcade-sidebar-leaderboard").innerHTML = LeaderboardTemplate(app);

   

  },

  attachEvents(app, data) {

  },


}

