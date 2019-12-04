module.exports = ObserverGameTemplate = ({winner, module, highscore***REMOVED***) => {
  // let html = `
  //   <div class="arcade-observer-game-row">
  //     <div class="arcade-observer-game-players">
  //     `;
  // for (let z = 0; z < players.length; z++) {
  //     html += `
  //       <img class="arcade-observer-game-players-identicon" src="${players[z].identicon***REMOVED***" />
  //     `;
  // ***REMOVED***
  // html += `
  //     </div>
  //     <div class="arcade-observer-game-name" id="arcade-observer-game">
  //       ${msg.module***REMOVED***
  //     </div>
  //     <button style="width: 100%" class="arcade-observer-game-btn" id=${msgjson***REMOVED***">WATCH</button
  //   </div>
  // `;
  // return html;

  return `
    <div class="arcade-leaderboard-row">
      <div class="arcade-leaderboard-row-winner">${winner***REMOVED***</div>
      <div class="arcade-leaderboard-row-module">${module***REMOVED***</div>
      <div class="arcade-leaderboard-row-score">${highscore***REMOVED***</div>
    </div>
  `;
***REMOVED***
