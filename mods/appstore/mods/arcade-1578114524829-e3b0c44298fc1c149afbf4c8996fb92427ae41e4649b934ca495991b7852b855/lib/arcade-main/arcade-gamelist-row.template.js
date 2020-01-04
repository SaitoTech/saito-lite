module.exports = ArcadeGameListRowTemplate = (app, tx, button_map) => {

  let { sig, from, to, msg } = tx.transaction;
  let { players_array, options_html, game } = msg;
  let txmsg = tx.returnMessage();

  if (players_array == undefined) {
    players_array = to.map(t => t.add).join('_');
  }

  let players_needed = 2;
  let players = players_array.split("_");

  if (options_html == undefined) { options_html = ""; }
  if (txmsg.over == 1) { options_html = "Opponent Resigned"; }
  if (msg.players_needed > 2) { players_needed = msg.players_needed; }

  let publickeys = [];
  if (from.length > 0) {
    publickeys.push(from[0].add);
    players.forEach(player => {
      if (!publickeys.includes(player))
        publickeys.push(player);
    });
  }

  let identicons = publickeys.map(publickey => `<img class="identicon" src="${app.keys.returnIdenticon(publickey)}">`).join("");

  var button_html = Object.entries(button_map).map(([key, value]) => {
    return `<button class="arcade-game-row-${key}" id="arcade-game-${key}-row-${sig}">${value}</button>`
  }).join('');

  return `
    <div class="arcade-game-invitation" id="arcade-game-${sig}">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">

        <div class="arcade-game-row-avi">
          ${identicons}
        </div>
      </div>

      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">${game}</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig}">
      <div class="game-options-html">${options_html}</div>
      </div>

      ${button_html}
    </div>
  `;

}
