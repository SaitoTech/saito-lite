module.exports = ArcadeGameListRowTemplate = (app, tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, from, to, msg***REMOVED*** = tx.transaction;
  let {players_array, options_html, game***REMOVED*** = msg;

  if (players_array == undefined) {
    players_array = "";
    for (let i = 0; i < to.length; i++) {
      players_array += to[i].add;
      if (i < (to.length-1)) { players_array += "_"; ***REMOVED***
***REMOVED***
  ***REMOVED***
  let players = players_array.split("_");
  let players_needed = 2;
  if (options_html == undefined) { options_html = ""; ***REMOVED***
  if (msg.players_needed > 2) { players_needed = msg.players_needed; ***REMOVED***
  let total_players = 1;
  
  let publickeys = [from[0].add];
  if (players.length > 1) {
    for (let i = 0; i < players.length; i++) {
      if (!publickeys.includes(players[i])) {
	publickeys.push(players[i]);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  let html = `
    <div class="arcade-game-invitation" id="arcade-game-${sig***REMOVED***">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig***REMOVED***">

        <div class="game-row-avi">`;

  for (let i = 0; i < publickeys.length; i++) {
     html += `<img style="height: 1.7em" src="${app.keys.returnIdenticon(publickeys[i])***REMOVED***">
          <!-- ${publickeys[i].substring(0,8)***REMOVED*** -->
	`;
  ***REMOVED***
  for (let i = publickeys.length; i < players_needed; i++) {
     html += `<img style="height: 1.7em" src="${app.keys.returnIdenticon("AAAAAAAAAAAAAAAAAAAAAAAAAAA")***REMOVED***">`;
  ***REMOVED***
  html += `
        </div>

      </div>
      <div class="arcade-game-row-name" id="arcade-game-name-${sig***REMOVED***">${game***REMOVED***</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig***REMOVED***">${options_html***REMOVED***</div>
      <button class="arcade-game-row-join" id="arcade-game-join-${sig***REMOVED***">${button_text***REMOVED***</button>
    </div>
  `;

  return html;

***REMOVED***
