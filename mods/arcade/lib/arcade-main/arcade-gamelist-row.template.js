module.exports = ArcadeGameListRowTemplate = (tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, msg} = tx.transaction;
  let {options, game} = msg;

  // console.log("\n\n\nADDING GAME: " + JSON.stringify(tx.returnMessage()));

  // if (JSON.stringify(options).length > 2) { optionstxt = JSON.stringify(options); }

  return `
    <div class="arcade-game-invitation" id="arcade-game-${sig}">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig}">${game}</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig}">${optionstxt}</div>
      <button class="arcade-game-row-join" id="arcade-game-join-${sig}">${button_text}</button>
    </div>
  `;

}
