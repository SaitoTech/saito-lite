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
         
     for (let i = 1; i <= game_mod.game.players.length; i++) {
      let player = this._playerBox(i);
      if (!document.getElementById("player-box-"+player)) { //Even a 1-player game has at #player-box-1
        let pBox = app.browser.htmlToElement(GamePlayerBoxTemplate(player));
        if (document.querySelector(".main")) //If Game has a Main, put the boxes in there
            document.querySelector(".main").append(pBox);
        else document.body.append(pBox);  //Otherwise, just append to body
        this.refreshName(i); //Player names included in box by default
       }

    }
  } catch (err) {console.log("Render error: ",err);}

    }

    attachEvents(app, data=null) {
      //try{
           for (let i = 1; i <= this.game_mod.game.players.length; i++) {
            let player = this._playerBox(i);
            if (!document.getElementById("player-box-"+player) || !document.getElementById("player-box-head-"+player)){
              console.log("Null DOM elements for Playerbox");
              return -1;
            }
            app.browser.makeDraggable("player-box-"+player,"player-box-head-"+player);
            document.querySelector("#player-box-head-"+player).style.cursor="grab";
          }
      //}catch(err){console.log("Events error:",err);}
    }

    /*
    Create a div wrapper for 
    */
    groupOpponents(){
      let html = `<div class="opponents" id="opponentbox"></div>`;
      let oBox = this.app.browser.htmlToElement(html);

      document.querySelector("#player-box-1").after(oBox); //Put new wrapper just after the player box 

      let opponents = this.returnPlayersBoxArray();
      opponents.shift(); //Remove the active player
      for (let o of opponents){
        let pbo = document.querySelector("#player-box-"+o);
        let pbho = document.querySelector("#player-box-head-"+o);
        if (!pbo || !pbho){
          console.log("DOM failure");
          return;
        }
        //Unset draggable (if activated)
        pbo.removeAttribute("style");
        pbho.removeAttribute("style");

        //Move Opponent Playerbox into container
        oBox.append(pbo);
      }
      //Make them draggable as a unit
      this.app.browser.makeDraggable("opponentbox");
    }

    /*
    Given the game_module-based player number, determine where they sit around the table
    */
    _playerBox(pnum){
      if (pnum<=0) return 1;
      let player_box = this.returnPlayersBoxArray();
      //Shift players in Box Array according to whose browser, so that I am always in seat 1
      let prank = 1+this.game_mod.game.players.indexOf(this.app.wallet.returnPublicKey());
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

      let selector = "#player-box-head-"+this._playerBox(pnum);
      let identicon = "";

      if (name == "") {
        name = this.game_mod.game.players[pnum-1];
        name = this.app.keys.returnUsername(name);
        identicon = this.app.keys.returnIdenticon(name);

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

