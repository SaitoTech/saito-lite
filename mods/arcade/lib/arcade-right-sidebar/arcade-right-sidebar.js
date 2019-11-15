const ArcadeRightSidebarTemplate 	= require('./arcade-right-sidebar.template.js');
const ObserverRow = require('./arcade-right-sidebar-observer-game-row.template.js');

module.exports = ArcadeRightSidebar = {

    render(app, data) {
      let players = [{ identicon : app.keys.returnIdenticon(app.crypto.hash("david")) }, { identicon : app.keys.returnIdenticon(app.crypto.hash("stephen")) }];
      document.querySelector(".arcade-right-sidebar").innerHTML = ArcadeRightSidebarTemplate();
      for (let i = 0; i < data.arcade.observer.length; i++) {
        document.querySelector(".arcade-sidebar-active-games-body").innerHTML
          += ObserverRow(data.arcade.observer[i], players, app.crypto.stringToBase64(JSON.stringify(data.arcade.observer[i])));
      }
    },

    attachEvents(app, data) {

      Array.from(document.getElementsByClassName('arcade-observer-game-btn')).forEach(game => {
        game.onclick = (e) => {
          data.arcade.observeGame(e.currentTarget.id);
        };
      });

    }

}



