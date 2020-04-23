module.exports = LeaderboardTemplate = (app, data) => {
    return `
    <link rel="stylesheet" type="text/css" href="/leaderboard/style.css" />
    <hr />
    <h3 class="leaderboard-game-module">Leaderboard</h3>
    <div class="leaderboard-container">Loading Rankings...</div>
    <hr />
    `;
  }
