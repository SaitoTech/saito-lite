const GamePlayerBoxTemplate = require('./game-playerbox.template');

class GamePlayerBox {

    constructor(app) {
      this.app = app;
      this.game_mod = null;
    }

    render(app, game_mod) {

      this.app = app;
      this.game_mod = game_mod;

      let playerboxes = this.returnPlayersBoxArray();

      try {
	let playerbox_id = "player-info-1";
        if (!document.getElementById(playerbox_id)) {
	  for (let pnum = 0; pnum < game_mod.game.players.length; pnum++) {
            document.body.append(app.browser.htmlToElement(GamePlayerBoxTemplate(playerboxes[pnum])));
	  }
        }
      } catch (err) {}

    }

    attachEvents(app, data) {
    }


    returnPlayersBoxArray() {

      let player_box = [];

      if (this.game_mod.game.players.length == 2) { player_box = [1, 4]; }
      if (this.game_mod.game.players.length == 3) { player_box = [1, 3, 5]; }
      if (this.game_mod.game.players.length == 4) { player_box = [1, 3, 4, 5]; }
      if (this.game_mod.game.players.length == 5) { player_box = [1, 2, 3, 5, 6]; }
      if (this.game_mod.game.players.length == 6) { player_box = [1, 2, 3, 4, 5, 6]; }

      return player_box;

    }

    returnViewBoxArray() {
    
      let player_box = [];
    
      if (this.game.players.length == 2) { player_box = [3, 5]; }
      if (this.game.players.length == 3) { player_box = [3, 4, 5]; }
      if (this.game.players.length == 4) { player_box = [2, 3, 5, 6]; }
      if (this.game.players.length == 5) { player_box = [2, 3, 4, 5, 6]; }
    
      return player_box;
  
    }



    refreshCards(pnum, cards=0) {

      let player_box = this.returnPlayersBoxArray();
      let player_box_num = player_box[pnum-1];
      let divname = "#player-info-hand-" + player_box_num;
      let boxobj = document.querySelector(divname);

      let newhtml = "";
      for (let z = 0; z < cards; z++) { newhtml += `<img class="card" src="${this.game_mod.card_img_dir}/red_back.png">`; }
      boxobj.innerHTML = newhtml;

    }


    refreshName(pnum, name="") {

      let player_box = this.returnPlayersBoxArray();
      let player_box_num = player_box[pnum-1];
      let divname = "#player-info-name-" + player_box_num;
      let boxobj = document.querySelector(divname);

      let player_name = name;
      if (player_name == "") {
        player_name = this.game_mod.game.players[pnum-1];
        player_name = this.app.keys.returnIdentifierByPublicKey(player_name, 1);
        if (player_name.indexOf("@") > 0) {
          player_name = player_name.substring(0, player_name.indexOf("@"));
        }
        if (player_name == this.game_mod.game.player[pnum-1]) {
          player_name = player_name.substring(0, 10) + "...";
        }
      }

      boxobj.innerHTML = player_name;

    }


    refreshStatus(pnum, status="") {

      let player_box = this.returnPlayersBoxArray();
      let player_box_num = player_box[pnum-1];
      let divname = "#player-info-" + player_box_num;
      let boxobj = document.querySelector(divname);
      let player_name = this.game_mod.game.players[pnum-1];

      boxobj.querySelector(".plog").innerHTML = status;

    }


}

module.exports = GamePlayerBox

