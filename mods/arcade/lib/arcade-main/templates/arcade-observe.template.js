
module.exports = ArcadeObserveTemplate = (app, mod, msg, idx, msgjson) => {

  //  let inviteHtml = `<button data-sig="${msgjson}" data-cmd="watch" class="button observe-game-btn invite-tile-button">WATCH</div>`;


  let playersHtml = `<div class="playerInfo" style="grid-template-columns: repeat(${msg.players_array.split("_").length}, 1fr);">`;

  msg.players_array.split("_").forEach((player) => {
    let identicon = app.keys.returnIdenticon(player);
    let username = player;
    app.keys.fetchIdentifier(player, (fetchedId) => {
      if (fetchedId[player]) {
        username = fetchedId[player];
      }
    });
    playersHtml += `<div class="player-slot tip id-${player}"><img class="identicon" src="${identicon}"><div class="tiptext">${username}</div></div>`;
  });
  playersHtml += '</div>';

  let inviteHtml = `
    <div id="invite-${msg.game_id}" class="arcade-tile" style="background-image: url(/${msg.module}/img/arcade.jpg);">
      <div class="invite-tile-wrapper">
        <div class="game-inset-img" style="background-image: url(/${msg.module}/img/arcade.jpg);"></div>
        <div class="invite-row-2">
          <div class="gameName">${msg.module}</div>
          ${playersHtml}
        </div>
        <div class="gameShortDescription">${makeDescription(app, msg)}</div>
	<div class="gameButtons">
          <button data-sig="${msg.game_id}" data-gameobj="${msgjson}" data-cmd="watch" class="button observe-game-btn">WATCH</button>
        </div>
      </div>
    </div>
    `;

  return inviteHtml;
}

let makeDescription = (app, msg) => {
  let defaultDescription = "";
  let gameModule = app.modules.returnModule(msg.module);
  if (gameModule) {
    let moduleDescriptionMaker = gameModule.respondTo("make-invite-description");  
    if (moduleDescriptionMaker) {
      defaultDescription = moduleDescriptionMaker.makeDescription(msg);
      if (defaultDescription === undefined) { defaultDescription = ""; }
    }
  }
  if (msg) {
    if (msg.description) {
      defaultDescription = msg.description;
    }
  }
  if (defaultDescription == "") { return ""; }
  return ('<div class="invite-description">'+defaultDescription+'</div>');
}


