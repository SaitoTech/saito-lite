module.exports = ArcadeGameListRowTemplate = (app, tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, from, to, msg***REMOVED*** = tx.transaction;
  let {options_html, game***REMOVED*** = msg;

  let players_needed = 2;
  if (msg.players_needed > 2) { players_needed = msg.players_needed; ***REMOVED***
  let total_players = 1;

  let publickeys = [from[0].add];
  if (to.length > 0) {
    for (let i = 0; i < to.length; i++) {
      if (!publickeys.includes(to[i].add)) {
	publickeys.push(to[i].add);
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
