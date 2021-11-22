const GamePlayerBoxTemplate = require('./game-playerbox.template');

/**
 * A Class to Make Playerboxes for displaying information about all the players in the game
 * Class converts Player numbers from game into user-oriented ids to distinguish this player from the opponents
 * 
 * Basic template: 
 *   Name --- a Head for the Player's identicon and name
 *   Info --- a Div for Information (formatted to the players specification)
 *   Log --- a Div for Player log (to include additional information), 
 *         this defaults to status for the player and is used by some games for interactive controls
 *   Graphic --- a Div for graphical elements, such a dealt hand of cards
 *
 *   You may insert whatever HTML you want into Info, Log, or Graphic. 
 *   Info can be hidden/displayed independently of the Player-Box
 *   Graphic can be assigned classnames for more flexible display behavior (such as outside the player-box)
 */
class GamePlayerBox {

    /**
     *  @constructor 
     *  @param app - Saito app
     */
    constructor(app) {
      this.app = app;
      this.game_mod = null;
    }


    /**
     * Creates player boxes according to number of players in game
     * Automatically assigns unique id #s to divs in DOM, but can be specified by setting a seats property in game object
     * @param app - Saito app
     * @param game_mod - the game object
    */
    render(app, game_mod) {
      this.game_mod = game_mod;
      
      try {
        let playerboxes = [];
         
        for (let i = 1; i <= game_mod.game.players.length; i++) {
          let player = this._playerBox(i);
          if (!document.getElementById(`player-box-${player}`)) {
            let pBox = app.browser.htmlToElement(GamePlayerBoxTemplate(player));
            if (document.querySelector(".main")) {
              document.querySelector(".main").append(pBox);
            } else { 
	            document.body.append(pBox);
	          }
            this.refreshName(i); //Player names included in box by default
          }
          if (document.getElementById((`player-box-${player}`))) {
            document.getElementById((`player-box-${player}`)).style.display = "block";
          }
        }
      } catch (err) {console.log("Render error: ",err);}
    }


    /** Doesn't do anything */
    attachEvents(app, data=null) {
      
    }

    /**
     * Adds draggability to all the playerboxes (not a default setting)
     */
    makeDraggable(){
      try{
           for (let i = 1; i <= this.game_mod.game.players.length; i++) {
            let player = this._playerBox(i);
            if (!document.getElementById(`player-box-${player}`) || !document.getElementById(`player-box-head-${player}`)){
              console.log("Null DOM elements for Playerbox");
              return -1;
            }
            app.browser.makeDraggable(`player-box-${player}`,`player-box-head-${player}`);
            document.querySelector(`#player-box-head-${player}`).style.cursor="grab";
          }
      }catch(err){console.log("Events error:",err);}
    }

    /**  Hide all Player-boxes  */
    hide() {
      try {
        for (let i = 1; i <= this.game_mod.game.players.length; i++) {
          let player = this._playerBox(i);
          if (document.getElementById((`player-box-${player}`))) {
            document.getElementById((`player-box-${player}`)).style.display = "none";
          }
         }
      } catch (err) {
      }
    }

    /** Show all playerboxes */
    show() {
      try {
        for (let i = 1; i <= this.game_mod.game.players.length; i++) {
          let player = this._playerBox(i);
          if (document.getElementById((`player-box-${player}`))) {
            document.getElementById((`player-box-${player}`)).style.display = "block";
          }
         }
      } catch (err) {
      }
    }


    /**
    * Groups all "opponent" playerboxes into a wrapper division
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

    /**
    * @param {int} pnum - player number, e.g. {1, 2, ... # of players}
    * Converts the player number to a "seat position" This player is always 1, unless you render with game.seats
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

    /**
    * Returns either game.seats or the default poker table seating schedule
    * 3 4 5 
    * 2 1 6
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

    /**
    * Returns poker table seating schedule for observer mode 
    * 3 4 5 
    * 2 _ 6
    */
    returnViewBoxArray() {
    
      let player_box = [];
    
      if (this.game_mod.game.players.length == 2) { player_box = [3, 5]; }
      if (this.game_mod.game.players.length == 3) { player_box = [3, 4, 5]; }
      if (this.game_mod.game.players.length == 4) { player_box = [2, 3, 5, 6]; }
      if (this.game_mod.game.players.length == 5) { player_box = [2, 3, 4, 5, 6]; }
    
      return player_box;
  
    }

    /**
    * Adds a class to each of the playerboxes
    * @param {string} className - user defined class (for css or DOM hacking)
    * @param {boolean} isStub - flag for whether to add a numerical suffic to classname so you can tell apart playerboxes
    * This function [addClassAll("poker-seat")] is required for Player-Box to accurately render around a card table
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

    /**
     * Individually a classname to one of the playerboxes
     * @param {string} className - name of class
     * @param {int} player - the player number (according to game), -1 means this player 
     */
    addClass(className, player = -1){
      let selector = "#player-box-"+this._playerBox(player);
      let box = document.querySelector(selector);
      if (box)
        box.classList.add(className);
    }

    /**
    * Add a class name to the "graphical" subdivision of each playerbox
    * @param {string} className - name of class
    */
    addGraphicClass(className){
      let playerBoxes = document.querySelectorAll(".player-box-graphic");
      for (let hand of playerBoxes){
        hand.classList.remove(className);
        hand.classList.add(className);
      }
    }


    /*
    * Helper class for updating different sections of Player-Box
    */
    _updateDiv(selector, html){
      let div = document.querySelector(selector);
      if (div)
        div.innerHTML = html; 
      else console.log(selector + " not found");
    }

    /**
     * Refresh Player Name (Player-Boxes show Identicon + Username in top line)
     * @param {int} pnum - the player number (according to game), -1 means this player 
     * @param {string} name - a user-provided name. If blank, will use whatever name is associated with the wallet
    */       
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

    /**
    * Insert provided html into the graphic subdivision of playerbox
    * @param {string} html - information to be displayed
    * @param {int} pnum - the player number (according to game), -1 means this player 
    */
    refreshGraphic(html, pnum=-1) {
      this._updateDiv("#player-box-graphic-"+this._playerBox(pnum), html);
    }


    /**
    * Insert provided html into the log subdivision of playerbox
    * @param {string} html - information to be displayed
    * @param {int} pnum - the player number (according to game), -1 means this player 
    */
    refreshLog(html, pnum=-1) {
      this._updateDiv("#player-box-log-"+this._playerBox(pnum), html);
    }

    /**
    * Insert provided html into the log subdivision of playerbox
    * @param {string} html - information to be displayed
    * @param {int} pnum - the player number (according to game), -1 means this player 
    */
    refreshInfo(html, pnum=-1){
      this._updateDiv("#player-box-info-"+this._playerBox(pnum), html);
    }

    /**
    * Hide the info subdivision of a given player-box
    * @param {int} pnum - the player number (according to game), -1 means this player 
    */
    hideInfo(pnum=-1){
      let selector = "#player-box-info-"+this._playerBox(pnum);
      try{
      document.querySelector(selector).classList.add("hidden");
      }catch(err){}
    }

    /**
    * Hide the info subdivision of a given player-box
    * @param {int} pnum - the player number (according to game), -1 means this player 
    */
    showInfo(pnum=-1){
      let selector = "#player-box-info-"+this._playerBox(pnum);
      try{
        document.querySelector(selector).classList.remove("hidden");
      }catch(err){
      }
    }
}

module.exports = GamePlayerBox

