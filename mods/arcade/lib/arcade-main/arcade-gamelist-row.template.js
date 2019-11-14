module.exports = ArcadeGameListRowTemplate = (tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, msg***REMOVED*** = tx.transaction;
  let {options, game***REMOVED*** = msg;

  // console.log("\n\n\nADDING GAME: " + JSON.stringify(tx.returnMessage()));

  // if (JSON.stringify(options).length > 2) { optionstxt = JSON.stringify(options); ***REMOVED***

  return `
    <div class="arcade-game-invitation" id="arcade-game-${sig***REMOVED***">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig***REMOVED***">${game***REMOVED***</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig***REMOVED***">${optionstxt***REMOVED***</div>
      <button class="arcade-game-row-join" id="arcade-game-join-${sig***REMOVED***">${button_text***REMOVED***</button>
    </div>
  `;

***REMOVED***
