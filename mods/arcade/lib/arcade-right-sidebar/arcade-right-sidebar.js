const ArcadeRightSidebarTemplate 	= require('./arcade-right-sidebar.template.js');
const ObserverRow = require('./arcade-right-sidebar-observer-game-row.template.js');

module.exports = ArcadeRightSidebar = {

    render(app, data) {
      document.querySelector(".arcade-right-sidebar").innerHTML = ArcadeRightSidebarTemplate();
      for (let i = 0; i < data.arcade.observer.length; i++) {

console.log("OBSERVER GAMES OPEN: " + JSON.stringify(data.arcade.observer));

        let players = [];
        let players_array = data.arcade.observer[i].players_array.split("_");
        for (let z = 0; z < players_array.length; z++) {
console.log("PLAYERS ARRAY: " + players_array);
	  players.push({ identicon : app.keys.returnIdenticon(app.crypto.hash(players_array[z])) , publickey : players_array[z] ***REMOVED***);
    ***REMOVED***
        document.querySelector(".arcade-sidebar-active-games-body").innerHTML
          += ObserverRow(data.arcade.observer[i], players, app.crypto.stringToBase64(JSON.stringify(data.arcade.observer[i])));
  ***REMOVED***


      //
      //
      //
      data.arcade.mods.forEach(mod => {
        let gameobj = mod.respondTo("arcade-sidebar");
        if (gameobj != null) {

          let modname = "arcade-sidebar-"+mod.name.toLowerCase();
          let x = document.querySelector(("."+modname));

          if (x == null || x == undefined) {
            document.querySelector(".arcade-right-sidebar").innerHTML += `<div class="${modname***REMOVED***"></div>`;
      ***REMOVED***

          gameobj.render(app, data);
          gameobj.attachEvents(app, data);
    ***REMOVED***
  ***REMOVED***);

***REMOVED***,

    attachEvents(app, data) {

      Array.from(document.getElementsByClassName('arcade-observer-game-btn')).forEach(game => {
        game.onclick = (e) => {
          data.arcade.observeGame(e.currentTarget.id);
    ***REMOVED***;
  ***REMOVED***);

***REMOVED***

***REMOVED***



