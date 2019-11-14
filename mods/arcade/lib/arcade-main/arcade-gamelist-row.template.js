module.exports = ArcadeGameListRowTemplate = (app, tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, from, msg} = tx.transaction;
  let {options_html, game} = msg;

  let publickey = from[0].add;

  return `
    <div class="arcade-game-invitation" id="arcade-game-${sig}">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">

        <div class="game-row-avi">
          <img style="height: 1.7em" src="${app.keys.returnIdenticon(publickey)}">
        </div>
        <!-- ${publickey.substring(0,8)} -->

      </div>
      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">${game}</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig}">${options_html}</div>
      <button class="arcade-game-row-join" id="arcade-game-join-${sig}">${button_text}</button>
    </div>
  `;

}
