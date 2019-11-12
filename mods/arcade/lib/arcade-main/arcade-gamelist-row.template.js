module.exports = ArcadeGameListRowTemplate = (tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

console.log("\n\n\nADDING GAME: " + JSON.stringify(tx.returnMessage()));

  if (JSON.stringify(tx.transaction.msg.options).length > 2) { optionstxt = JSON.stringify(tx.transaction.msg.options); ***REMOVED***

  return `
    <div class="arcade-game-invitation" id="${tx.transaction.sig***REMOVED***">
      <div class="arcade-game-row-name" id="${tx.transaction.sig***REMOVED***">${tx.transaction.msg.game***REMOVED***</div>
      <div class="arcade-game-row-options" id="${tx.transaction.sig***REMOVED***">${optionstxt***REMOVED***</div>
      <div class="arcade-game-row-join" id="${tx.transaction.sig***REMOVED***">${button_text***REMOVED***</div>
    </div>
  `;

***REMOVED***
