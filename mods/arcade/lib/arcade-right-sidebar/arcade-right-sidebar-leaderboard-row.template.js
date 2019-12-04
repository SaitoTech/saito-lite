module.exports = ObserverGameTemplate = ({winner, module, highscore}) => {
  // let html = `
  //   <div class="arcade-observer-game-row">
  //     <div class="arcade-observer-game-players">
  //     `;
  // for (let z = 0; z < players.length; z++) {
  //     html += `
  //       <img class="arcade-observer-game-players-identicon" src="${players[z].identicon}" />
  //     `;
  // }
  // html += `
  //     </div>
  //     <div class="arcade-observer-game-name" id="arcade-observer-game">
  //       ${msg.module}
  //     </div>
  //     <button style="width: 100%" class="arcade-observer-game-btn" id=${msgjson}">WATCH</button
  //   </div>
  // `;
  // return html;

  return `
    <div class="arcade-leaderboard-row">
      <div class="arcade-leaderboard-row-winner">${winner}</div>
      <div class="arcade-leaderboard-row-module">${module}</div>
      <div class="arcade-leaderboard-row-score">${highscore}</div>
    </div>
  `;
}
