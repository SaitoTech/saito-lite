
module.exports = ArcadeObserveTemplate = (app, mod, msg, idx, msgjson) => {

  let inviteHtml = `<button data-sig="${msgjson}" data-cmd="watch" class="button observe-game-btn invite-tile-button">WATCH</div>`;

/*
  let inviteHtml = `
    <div id="invite-${msg.game_id}" class="arcade-tile" style="background-image: url(/${msg.module}/img/arcade.jpg);">
      <div class="invite-tile-wrapper">
        <div class="game-inset-img" style="background-image: url(/${msg.module}/img/arcade.jpg);"></div>
        <div class="invite-row-2">
          <div class="gameName">${msg.module}</div>
          ${playersHtml}
        </div>
        <div class="gameShortDescription"></div>
	<div class="gameButtons">
          <button data-sig="${msg.game_id}" data-cmd="watch" class="button invite-tile-button">WATCH</button>
        </div>
      </div>
    </div>
    `;
*/
  return inviteHtml;
}

