module.exports = LeaderboardTemplate = (app, data) => {
    return `
    <link rel="stylesheet" type="text/css" href="/leaderboard/style.css" />
    <hr />
    <h3>Leaderboard</h3>
    <div class="leaderboard-rankings">Loading Rankings...</div>
    
    <hr />
    `;
  }
