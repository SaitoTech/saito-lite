/*
  A Class to Make Playerboxes for displaying information about all the players in the game
  Basic template: 
    --- a Head for the Player's identicon and name
    --- a Div for Information (formatted to the players specification)
    --- a Div for Player log (to include additional information), 
          this defaults to status for the player and is used by some games for interactive controls
    --- a Div for graphical elements, such a dealt hand of cards

    Use render to create the playerboxes
    Use attachEvents to make them movable

*/

const GamePlayerBoxTemplate = require('./game-playerbox.template');

class GamePlayerBox {

    constructor(app) {
      this.app = app;
      this.game_mod = null;
    }


    /*
      Test is DOM contains element ID player-info-1, if not 
      create all the player boxes, positioned by PlayersBoxArray 
    */
    render(app, game_mod) {
      this.game_mod = game_mod;
      
      try {
      let playerboxes = [];
    /*
    if(this.game_mod.seats) {
      playerboxes = this.game_mod.seats;
    } else {
      playerboxes = this.returnPlayersBoxArray();
    }
    */
         
    for (let pnum = 0; pnum < game_mod.game.players.length; pnum++) {
          let player = this._playerBox(pnum);
          if (!document.getElementById("player-box-"+player)) { //Even a 1-player game has at #player-box-1
            let pBox = app.browser.htmlToElement(GamePlayerBoxTemplate(player));
            if (document.querySelector(".main")) //If Game has a Main, put the boxes in there
              document.querySelector(".main").append(pBox);
              else document.body.append(pBox);  //Otherwise, just append to body
              this.refreshName(pnum+1); //Player names included in box by default
        }
          }
        } catch (err) {}

    }

    attachEvents(app, data=null) {
      try{
           for (let pnum = 0; pnum < this.game_mod.game.players.length; pnum++) {
            let player = this._playerBox(pnum);
            app.browser.makeDraggable("player-box-"+player,"player-box-head-"+player);
            document.querySelector("#player-box-head-"+player).style.cursor="grab";
          }
      }catch(err){console.log(err);}
    }


    /*
    Given the game_module-based player number, determine where they sit around the table
    */
    _playerBox(pnum){
      if (pnum<0) return 1;
      let player_box = this.returnPlayersBoxArray();
      //Shift players in Box Array according to whose browser, so that I am always in seat 1
      let prank = this.game_mod.game.players.indexOf(this.app.wallet.returnPublicKey());
      let seat = pnum - prank;
      
      if (seat < 0) { seat += this.game_mod.game.players.length }
      return player_box[seat];
    }

    /*

    */
    returnPlayersBoxArray() {

      let player_box = [];
      if(this.game_mod.seats) {
        player_box = this.game_mod.seats;
      } else {
        if (this.game_mod.game.players.length == 2) { player_box = [1, 4]; }
        if (this.game_mod.game.players.length == 3) { player_box = [1, 3, 5]; }
        if (this.game_mod.game.players.length == 4) { player_box = [1, 3, 4, 5]; }
        if (this.game_mod.game.players.length == 5) { player_box = [1, 2, 3, 5, 6]; }
        if (this.game_mod.game.players.length == 6) { player_box = [1, 2, 3, 4, 5, 6]; }  
      }

      return player_box;

    }

    returnViewBoxArray() {
    
      let player_box = [];
    
      if (this.game_mod.game.players.length == 2) { player_box = [3, 5]; }
      if (this.game_mod.game.players.length == 3) { player_box = [3, 4, 5]; }
      if (this.game_mod.game.players.length == 4) { player_box = [2, 3, 5, 6]; }
      if (this.game_mod.game.players.length == 5) { player_box = [2, 3, 4, 5, 6]; }
    
      return player_box;
  
    }

    /*
    Classes p1-p6 fix the player boxes around the screen like a card table, 
    so you can provide a class-name stub to generate x1, x2, ... classes or 
    use a universal class name for all the boxes to customize the css 
    */
    addClassAll(className, isStub = true){
      if (isStub){
        for (let i = 1; i <= 6; i++){
          let box = document.querySelector(`#player-box-${i}`);
          if (box) box.classList.add(`${className}${i}`);
        }
      }else{
        let boxes = document.querySelectorAll(".player_box");
        for (let box of boxes){
          box.classList.add(className);
        }
      }
    }

    addClass(className, player = -1){
      let selector = "#player-box-"+this._playerBox(player);
      let box = document.querySelector(selector);
      if (box)
        box.classList.add(className);
    }

  


    refreshName(pnum, name="") {

      let selector = "#player-box-head-"+this._playerBox(pnum-1);
      let identicon = "";

      if (name == "") {
        name = this.game_mod.game.players[pnum-1];
        identicon = this.app.keys.returnIdenticon(name);
        name = this.app.keys.returnUsername(name);
	if (name != "") {
          if (name.indexOf("@") > 0) {
            name = name.substring(0, name.indexOf("@"));
          }
	}
      }
      let html = (identicon)? `<img class="player-identicon" src="${identicon}">` : ""; 
      html += `<div class="player-info-name">${name}</div>`;    
      this._updateDiv(selector,html);
    }

    _updateDiv(selector, html){
      let div = document.querySelector(selector);
      if (div)
        div.innerHTML = html; 
      else console.log(selector + " not found");
    }

    /*
    Different games may attach classes to the graphics container to customize the graphical display
    Card games will use hand/tinyhand
    Other games will use ...
    */
    addGraphicClass(className){
      let playerBoxes = document.querySelectorAll(".player-box-graphic");
      for (let hand of playerBoxes){
        hand.classList.remove(className);
        hand.classList.add(className);
      }
    }

    /*
    For all the refresh elements of playerbox, we default to this player (in the 1 seat)
    */

    refreshGraphic(html, pnum=-1) {
      this._updateDiv("#player-box-graphic-"+this._playerBox(pnum), html);
    }


  /*
    Log (plog) is another section of the playerbox for status/plog information, 
    also where we can insert menu options for player controls
    */
    refreshLog(html, pnum=-1) {
      this._updateDiv("#player-box-log-"+this._playerBox(pnum), html);
    }

    /*
    Info is a hide-able section of the playerbox, where we can display the player's score and role in this round
    (We typically hide it to clear up space when presenting menu options through the log, see below)
    */
    refreshInfo(html, pnum=-1){
      this._updateDiv("#player-box-info-"+this._playerBox(pnum), html);
    }

    hideInfo(pnum=-1){
      let selector = "#player-box-info-"+this._playerBox(pnum);
      try{
      document.querySelector(selector).classList.add("hidden");
      }catch(err){}
    }

    showInfo(pnum=-1){
      let selector = "#player-box-info-"+this._playerBox(pnum);
      try{
        document.querySelector(selector).classList.remove("hidden");
      }catch(err){
      }
    }

    

}

module.exports = GamePlayerBox

