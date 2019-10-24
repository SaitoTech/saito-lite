const ArcadeMainTemplate = require('./arcade-main.template');
const ArcadeGameTemplate = require('./arcade-game.template');
const ArcadeGameListRowTemplate = require('./arcade-gamelist-row.template');


module.exports = ArcadeMain = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; ***REMOVED***
    arcade_main.innerHTML = ArcadeMainTemplate();

    //
    // click-to-create games
    //
    let gamesbox = document.getElementById("arcade-games");
    data.arcade.mods.forEach(mod => {
console.log("TESTING MOD: " + mod.name);
      let gameobj = mod.respondTo("arcade-games");
      if (gameobj != null) {
	gamesbox.innerHTML += ArcadeGameTemplate(mod, gameobj);
  ***REMOVED***
console.log("TESTING MOD FINISHED: " + mod.name);
***REMOVED***);

    //
    // click-to-join
    //
    data.arcade.games.forEach(tx => {
      document.querySelector('.arcade-gamelist').innerHTML += ArcadeGameListRowTemplate(tx);
***REMOVED***);
console.log("Finished Render in ArcadeMain");

  ***REMOVED***,


  attachEvents(app, data) {

    //
    // create game
    //
    Array.from(document.getElementsByClassName('game')).forEach(game => {
      game.addEventListener('click', (e) => {
        alert("You have clicked on: " + e.currentTarget.id);
  ***REMOVED***);
***REMOVED***);

    //
    // join game
    //
    Array.from(document.getElementsByClassName('arcade-game-row-join')).forEach(game => {
      game.addEventListener('click', (e) => {

        let game_id = e.currentTarget.id;

	for (let i = 0; i < data.arcade.games.length; i++) {
	  if (data.arcade.games[i].transaction.sig == game_id) {
alert("FOUND THE TX: " + JSON.stringify(data.arcade.games[i].transaction));
	    data.arcade.sendInviteRequest(app, data, data.arcade.games[i]);
	    return;
	  ***REMOVED***
    ***REMOVED***

  ***REMOVED***);
***REMOVED***);

  ***REMOVED***

***REMOVED***
