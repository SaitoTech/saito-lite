const ArcadeRightSidebarTemplate = require('./arcade-right-sidebar.template.js');
const ObserverRow = require('./arcade-right-sidebar-observer-game-row.template.js');
const ArcadeMain = require('../arcade-main/arcade-main.js'); // Just for the back button

module.exports = ArcadeRightSidebar = {

  loaded_right_sidebar : 0,

  async render(app, data) {
    let publickey = app.wallet.returnPublicKey();
    let id = app.keys.returnIdentifierByPublicKey(publickey);
 
    if (this.loaded_right_sidebar == 0) {
      document.querySelector(".arcade-right-sidebar").innerHTML = ArcadeRightSidebarTemplate(publickey, id);
      this.loaded_right_sidebar = 1;
    }

    if (document.querySelector('.arcade-sidebar-balance')) {
      let balance = app.wallet.returnBalance();
      document.querySelector('.arcade-sidebar-balance').innerHTML = balance + " SAITO";
    }
    
    for (let i = 0; i < data.arcade.observer.length; i++) {
      let players = [];
      let players_array = data.arcade.observer[i].players_array.split("_");

      for (let z = 0; z < players_array.length; z++) {
        players.push({ identicon: app.keys.returnIdenticon(app.crypto.hash(players_array[z])), publickey: players_array[z] });
      }

      //document.querySelector(".arcade-sidebar-active-games-body").innerHTML += ObserverRow(data.arcade.observer[i], players, app.crypto.stringToBase64(JSON.stringify(data.arcade.observer[i])));
    }


    //
    // arcade sidebar
    //
    data.arcade.mods.forEach(mod => {
      let gameobj = mod.respondTo("arcade-sidebar");
      if (gameobj != null) {

        let modname = "arcade-sidebar-" + mod.slug;
        let x = document.querySelector(("." + modname));

        if (x == null || x == undefined) {
          document.querySelector(".arcade-right-sidebar").innerHTML += `<div class="${modname}"></div>`;
        }

      }
    });
    data.arcade.mods.forEach(mod => {
      let gameobj = mod.respondTo("arcade-sidebar");
      if (gameobj != null) {
        gameobj.render(app, data);
        gameobj.attachEvents(app, data);
      }
    });

  },

  attachEvents(app, data) {

    Array.from(document.getElementsByClassName('arcade-observer-game-btn')).forEach(game => {
      game.onclick = (e) => {
        data.arcade.observeGame(e.currentTarget.id);
      };
    });

    let reg_button = document.getElementById('register-button')
    if (reg_button)
      document.getElementById('register-button').onclick = (e) => {
        app.modules.returnModule("Registry").showModal();
      }

    let rewardsmod = app.modules.returnModule("Rewards");
    if (rewardsmod != null) {
      let predata = data;
      document.querySelector('.arcade-announcement').onclick = (e) => {
        document.querySelector('.arcade-main').innerHTML = '<div class="email-main"><div class="email-appspace"></div></div>';
        data = {};
        data.arcade = this;
        data.rewards = rewardsmod;
        rewardsmod.renderEmail(app, data);
        rewardsmod.attachEventsEmail(app, data);

        // Back button
        let btn = document.createElement("DIV");
        btn.innerHTML = '<i class="rewards-back fas fa-arrow-circle-left"></i> Back';
        btn.classList.add("arcade-main-back-button");
        document.querySelector('.arcade-main').prepend(btn);
        document.querySelector('.arcade-main-back-button').onclick = () => {
          ArcadeMain.render(app, predata);
          ArcadeMain.attachEvents(app, predata);
        }
      }
    }

  }


}




