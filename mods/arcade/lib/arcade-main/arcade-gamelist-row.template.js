module.exports = ArcadeGameListRowTemplate = (app, tx, button_text) => {

  let optionstxt = "";
  let jointxt = "JOIN";

  let {sig, from, msg***REMOVED*** = tx.transaction;
  let {options_html, game***REMOVED*** = msg;

  let publickey = from[0].add;

  return `
    <div class="arcade-game-invitation" id="arcade-game-${sig***REMOVED***">
      <div class="arcade-game-row-name" id="arcade-game-name-${sig***REMOVED***">

        <div class="game-row-avi">
          <img style="height: 1.7em" src="${app.keys.returnIdenticon(publickey)***REMOVED***">
        </div>
        <!-- ${publickey.substring(0,8)***REMOVED*** -->

      </div>
      <div class="arcade-game-row-name" id="arcade-game-name-${sig***REMOVED***">${game***REMOVED***</div>
      <div class="arcade-game-row-options" id="arcade-game-options-${sig***REMOVED***">${options_html***REMOVED***</div>
      <button class="arcade-game-row-join" id="arcade-game-join-${sig***REMOVED***">${button_text***REMOVED***</button>
    </div>
  `;

***REMOVED***
