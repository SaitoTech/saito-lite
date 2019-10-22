const ArcadeMainTemplate = require('./arcade-main.template');
const ArcadeGameTemplate = require('./arcade-game.template');


module.exports = ArcadeMain = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; ***REMOVED***
    arcade_main.innerHTML = ArcadeMainTemplate();


    let gamelist = document.getElementById("arcade-gamelist");
console.log("\n\n\n\nPRE ADD:!");
console.log("LEN: " + data.games.length);
    data.games.forEach(mod => {
console.log("\n\n\n\nADD: " + JSON.stringify(mod.name));
      let gameobj = mod.respondTo("arcade-gamelist");
console.log("\n\n\n\nADD2: " + JSON.stringify(mod.name));
      if (gameobj != null) {
console.log("\n\n\n\nADD3: " + JSON.stringify(mod.name));
	gamelist.innerHTML += ArcadeGameTemplate(mod, gameobj);
console.log("\n\n\n\nADD4: " + JSON.stringify(mod.name));
  ***REMOVED***
***REMOVED***);

  ***REMOVED***,

  attachEvents(app, data) {
  ***REMOVED***

***REMOVED***
