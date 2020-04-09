const LeaderboardTemplate = require('./side-leaderboard.template');


module.exports = LeaderboardSidebar = {


  render(app, data) {
    document.querySelector(".arcade-sidebar-leaderboard").innerHTML = LeaderboardTemplate(app);

    var where = "1 = 1 ORDER BY ranking desc, games desc LIMIT 100"

    //why is data.leaderboard.sendPeerDatabaseRequest not a function?

    //why is app.modules.returnModule("Leaderboard").sendPeerDatabaseRequest
    //never hitting modtemplate handlePeerRequest in modtemplate?

    // data.leaderboard.sendPeerDatabaseRequest("leaderboard", "leaderboard", "*", where, null, function (res) {

    app.modules.returnModule("Leaderboard").sendPeerDatabaseRequest("leaderboard", "leaderboard", "*", where, null, function (res) {
      var html = `<div>Game</div> <div>Rank</div> <div>Played</div> <div>Player</div>`;
      res.rows.forEach(row => {
        html += `<div>${row.module}</div><div>${row.ranking}</div><div>${row.games}</div><div>${row.publickey}</div>`
      });
      document.querySelector(".leaderboard-rankings").innerHTML = html;
    });
  },

  attachEvents(app, data) {

  },


}

