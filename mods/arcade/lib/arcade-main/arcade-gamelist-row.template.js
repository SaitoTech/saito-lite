module.exports = ArcadeGameListRowTemplate = (app, tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, from, to, msg} = tx.transaction;
  let {players_array, options_html, game} = msg;

  if (players_array == undefined) {
    players_array = "";
    for (let i = 0; i < to.length; i++) {
      players_array += to[i].add;
      if (i < (to.length-1)) { players_array += "_"; }
    }
  }
  let players = players_array.split("_");
  let players_needed = 2;
  if (options_html == undefined) { options_html = ""; }
  if (msg.players_needed > 2) { players_needed = msg.players_needed; }
  let total_players = 1;
  
  let publickeys = [from[0].add];
  if (players.length > 1) {
    for (let i = 0; i < players.length; i++) {
      if (!publickeys.includes(players[i])) {
	publickeys.push(players[i]);
      }
    }
  }

  let html = `
    <div class="arcade-game-invitation" id="arcade-game-${sig}">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">

        <div class="game-row-avi">`;

  for (let i = 0; i < publickeys.length; i++) {
     html += `<img style="height: 1.7em" src="${app.keys.returnIdenticon(publickeys[i])}">
          <!-- ${publickeys[i].substring(0,8)} -->
	`;
  }
  for (let i = publickeys.length; i < players_needed; i++) {
     html += `<img style="height: 1.7em" src="${app.keys.returnIdenticon("AAAAAAAAAAAAAAAAAAAAAAAAAAA")}">`;
  }
  html += `
        </div>

      </div>
      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">${game}</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig}">${options_html}</div>
      <button class="arcade-game-row-join" id="arcade-game-join-${sig}">${button_text}</button>
    </div>
  `;

  return html;

}
