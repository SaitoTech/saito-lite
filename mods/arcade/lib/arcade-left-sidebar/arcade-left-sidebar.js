const ArcadeLeftSidebarTemplate 	= require('./arcade-left-sidebar.template.js');
const ArcadeGameCreate			= require('./../arcade-main/arcade-game-create/arcade-game-create');

module.exports = ArcadeLeftSidebar = {

    render(app, data) {

      document.querySelector(".arcade-left-sidebar").innerHTML = ArcadeLeftSidebarTemplate();

      for (let i = 0; i < data.arcade.mods.length; i++) {
        if (data.arcade.mods[i].respondTo('email-chat') != null) {
          data.arcade.mods[i].respondTo('email-chat').render(app, data);
    ***REMOVED***
  ***REMOVED***

      let games_menu = document.querySelector(".arcade-apps");
      let gamemods = data.arcade.mods;
      
      for (let i = 0; i < gamemods.length; i++) {
        if (gamemods[i].respondTo("arcade-games")) {
          games_menu.innerHTML += `<li class="arcade-navigator-item" id="${gamemods[i].name***REMOVED***">${gamemods[i].name***REMOVED***</li>`;
    ***REMOVED***
  ***REMOVED***

***REMOVED***,

    attachEvents(app, data) {

      Array.from(document.getElementsByClassName('arcade-navigator-item')).forEach(game => {
        game.addEventListener('click', (e) => {

          data.active_game = e.currentTarget.id;

          ArcadeGameCreate.render(app, data);
          ArcadeGameCreate.attachEvents(app, data);

    ***REMOVED***);
  ***REMOVED***);



      for (let i = 0; i < data.arcade.mods.length; i++) {
        if (data.arcade.mods[i].respondTo('email-chat') != null) {
          data.arcade.mods[i].respondTo('email-chat').attachEvents(app, data);
    ***REMOVED***
  ***REMOVED***
***REMOVED***

***REMOVED***



