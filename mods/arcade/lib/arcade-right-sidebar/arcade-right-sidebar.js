const ArcadeRightSidebarTemplate 	= require('./arcade-right-sidebar.template.js');
const ObserverRow = require('./arcade-right-sidebar-observer-game-row.template.js');

module.exports = ArcadeRightSidebar = {

    render(app, data) {
      document.querySelector(".arcade-right-sidebar").innerHTML = ArcadeRightSidebarTemplate();
      for (let i = 0; i < data.arcade.observer.length; i++) {
        document.querySelector(".arcade-sidebar-active-games-body").innerHTML
          += ObserverRow(data.arcade.observer[i], app.crypto.stringToBase64(JSON.stringify(data.arcade.observer[i])));
      }
    },

    attachEvents(app, data) {

      Array.from(document.getElementsByClassName('arcade-observer-game-id')).forEach(game => {
        game.onclick = (e) => {
          alert("CLICKED TO OBSERVE: " + e.currentTarget.id);
          data.arcade.observeGame(e.currentTarget.id);
        };
      });

    }

}



