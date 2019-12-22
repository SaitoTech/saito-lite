module.exports = ArcadeLeaderboardRowTemplate = ({winner, module, highscore}) => {
  return `
    <div class="arcade-leaderboard-row">
      <div class="arcade-leaderboard-row-winner">${winner}</div>
      <div class="arcade-leaderboard-row-module">${module}</div>
      <div class="arcade-leaderboard-row-score">${highscore}</div>
    </div>
  `;
}
