const saito = require('../../lib/saito/saito');
const GameTemplate = require('../../lib/templates/gametemplate');
const GameBoardSizer = require('../../lib/templates/lib/game-board-sizer/game-board-sizer');
const GameHammerMobile = require('../../lib/templates/lib/game-hammer-mobile/game-hammer-mobile');

class Wordblocks extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "Wordblocks";

    this.wordlist="";
    this.letterset= {};
    this.mydeck = {};
    this.score="";
    this.app = app;
    this.name = "Wordblocks";
    this.description = `Wordblocks is a word game in which two to four players score points by placing tiles bearing a single letter onto a board divided into a 15×15 grid of squares. The tiles must form words that, in crossword fashion, read left to right in rows or downward in columns, and be included in a standard dictionary or lexicon.`;
    this.categories = "Game Arcade Entertainment";
    //
    // Game Class VARS
    //
    this.minPlayers = 2;
    this.maxPlayers = 4;
    this.type       = "Wordgame";
    this.useHUD = 1;


    this.gameboardWidth = 2677;
    this.tileHeight = 163;
    this.tileWidth = 148;
    this.letters = {};
    this.moves = [];
    this.firstmove = 1;
    this.last_played_word = {};


    this.defaultMsg = `Click on the board to enter a word from that square, click a tile to select it for play, or <span class="link tosstiles" title="Double click tiles to select them for deletion">discard tiles</span> if you cannot move.`;


    return this;

  }
  // requestInterface(type) {
  // 
  //   if (type == "arcade-sidebar") {
  //     return { title: this.name };
  //   }
  //   return null;
  // }
  //
  // manually announce arcade banner support
  //
  respondTo(type) {
    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }
    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/wordblocks/img/arcade/arcade-banner-background.png";
      obj.title = "Wordblocks";
      return obj;
    }

    return null;

  }


  showTiles() {

    if (this.game.deck.length == 0) {
      return;
    }

    let html = "";

    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        let thiscard = this.game.deck[0].cards[this.game.deck[0].hand[i]];
        if (thiscard != undefined) {
          html += this.returnTileHTML(thiscard);
        }
    }

    $('.tiles').html(html);
    $('#remainder').html("DECK: " + this.game.deck[0].crypt.length);

  }




  initializeHTML(app) {

    this.hud.mode = 0; // square

    super.initializeHTML(app);
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(this.app, this);
    });

    this.menu.addMenuOption({
      text : "Game",
      id : "game-game",
      class : "game-game",
      callback : function(app, game_mod) {
        game_mod.menu.showSubMenu("game-game");
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "How to Play",
      id : "game-intro",
      class : "game-intro",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.overlay.showOverlay(game_mod.app, game_mod, game_mod.returnRulesOverlay());
      }
    });

    //toggleLog causes an error because game-log is not robust 
    //Do we even need this? What does GameLog do?
    /*this.menu.addSubMenuOption("game-game", {
      text : "Log",
      id : "game-log",
      class : "game-log",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.log.toggleLog();
      }
    });*/
    this.menu.addSubMenuOption("game-game", {
      text : "Stats",
      id : "game-stats",
      class : "game-stats",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.overlay.showOverlay(game_mod.app, game_mod, game_mod.returnStatsOverlay());
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Exit",
      id : "game-exit",
      class : "game-exit",
      callback : function(app, game_mod) {
        window.location.href = "/arcade";
      }
    });



    let main_menu_added = 0;
    let community_menu_added = 0;
    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].slug === "chat") {
        for (let ii = 0; ii < this.game.players.length; ii++) {
          if (this.game.players[ii] != this.app.wallet.returnPublicKey()) {

            // add main menu
            if (main_menu_added == 0) {
              this.menu.addMenuOption({
                text : "Chat",
                id : "game-chat",
                class : "game-chat",
                callback : function(app, game_mod) {
                  game_mod.menu.showSubMenu("game-chat");
                }
              })
              main_menu_added = 1;
            }

            if (community_menu_added == 0) {
              this.menu.addSubMenuOption("game-chat", {
                text : "Community",
                id : "game-chat-community",
                class : "game-chat-community",
                callback : function(app, game_mod) {
                  game_mod.menu.hideSubMenus();
                  chatmod.mute_community_chat = 0;
                  chatmod.sendEvent('chat-render-request', {});
                  chatmod.openChatBox();
                }
              });
              community_menu_added = 1;
            }
            // add peer chat
            let data = {};
            let members = [this.game.players[ii], this.app.wallet.returnPublicKey()].sort();
            let gid = this.app.crypto.hash(members.join('_'));
            let name = "Player "+(ii+1);
            let chatmod = this.app.modules.mods[i];

            this.menu.addSubMenuOption("game-chat", {
              text : name,
              id : "game-chat-"+(ii+1),
              class : "game-chat-"+(ii+1),
              callback : function(app, game_mod) {
                game_mod.menu.hideSubMenus();
                chatmod.createChatGroup(members, name);
                chatmod.openChatBox(gid);
                chatmod.sendEvent('chat-render-request', {});
                chatmod.saveChat();
              }
            });
          }
        }
      }
    }
    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        app.browser.requestFullscreen();
      }
    });
    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

    this.hud.render(app, this);

    try {

      if (app.browser.isMobileBrowser(navigator.userAgent)) {

        GameHammerMobile.render(this.app, this);
        GameHammerMobile.attachEvents(this.app, this, '.gameboard');

      } else {

        GameBoardSizer.render(this.app, this);
        GameBoardSizer.attachEvents(this.app, this, '.gameboard');

        $('#gameboard').draggable();

      }
    } catch (err) {}

  }


  returnRulesOverlay() {

    let overlay_html = `<div class="intro">
      <h1>Welcome to Wordblocks</h1>
      <p>Game play is similar to the classic crossword puzzle boardgame. Players take turns spelling words using the seven letters in their tile rack and available space on the game board. The game ends when one player finishes all the letters in their rack and there are no remaining tiles to draw.</p>
      <p>Players may discard any number of tiles from their rack in lieu of playing a word.</p>
      <h2>Scoring</h2>
      <p>Each letter is worth the number of points indicated on the tile. The score for the word is the sum of point values of its letters, which may be affected by playing the word over bonus spaces on the board. </p>
      <p>If you use all 7 tiles in one play, you receive 10 additional points to the letter score and a +1 multiple on the overall word score.</p>
      </div>`;
    return overlay_html;
    

  }

  returnMath(play){
    let sum = 0;
    let html = `<div class="score-overlay"><table>
              <thead><tr><td>Word</td><td>Calculation</td><td>Points</td></tr></thead><tbody>`;
    for (let word of play){
      html += `<tr><td>${word.word}</td><td>${word.math}</td><td>${word.score}</td></tr>`;
      sum += word.score;
    }

    html += `</tbody><tfoot><tr><td colspan="3"><hr></td></tr><tr><td>Total:</td><td></td><td>${sum}</td></tr></tfoot></table></div>`;
    return html;
  }



  returnStatsOverlay() {

    let html = `<div class="stats-overlay"><table cellspacing="10px" rowspacing="10px"><tr><th>Round</th>`;
    for (let i = 0; i < this.game.opponents.length+1; i++) {
      html += `<th colspan="2">Player ${(i+1)}</th>`;
    }

    let totals = new Array(this.game.opponents.length+1); //Each players total...
    totals.fill(0);
    console.log(this.game.opponents);
    for (let z = 0; z < this.game.words_played[0].length; z++) {
      html += `</tr><tr><td>${z+1}</td>`;
      for (let i = 0; i < this.game.opponents.length+1; i++) {
        //totals.push(0); //Initialize
        //let words_scored_html = '<table>';
        if (this.game.words_played[i][z] != undefined) {
	         html += '<td>' + this.game.words_played[i][z].word + '</td><td>' + this.game.words_played[i][z].score + '</td>';
	         totals[i] += this.game.words_played[i][z].score;
        }
      }
        //words_scored_html += '</table>';
      //html += `<td>${words_scored_html}</td>`;
    }
    console.log(totals);
    html += '</tr><tr><td colspan="10"><hr></td></tr><tfoot><tr><td>Totals</td>';
    for (let total of totals) {
      html += `<td colspan="2">${total}</td>`;
    }
    html += '</tr></tfoot></table></div>';
    return html;

  }





  initializeGame(game_id) {

    // OBSERVER MODE
    //if (this.game.player == 0) { return; }

    this.updateStatus("loading game...");
    this.loadGame(game_id);

    if (this.game.status != "") {
      this.updateStatus(this.game.status);
    }

    var dictionary = this.game.options.dictionary;
    let durl = "/wordblocks/dictionaries/" + dictionary + "/" + dictionary + ".js";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', durl, false);

    try {
      xhr.send();
      if (xhr.status != 200) {
        salert(`Network issues downloading dictionary -- ${durl}`);
      } else {
        //
        // TODO -- dictionary should be JSON
        //
        eval(xhr.response);
        this.wordlist = wordlist;
      }
    } catch (err) { // instead of onerror
      salert("Network issues downloading dictionary");
    }

    //console.log("\n\n\nDOWNLOADED WORDLIST: " + JSON.stringify(this.wordlist));

    //
    // deal cards 
    //
    if (this.game.deck.length == 0 && this.game.step.game == 1) {

      this.updateStatus("Generating the Game");

      if (this.game.opponents.length == 1) {
        this.game.queue.push("READY");
        this.game.queue.push("DEAL\t1\t2\t7");
        this.game.queue.push("DEAL\t1\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
      }

      if (this.game.opponents.length == 2) {
        this.game.queue.push("READY");
        this.game.queue.push("DEAL\t1\t3\t7");
        this.game.queue.push("DEAL\t1\t2\t7");
        this.game.queue.push("DEAL\t1\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
      }

      if (this.game.opponents.length == 3) {
        this.game.queue.push("READY");
        this.game.queue.push("DEAL\t1\t4\t7");
        this.game.queue.push("DEAL\t1\t3\t7");
        this.game.queue.push("DEAL\t1\t2\t7");
        this.game.queue.push("DEAL\t1\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
      }
      let tmp_json = JSON.stringify(this.returnDeck());
      this.game.queue.push("DECK\t1\t" + tmp_json);
    };
    //
    // stop here if initializing
    //
    if (this.game.initializing == 1) { return; }


    resizeBoard = function resizeBoard(app) {}
    responsive = function responsive() {};

    //
    // show tiles
    //
    this.showTiles();

    //
    // initialize scoreboard
    //
    let html = "";
    let am_i_done = 0;
    let players = 1;

    if (this.game.opponents != undefined) {
      players = this.game.opponents.length + 1;
    }

    let score = [];

    if (this.game.score == undefined) {
      this.game.score = [];
      for (let i = 0; i < players; i++) {
        this.game.score[i] = 0;
      }
    }

    if (this.game.words_played == undefined) {
      this.game.words_played = [];
      for (let i = 0; i < players; i++) {
        this.game.words_played[i] = [];
      }
    }


    var op = 0;
    for (let i = 0; i < players; i++) {
      let this_player = i + 1;

      if (this.game.player == this_player) {
        html += `
          <div class="player">
            <span class="player_name">Player ${this.game.player} (you)</span>
            <span id="score_${this_player}"> ${this.game.score[i]} </span>
          </div>
        `;
      } else {
      if (this.game.player != 0) {
        let opponent = this.game.opponents[op];
        // we do this here
        opponent = this.app.keys.returnIdentifierByPublicKey(opponent, true);
        op++;
        html += `
          <div class="player">
            <span class="player_name">${opponent.substring(0, 16)}</span>
            <span id="score_${this_player}"> ${this.game.score[i]} </span>
          </div>
        `;
      }
      }
    }

    if (this.browser_active == 1) {
      try {
        $('.score').html(html);
      } catch (err) {}
    }


    //
    // return letters
    //
    this.letters = this.returnLetters();

    //
    // initialize interface
    //
    resizeBoard(this.app);

    //
    // load any existing tiles
    //
    if (this.game.board == undefined) {
      //
      // new board
      //
      this.game.board = this.returnBoard();
    } else {
      //
      // load board
      //
      for (var i in this.game.board) {
        let divname = "#" + i;
        let letter = this.game.board[i].letter; // $(divname).html(this.returnTile(letter));
        this.addTile($(divname), letter);
        if (!(letter == "_") && !(letter == "")) {
	  try {
            $(divname).addClass("set");
          } catch (err) {}
        }
      }
    }

    //
    // has a move been made
    //
    for (let i = 1; i < 16; i++) {
      for (let k = 1; k < 16; k++) {
        let boardslot = i + "_" + k;
        if (this.game.board[boardslot].letter != "_") {
          this.firstmove = 0;
        }
      }
    }

    if (this.game.target == this.game.player) {
      this.updateStatusWithTiles("YOUR GO! "+this.defaultMsg);
      this.enableEvents();
    } else {
      this.updateStatusWithTiles(`Waiting for Player ${this.game.target} to move.`);
    }

    try {
        
      $('#game_status').on('click', () => {
        $('.log').hide();
        if (this.app.browser.isMobileBrowser(navigator.userAgent) && window.matchMedia("(orientation: portrait)").matches || window.innerHeight > 700) {
          $("#sizer").switchClass("fa-caret-up", "fa-caret-down");
          $("#hud").switchClass("short", "tall", 150);
        } else {
          $("#sizer").switchClass("fa-caret-left", "fa-caret-right");
          $("#hud").switchClass("narrow", "wide", 150);
        }

        $('.hud_menu_overlay').hide();
        $('.status').show();
      });

    } catch (err) {}

  }


  updateStatusWithTiles(status) {

    try {

    let tile_html = '';
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      tile_html += this.returnTileHTML(this.game.deck[0].cards[this.game.deck[0].hand[i]].name);
    }
    let last_move_html;
      if (this.last_played_word.word) {
        let playerName = (this.game.player === this.last_played_word.player) ? "You" : `Player ${this.last_played_word.player}`;
        if (this.last_played_word.score>0){
          last_move_html = `${playerName} played ${this.last_played_word.word} for: ${this.last_played_word.score} points (total: ${this.last_played_word.totalscore})`;
        }else{
          last_move_html = `${playerName} discarded the tiles <span style="text-transform:uppercase;">[${this.last_played_word.word.split("").join()}</span>]`;
        }
      }else{
        last_move_html = '...' ;
      } 
    let html =
      `
      <div class="hud-status-update-message">${status}</div>
      <div class="status_container">
        <div class="rack" id="rack">
          <div class="tiles" id="tiles">
            ${tile_html}
          </div>
        </div>
        <div class="subrack" id="subrack">
          <div class="rack-controls">
            <div>Shuffle: <img id="shuffle" class="shuffle" src="/wordblocks/img/reload.png"></div>
            <div id="deletectrl" class="hidden deletectrl"><i class="fa fa-trash" aria-hidden="true" id="delete"></i>
<i id="canceldelete" class="far fa-window-close"></i></div>
            <div id="remainder" class="remainder">Remaining Tiles: ${this.game.deck[0].crypt.length}</div>
        </div>
        <div class="lastmove" id="lastmove">${last_move_html}</div>
        <div class="score" id="score"></div>
        </div>
      </div
    `;
    
    this.updateStatus(html); //Attach html to #status box
    this.calculateScore(); //Calculate player scores and insert into #score
    this.limitedEvents(); //Baseline functionality   
    } catch (err) {
      console.log(err);
    }
  }



  async calculateScore() {
    let html = "";
    let am_i_done = 0;
    let players = 1; 

    if (this.game.opponents != undefined) {
      players = this.game.opponents.length + 1;
    }

    let score = [];

    if (this.game.score == undefined) {
      this.game.score = [];
 
      for (let i = 0; i < players; i++) {
        this.game.score[i] = 0;
      }
    }

    var op = 0;

    for (let i = 0; i < players; i++) {
      let this_player = i + 1;


      let name = this.app.keys.returnUsername(this.game.players[i]);
      let identicon = this.app.keys.returnIdenticon(this.game.players[i]);

      if (name != "") {
        if (name.indexOf("@") > 0) {
          name = name.substring(0, name.indexOf("@"));
        }
      }
      //>>>>>>>>Improving HUD display
      if (this.game.player == this_player) {
        html += `
          <div class="player">
            <img class="player-identicon" src="${identicon}">
            <span class="player_name">Me (Player ${this.game.player})</span>
            <span class="player_score" id="score_${this_player}"> ${this.game.score[i]} </span>
          </div>
        `;
      } else {
        let opponent = this.game.opponents[op];
        opponent = this.app.keys.returnIdentifierByPublicKey(opponent, true);
        op++;
        html += `
          <div class="player">
            <img class="player-identicon" src="${identicon}">
            <span class="player_name">Player ${this_player}: ${name}</span>
            <span class="player_score" id="score_${this_player}"> ${this.game.score[i]} </span>
          </div>
        `;
      }
    }


    if (this.browser_active == 1) {
      document.querySelector('.score').innerHTML = html;
    }
  }



  returnTileHTML(letter) {
    let html = "";
    let letterScore = this.returnLetters();
    if (letterScore[letter]) {
      html = '<div class="tile ' + letter + ' sc'+ letterScore[letter].score + '">' + letter + '</div>';
    }
    return html;
  }


  addTile(obj, letter) {
    if (letter !== "_") {
      obj.find('.bonus').css('display', 'none');
      obj.append(this.returnTileHTML(letter));
    }
  }


  /*
  Basic events for all players to interact with their hud even when not their turn
  */
  limitedEvents() {
    let wordblocks_self = this;
    if (this.browser_active == 1) {
      $('.slot').off();
      $('#rack .tile').off();
      $('#tiles').disableSelection();
      //Drag to Sort tiles on Rack     
      $('#tiles').sortable({axis:"x",tolerance:"pointer",containment:"parent",distance:3,
        start: function(event,ui){$(ui.item).addClass('noclick');},
        stop: function(event,ui){setTimeout(function(){$(ui.item).removeClass('noclick');},350);}
      });

     //Shuffle Rack
      $('#shuffle').on('click', function () {
        for (var i = $('#tiles').children.length; i >= 0; i--) {
          $('#tiles')[0].appendChild($('#tiles')[0].childNodes[Math.random() * i | 0]);
        }
      });
      /* Click to popup more information on what the last move just was */
      $('#lastmove').off();
      $('#lastmove').on('click', function(){
        wordblocks_self.overlay.showOverlay(wordblocks_self.app, wordblocks_self, wordblocks_self.returnMath(wordblocks_self.last_played_word.play));
      });

    }
  }


  enableEvents() {
    if (this.browser_active == 1) {
      this.addEventsToBoard();
    }
  }


  /*
    Create event listeners for user interaction
    We have various modes, which when changed need to call this function again to refresh the event model
    hud-status-update-message
  */
  async addEventsToBoard() {
    if (this.browser_active == 0) { return; }
    let wordblocks_self = this;
    let tile = document.querySelector(".highlighttile");
    let interactiveMode = (document.querySelector(".slot .tempplacement") || document.querySelector("#tiles .highlighttile"));
    
    
    try {
      /*
      Define a few helper functions because there are multiple ways to get to the same code
      */
      let revertToPlay = function(){
        //Unselect all double-clicked tiles
        $(".tiles .tile").removeClass("todelete");
        $("#tiles").sortable("enable"); 
        $("#deletectrl").addClass("hidden");
        $("#delete").off();
        $("#canceldelete").off();
        wordblocks_self.addEventsToBoard();
      }
      let selectTile = function(selection,e){
        $(".highlighttile").removeClass("highlighttile");
          tile = selection;
          $(tile).addClass("highlighttile");  
          let helper = tile.cloneNode(true);
          helper.id = "helper";
          $(document.body).append(helper);
          $("#helper").css({"top":e.clientY-25,"left":e.clientX-25});
      }
      let deselectTile = function(){
        $(".highlighttile").removeClass("highlighttile");
          tile = null;
          $("#helper").remove();
      }
      let checkBoard = function(){
        $('.tile-placement-controls').remove(); //Removes previous addition
        //Popup to commit word
        //Get the x,y, orientation and word from tiles
        let [word, orientation, x, y] = wordblocks_self.readWordFromBoard();
        if (word){
            let html = `
            <div class="tile-placement-controls">
              <span class="playable">${word}</span>
              <span class="action" id="submit"><i class="fa fa-paper-plane"></i> Submit</span>
              <span class="action" id="cancel"><i class="far fa-window-close"></i> Cancel</span>
            </div>`;

            $('body').append(html);
            $('.tile-placement-controls').addClass("active-status");
            $('.tile-placement-controls').css({ "position": "absolute", "top":"40vh", "right": "1em" });

            $('.action').off();
            $('.action').on('click', function () {
              $('.action').off();
              $('.tile-placement-controls').remove();
              //Remove the temporary tiles
              wordblocks_self.clearBoard();
              if ($(this).attr("id") == "submit"){
                console.log(word,orientation,x,y);            
                wordblocks_self.tryPlayingWord(x,y,orientation,word);
              }else{
                wordblocks_self.addEventsToBoard();
              } 
              });
          }
      }

      //Float helper tile with mouse over board
      $(document).on("mousemove",function(e){
            //$("#helper").css("transform",`translate(${e.clientX+5}px, ${e.clientY+5}px)`);
            $("#helper").css({"top":e.clientY-25,"left":e.clientX-25});
          });

      $('#shuffle').off(); //Don't want to shuffle when manually placing tiles or deleting
      $('.slot').off(); //Reset clicking on board

      $('#rack .tile').off();

      //Single click to select a tile and enter interactive placement mode
      $('#rack .tile').on('click',function(e){
        if (!$(this).hasClass("noclick")){ //Wasn't just dragging this tile and triggering a click event
          if (!$(this).hasClass("highlighttile")){
            console.log("Selection");
            selectTile(this,e);    //Helper function to create floating tile
          }else{
            $("#helper").remove(); //Delete floating tile
            $(".highlighttile").removeClass("highlighttile");
            tile = null;  
          }
          //Reload events if changing input model
          if (interactiveMode != (document.querySelector(".slot .tempplacement") || document.querySelector("#tiles .highlighttile")))
            wordblocks_self.addEventsToBoard();
        }
      });


      //Discard Tiles -- Method 2
      $('#rack .tile').on("dblclick", function(){
        //Toggle deleted on/off with each double click
        this.classList.toggle("todelete");
        
        //Do we have tiles selected for deletion?
        let deletedTiles = "";
          let tileRack = document.querySelectorAll(".tiles .tile"); 
          for (let i = 0; i < tileRack.length; i++){
            if (tileRack[i].classList.contains("todelete"))
              deletedTiles += tileRack[i].textContent;
          }
        
        //If tiles selected for deletion enter deletemode
        if (deletedTiles.length>0){
          $(".hud-status-update-message").text("Select the tiles you want to trash and click the trash icon to confirm (this will count as your turn).");

          $("#tiles").sortable("disable");
          $(".tile").off("click"); //block clicking 
          $("#deletectrl").removeClass("hidden");
          $("#delete").off();
          $("#delete").on("click",function(){
            wordblocks_self.discardAndDrawTiles(deletedTiles);
          });
          $("#canceldelete").off();
          $("#canceldelete").on("click",revertToPlay);
        } else{ //Exit deletemode
          revertToPlay();
        }      
      });

     
      /*
      Default/Original mode
      Allow shuffling of rack and click on board to launch text entry
      */
      if (!interactiveMode){
        $("#helper").remove(); //clean up just in case
        $(".hud-status-update-message").html(wordblocks_self.defaultMsg); //update instructions to player
         //Click on game board to type a word
      
        $('.slot').on('mousedown', function (e) {
          xpos = e.clientX;
          ypos = e.clientY;
        });
        //Create as menu on the game board to input word from a tile in horizontal or vertical direction
        $('.slot').on('mouseup', function (e) {
          if (Math.abs(xpos-e.clientX) > 4) { return; }
          if (Math.abs(ypos-e.clientY) > 4) { return; }
          let divname = $(this).attr("id");
          let html = `
            <div class="tile-placement-controls">
              <span class="action" id="horizontal"><i class="fas fa-arrows-alt-h"></i> horizontally</span>
              <span class="action" id="vertical"><i class="fas fa-arrows-alt-v"></i> vertically</span>
              <span class="action" id="cancel"><i class="far fa-window-close"></i> cancel</span>
            </div>`;
          let tmpx = divname.split("_");
          let y = tmpx[0];
          let x = tmpx[1];
          let word = "";

          let offsetX = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 25 : 55;
          let offsetY = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 25 : 55;

          let greater_offsetX = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 135 : 155;
          let greater_offsetY = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 135 : 155;

          let left = $(this).offset().left + offsetX;
          let top = $(this).offset().top + offsetY;

          if (x > 8) { left -= greater_offsetX; }
          if (y > 8) { top -= greater_offsetY; }

          $('.tile-placement-controls').remove(); //Removes previous addition

          if (wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent)) {
            let tile_html = '';
            for (let i = 0; i < wordblocks_self.game.deck[0].hand.length; i++) {
              tile_html += wordblocks_self.returnTileHTML(wordblocks_self.game.deck[0].cards[wordblocks_self.game.deck[0].hand[i]].name);
            }
            let updated_status = `
            <div class="rack" id="rack">
              <div class="tiles" id="tiles">
                ${tile_html}
              </div>
              <img id="shuffle" class="shuffle" src="/wordblocks/img/reload.png">
            </div>
            ${html}
            `
            $('.status').html(updated_status);
            wordblocks_self.enableEvents();
          } else {
            $('body').append(html);
            $('.tile-placement-controls').addClass("active-status");
            $('.tile-placement-controls').css({ "position": "absolute", "top": top, "left": left });
          }

          //Launch asynch prompt for typed word
          $('.action').off();
          $('.action').on('click', async function () {
            let orientation = $(this).attr("id"); //horizontal, vertical, cancel

            if (orientation == "cancel") {
              $('.action').off();
              $('.tile-placement-controls').remove();
              wordblocks_self.updateStatusWithTiles(wordblocks_self.defaultMsg);
              wordblocks_self.enableEvents();
              return;
            }

            word = await sprompt("Provide your word:");

            //Process Word
            if (word) {
              wordblocks_self.tryPlayingWord(x,y,orientation,word);
            }
          });
        });

      /* 
      Enable shuffling in this mode 
      */
      $('#shuffle').on('click', function () {
        for (var i = $('#tiles').children.length; i >= 0; i--) {
          $('#tiles')[0].appendChild($('#tiles')[0].childNodes[Math.random() * i | 0]);
        }
      });
    }else{
    
    //Alternate tile manipulation event model:     interactive placement   

      $(".hud-status-update-message").text("Click a tile to select/deselect it, then click the board to place it. Double click to move it back to the rack");
      $('.tile-placement-controls').remove();
  
      $('#rack .tile').off("dblclick"); //Turn off dbl click to delete

      //Double click to remove from board
      $('.slot').on('dblclick',function(){    
        let clkTarget = this.querySelector(".tile");
        if (clkTarget && $(clkTarget).hasClass("tempplacement")){
          $(".highlighttile").removeClass("highlighttile");   
          $('#tiles').append(clkTarget);  
          //Show bonus information if uncovered
          if (this.querySelector(".bonus")){
            this.querySelector(".bonus").style.display = "block";
          }
          checkBoard(); //Helper function to display submission button if deleting this tile gives us a "playable" word
          if (!((document.querySelector(".slot .tempplacement") || document.querySelector("#tiles .highlighttile")))){
            wordblocks_self.addEventsToBoard();
          }
        }
      });

      //Click slot to move tile on board      
      $('.slot').on('click',function(e){
      //Is slot occupied?
        if (this.querySelector(".tile")){ //Will select tile first
          let conflict = this.querySelector(".tile");
          if (conflict.classList.contains("tempplacement")){
            if (!(tile)){ //If we don't have a currently selected tile
              console.log("Select new:",tile,conflict);
              selectTile(conflict,e);
              //tile = conflict;
              //$(tile).addClass("highlighttile");
            }else if (conflict.classList.contains("highlighttile")){ //Toggle selection of tile
              console.log("Deselect:",tile,conflict);
              deselectTile();
            }else{ 
              console.log("Swap selection:",tile,conflict);
              deselectTile();
              selectTile(conflict,e);
            }
          }
        }else{ //Slot is empty
          if (tile){ //Move tile if we have one selected
            //Hide bonus information if covered
            if (this.querySelector(".bonus")){
              this.querySelector(".bonus").style.display ="none";
            } //Show bonus information if uncovered
            if (tile.parentElement.querySelector(".bonus")){
              tile.parentElement.querySelector(".bonus").style.display = "block";
            }
            //Move tile to board
            this.append(tile);
            $(tile).addClass("tempplacement");
            $(tile).off();  
            deselectTile();
          }else{
            console.log("must select a tile first");
          }
        }
        checkBoard();    
        });
      }

      //Discard Tiles -- Old Method
      //Must be added here because maybe refreshing the hud-status-message
      $('.tosstiles').off();
      $('.tosstiles').on('click', async function () {
        tiles = await sprompt("Which tiles do you want to discard?");
        if (tiles) {
          wordblocks_self.discardAndDrawTiles(tiles);
        }
      });


    } catch (err) {console.log(err);}   
  }

/*
  Move all temporary tiles from board back to rack
*/
clearBoard(){
  let playedTiles = document.querySelectorAll(".slot .tempplacement");
  for (let t of playedTiles){
     if (t.parentElement.querySelector(".bonus")){
        t.parentElement.querySelector(".bonus").style.display = "block";
      }
    $(".tiles").append(t);
  }
}

/*
  Scan for the board to find a consecutive arrangement of temporary tiles
  Returns: Word, orientation, x, y (of starting square)
*/
readWordFromBoard(){
  let playedTiles = document.querySelectorAll(".slot .tempplacement");
  let minx = 16, miny = 16, maxx = 0, maxy = 0;
  for (let t of playedTiles){
    let [x,y] = t.parentElement.id.split("_");
    x = parseInt(x);
    y = parseInt(y);
    if (x > maxx) maxx = x;
    if (x < minx) minx = x;
    if (y > maxy) maxy = y;
    if (y < miny) miny = y;
  }
  //console.log(minx,miny,"---",maxx,maxy);
  let word = "";
  let orientation = "";
  let fail = false;
  if (maxx == minx){
    orientation = "horizontal";
    for (let i = miny; i <= maxy; i++){
      let slot = maxx+"_"+i;
      let div = document.getElementById(slot);
      if (div){
        if (div.querySelector(".tile")){
          word += div.querySelector(".tile").textContent;
        }else fail = true;
      }else fail = true;
    }
  }else if (maxy == miny){
    orientation = "vertical";
    for (let i = minx; i <= maxx; i++){
      let slot = i+"_"+maxy;
      let div = document.getElementById(slot);
      if (div){
        if (div.querySelector(".tile")){
          word += div.querySelector(".tile").textContent;
        }else fail = true;
      }else fail = true;
    }
  }else{
    //orientation  "invalid";
    fail = true;
  }
    //This function (accidentally) swaps the x/y coordinates
  if (fail) return ["","invalid",miny,minx];
  else return [word,orientation,miny,minx];
}

/*
  See if a word fits in the spot and score it if so...
*/
tryPlayingWord(x,y,orientation,word){
  word = word.toUpperCase();
   
    // reset board
    $('.tile-placement-controls').html('');
    $('.status').html("Processing your turn.");

  
    // if entry is valid (position and letters available)
    if (this.isEntryValid(word, orientation, x, y) == 1) {
      let myscore = 0;
      this.addWordToBoard(word, orientation, x, y);

    //Orientation check for single tile plays...
      let fullword = this.expandWord(word, orientation, x, y);
      //console.log("Expanded word:",fullword);
      if (fullword.length == 1){
        let newOrientation = (orientation == "vertical") ? "horizontal" : "vertical";
        if (this.expandWord(word,newOrientation,x,y).length>1){
          this.removeWordFromBoard(word, orientation, x, y);
          this.tryPlayingWord(x,y,newOrientation,word);
          return;
        } //Otherwise just let it fail with normal logic
      }


      myscore = this.scorePlay(word, this.game.player, orientation, x, y);
      if (myscore <= 1) { //If not found in dictionary
        this.removeWordFromBoard(word, orientation, x, y);
        this.updateStatusWithTiles(`Not a valid word, try again! ${this.defaultMsg}`);
        this.addEventsToBoard();          
      } else {
        
        this.game.words_played[parseInt(this.game.player)-1].push({ word : fullword , score : myscore });
        this.addMove("place\t" + word + "\t" + this.game.player + "\t" + x + "\t" + y + "\t" + orientation);
        //
        // discard tiles
        // (not really a discard, just changing flags on the board spaces to enable scoring??)
        //this.discardTiles(word, orientation, x, y);
        //Lock in Move in the DOM
        //this.setBoard(word, orientation, x, y);
        this.discardTiles(word, orientation, x, y); //remove Played tiles from Hand
        this.finalizeWord(word, orientation, x, y); //update board
        this.addScoreToPlayer(this.game.player, myscore);
  
        this.drawTiles();

        if (this.checkForEndGame() == 1) {
          return;
        }

        $('#remainder').html("DECK: " + this.game.deck[0].crypt.length);
        this.endTurn();
      }

    } else { //!isEntryValid
        this.updateStatusWithTiles(`Not a valid word, try again! ${this.defaultMsg}`);
        this.enableEvents();  
    }
}


drawTiles(){
    let cards_needed = 7;
    cards_needed = cards_needed - this.game.deck[0].hand.length;

    if (cards_needed > this.game.deck[0].crypt.length) {
      cards_needed = this.game.deck[0].crypt.length;
    }

    if (cards_needed > 0) {
      this.addMove("DEAL\t1\t" + this.game.player + "\t" + cards_needed);
    }
}

/*
  Main call for deleting some tiles from the players rack, having them draw new tiles, and ending their turn
*/
discardAndDrawTiles(tiles){
    salert("Tossed: " + tiles);
    this.removeTilesFromHand(tiles);
    this.addMove("turn\t" + this.game.player + "\t"+tiles);
    this.drawTiles();
    this.showTiles();
    this.endTurn();
  }

  removeTilesFromHand(word) {

    while (word.length > 0) {
      let tmpx = word[0];
      tmpx = tmpx.toUpperCase();

      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]].name == tmpx) {
          this.game.deck[0].hand.splice(i, 1);
          i = this.game.deck[0].hand.length;
        }
      }

      if (word.length > 1) {
        word = word.substring(1);
      } else {
        word = "";
      }
    }
  }


  isEntryValid(word, orientation, x, y) {

    let valid_placement = 1;
    let tmphand = JSON.parse(JSON.stringify(this.game.deck[0].hand));
    x = parseInt(x);
    y = parseInt(y);

    //
    // if this is the first word, it has to cross a critical star
    //
    if (this.firstmove == 1) {
      if (orientation == "vertical") {
        if (x != 6 && x != 10) {
          salert("First Word must be placed to cross a Star");
          return 0;
        }

        let starting_point = y;
        let ending_point = y + word.length - 1;

        if (starting_point <= 6 && ending_point >= 6 || starting_point <= 10 && ending_point >= 6) { } else {
          salert("First Word must be long enough to cross a Star");
          return 0;
        }
      }

      if (orientation == "horizontal") {
        if (y != 6 && y != 10) {
          salert("First Word must be placed to cross a Star");
          return 0;
        }

        let starting_point = x;
        let ending_point = x + word.length - 1;

        if (starting_point <= 6 && ending_point >= 6 || starting_point <= 10 && ending_point >= 6) { } else {
          salert("First Word must be long enough to cross a Star");
          return 0;
        }
      } //this.firstmove = 0;
    }else{
      //Check to make sure newly played word touches another word
      let touchesWord = 0;
      let xStart = Math.max(1,x-1);
      let yStart = Math.max(1,y-1);
      let xEnd,yEnd;
      if (orientation == "horizontal"){
        xEnd = Math.min(15,x+word.length+1);
        yEnd = Math.min(15,y+1);
      }else{
        xEnd = Math.min(15,x+1);
        yEnd = Math.min(15,y+word.length+1);
      }
      for (let i = xStart; i<=xEnd; i++)
        for (let j = yStart; j<=yEnd; j++){
          let boardslot = j+"_"+i;
          if (this.game.board[boardslot].fresh == 0){
            touchesWord = 1;
            break;
          }
        }

      if (touchesWord == 0) {
          salert("Word does not cross or touch an existing word.");
        return 0;
      }
    }

     
    //In all cases, must have the letters in hand or on board to spell word
    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
        if ((x+i) > 15){
          salert("Word must fit on board!");
          return 0;
        }
      }

      if (orientation == "vertical") {
        boardslot = (y + i) + "_" + x;
        if ((y+i) > 15){
          salert("Word must fit on board!");
          return 0;
        }
      }


      if (this.game.board[boardslot].letter != "_") {
        if (this.game.board[boardslot].letter != letter) {
          valid_placement = 0;
        }
      } else {
        let letter_found = 0;

        for (let k = 0; k < tmphand.length; k++) {
          if (this.game.deck[0].cards[tmphand[k]].name == letter) {
            tmphand.splice(k, 1);
            letter_found = 1;
            k = tmphand.length + 1;
          }
        }

        if (letter_found == 0) {
          salert("INVALID: letter not in hand: " + letter);
          return 0;
        }
      }
    }


    if (valid_placement == 0) {
      salert("This is an invalid placement!");
    }

    return valid_placement;

  }

  //Mark word as no longer new (.fresh is a flag used in scoring)
  //--AND-- remove newly used tiles from players hand
  //--AND-- update DOM classes
  finalizeWord(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
      }

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
      }

      if (this.game.board[boardslot].fresh == 1) {
        this.game.board[boardslot].fresh = 0;
      }
      divname = "#" + boardslot;
      $(divname).addClass("set");
    }
  }


  discardTiles(word, orientation, x, y) {
    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
      }

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
      }

      if (this.game.board[boardslot].fresh == 1) {
        this.removeTilesFromHand(word[i]);
      }
    }
  }

  /*
  Adds class to GUI for the newly spelled word
  /
  setBoard(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
      }

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
      }

      divname = "#" + boardslot;
      $(divname).addClass("set");
    }
  }



  */

  /*
  Updates GUI and game.board with newly played word
  */
  addWordToBoard(word, orientation, x, y) {
    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
      }

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
      }

      divname = "#" + boardslot;

      if (this.game.board[boardslot].letter != "_") {
        if (this.game.board[boardslot].letter != letter) { //We can overwrite tiles??
          console.log(this.game.board[boardslot].letter,letter); //what is going on here?
          this.game.board[boardslot].letter = letter;
          this.addTile($(divname), letter);
        }
      } else {
        this.game.board[boardslot].letter = letter;
        this.addTile($(divname), letter);
      }
    }
  }


  /*
  Undoes addWordToBoard, updates GUI to remove newly played tiles (as defined by class:set)
  */
  removeWordFromBoard(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();
  
      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
      }

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
      }

      divname = "#" + boardslot;

      if ($(divname).hasClass("set") != true) {
        this.game.board[boardslot].letter = "_";
        $(divname).find('.tile').remove();
        $(divname).find('.bonus').css("display", "block");
      }
    }
  }


  

  /*
  Board is 1-indexed, 15 Rows x 15 Columns (= y_x)
  */
  returnBoard() {

    var board = {};

    for (let i = 1; i <= 15; i++) {
      for (let j = 1; j <= 15; j++) {
        let divname = i + "_" + j ;
        board[divname] = {
          letter: "_",
          fresh: 1
        };
      }
    }

    return board;
  }




  returnDeck() {
    var dictionary = this.game.options.dictionary;
    if (dictionary === "twl" || dictionary === "sowpods") {
      this.mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"B"},"11":{"name":"B"},"12":{"name":"C"},"13":{"name":"C"},"14":{"name":"D"},"15":{"name":"D"},"16":{"name":"D"},"17":{"name":"D"},"18":{"name":"E"},"19":{"name":"E"},"20":{"name":"E"},"21":{"name":"E"},"22":{"name":"E"},"23":{"name":"E"},"24":{"name":"E"},"25":{"name":"E"},"26":{"name":"E"},"27":{"name":"E"},"28":{"name":"E"},"29":{"name":"E"},"30":{"name":"F"},"41":{"name":"F"},"42":{"name":"G"},"43":{"name":"G"},"44":{"name":"G"},"45":{"name":"H"},"46":{"name":"H"},"47":{"name":"I"},"48":{"name":"I"},"49":{"name":"I"},"50":{"name":"I"},"51":{"name":"I"},"52":{"name":"I"},"53":{"name":"I"},"54":{"name":"I"},"55":{"name":"I"},"56":{"name":"J"},"57":{"name":"K"},"58":{"name":"L"},"59":{"name":"L"},"60":{"name":"L"},"61":{"name":"L"},"62":{"name":"M"},"63":{"name":"M"},"64":{"name":"N"},"65":{"name":"N"},"66":{"name":"N"},"67":{"name":"N"},"68":{"name":"N"},"69":{"name":"N"},"70":{"name":"O"},"71":{"name":"O"},"72":{"name":"O"},"73":{"name":"O"},"74":{"name":"O"},"75":{"name":"O"},"76":{"name":"O"},"77":{"name":"O"},"78":{"name":"P"},"79":{"name":"P"},"80":{"name":"Q"},"81":{"name":"R"},"82":{"name":"R"},"83":{"name":"R"},"84":{"name":"R"},"85":{"name":"R"},"86":{"name":"R"},"87":{"name":"S"},"88":{"name":"S"},"89":{"name":"S"},"90":{"name":"S"},"91":{"name":"T"},"92":{"name":"T"},"93":{"name":"T"},"94":{"name":"T"},"95":{"name":"T"},"96":{"name":"T"},"97":{"name":"U"},"98":{"name":"U"},"99":{"name":"U"},"100":{"name":"U"},"101":{"name":"V"},"102":{"name":"V"},"103":{"name":"W"},"104":{"name":"W"},"105":{"name":"X"},"106":{"name":"U"},"107":{"name":"Y"},"108":{"name":"Y"},"109":{"name":"Z"}};
    }
    if (dictionary === "fise" || dictionary === "tagalog") {
      this.mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"A"},"11":{"name":"A"},"12":{"name":"A"},"13":{"name":"B"},"14":{"name":"B"},"15":{"name":"C"},"16":{"name":"C"},"17":{"name":"C"},"18":{"name":"C"},"19":{"name":"C"},"20":{"name":"D"},"21":{"name":"D"},"22":{"name":"D"},"23":{"name":"D"},"24":{"name":"D"},"25":{"name":"E"},"26":{"name":"E"},"27":{"name":"E"},"28":{"name":"E"},"29":{"name":"E"},"30":{"name":"E"},"31":{"name":"E"},"32":{"name":"E"},"33":{"name":"E"},"34":{"name":"E"},"35":{"name":"E"},"36":{"name":"E"},"37":{"name":"E"},"38":{"name":"F"},"39":{"name":"G"},"40":{"name":"G"},"41":{"name":"H"},"42":{"name":"H"},"43":{"name":"H"},"44":{"name":"I"},"45":{"name":"I"},"46":{"name":"I"},"47":{"name":"I"},"48":{"name":"I"},"49":{"name":"I"},"50":{"name":"J"},"51":{"name":"L"},"52":{"name":"L"},"53":{"name":"L"},"54":{"name":"L"},"55":{"name":"L"},"56":{"name":"L"},"57":{"name":"M"},"58":{"name":"M"},"59":{"name":"N"},"60":{"name":"N"},"61":{"name":"N"},"62":{"name":"N"},"63":{"name":"N"},"64":{"name":"Ñ"},"65":{"name":"Ñ"},"66":{"name":"O"},"67":{"name":"O"},"68":{"name":"O"},"69":{"name":"O"},"70":{"name":"O"},"71":{"name":"O"},"72":{"name":"O"},"73":{"name":"O"},"74":{"name":"O"},"75":{"name":"O"},"76":{"name":"P"},"77":{"name":"P"},"78":{"name":"Q"},"79":{"name":"R"},"80":{"name":"R"},"81":{"name":"R"},"82":{"name":"R"},"83":{"name":"R"},"84":{"name":"R"},"85":{"name":"R"},"86":{"name":"S"},"87":{"name":"S"},"88":{"name":"S"},"89":{"name":"S"},"90":{"name":"S"},"91":{"name":"S"},"92":{"name":"S"},"93":{"name":"T"},"94":{"name":"T"},"95":{"name":"T"},"96":{"name":"T"},"97":{"name":"U"},"98":{"name":"U"},"99":{"name":"U"},"100":{"name":"U"},"101":{"name":"U"},"102":{"name":"V"},"103":{"name":"X"},"104":{"name":"Y"},"105":{"name":"Z"}};
    }
    /*if (dictionary === "sowpods") {
      this.mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"B"},"11":{"name":"B"},"12":{"name":"C"},"13":{"name":"C"},"14":{"name":"D"},"15":{"name":"D"},"16":{"name":"D"},"17":{"name":"D"},"18":{"name":"E"},"19":{"name":"E"},"20":{"name":"E"},"21":{"name":"E"},"22":{"name":"E"},"23":{"name":"E"},"24":{"name":"E"},"25":{"name":"E"},"26":{"name":"E"},"27":{"name":"E"},"28":{"name":"E"},"29":{"name":"E"},"30":{"name":"F"},"41":{"name":"F"},"42":{"name":"G"},"43":{"name":"G"},"44":{"name":"G"},"45":{"name":"H"},"46":{"name":"H"},"47":{"name":"I"},"48":{"name":"I"},"49":{"name":"I"},"50":{"name":"I"},"51":{"name":"I"},"52":{"name":"I"},"53":{"name":"I"},"54":{"name":"I"},"55":{"name":"I"},"56":{"name":"J"},"57":{"name":"K"},"58":{"name":"L"},"59":{"name":"L"},"60":{"name":"L"},"61":{"name":"L"},"62":{"name":"M"},"63":{"name":"M"},"64":{"name":"N"},"65":{"name":"N"},"66":{"name":"N"},"67":{"name":"N"},"68":{"name":"N"},"69":{"name":"N"},"70":{"name":"O"},"71":{"name":"O"},"72":{"name":"O"},"73":{"name":"O"},"74":{"name":"O"},"75":{"name":"O"},"76":{"name":"O"},"77":{"name":"O"},"78":{"name":"P"},"79":{"name":"P"},"80":{"name":"Q"},"81":{"name":"R"},"82":{"name":"R"},"83":{"name":"R"},"84":{"name":"R"},"85":{"name":"R"},"86":{"name":"R"},"87":{"name":"S"},"88":{"name":"S"},"89":{"name":"S"},"90":{"name":"S"},"91":{"name":"T"},"92":{"name":"T"},"93":{"name":"T"},"94":{"name":"T"},"95":{"name":"T"},"96":{"name":"T"},"97":{"name":"U"},"98":{"name":"U"},"99":{"name":"U"},"100":{"name":"U"},"101":{"name":"V"},"102":{"name":"V"},"103":{"name":"W"},"104":{"name":"W"},"105":{"name":"X"},"106":{"name":"U"},"107":{"name":"Y"},"108":{"name":"Y"},"109":{"name":"Z"}};
    }*/
    if (dictionary === "test") {
      let mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"C"},"11":{"name":"C"},"12":{"name":"C"},"13":{"name":"C"},"14":{"name":"T"},"15":{"name":"T"},"16":{"name":"T"},"17":{"name":"T"},"18":{"name":"T"},"19":{"name":"T"},"20":{"name":"T"}};
    }
    return this.mydeck;
  }

  returnLetters() {
    var dictionary = this.game.options.dictionary;
    if (dictionary === "twl" || dictionary === "sowpods") {
      this.letterset = {"A":{"score":1},"B":{"score":3},"C":{"score":2},"D":{"score":2},"E":{"score":1},"F":{"score":2},"G":{"score":2},"H":{"score":1},"I":{"score":1},"J":{"score":8},"K":{"score":4},"L":{"score":2},"M":{"score":2},"N":{"score":1},"O":{"score":1},"P":{"score":2},"Q":{"score":10},"R":{"score":1},"S":{"score":1},"T":{"score":1},"U":{"score":2},"V":{"score":3},"W":{"score":2},"X":{"score":8},"Y":{"score":2},"Z":{"score":10}};
    }
    if (dictionary === "fise" || dictionary === "tagalog") {
      this.letterset = {"A":{"score":1},"B":{"score":2},"C":{"score":3},"D":{"score":2},"E":{"score":1},"F":{"score":4},"G":{"score":2},"H":{"score":4},"I":{"score":1},"J":{"score":8},"L":{"score":1},"M":{"score":3},"N":{"score":1},"Ñ":{"score":8},"O":{"score":1},"P":{"score":3},"Q":{"score":6},"R":{"score":2},"S":{"score":1},"T":{"score":1},"U":{"score":1},"V":{"score":4},"X":{"score":8},"Y":{"score":4},"Z":{"score":10}};
    }
    /*if (dictionary === "sowpods") {
      this.letterset = {"A":{"score":1},"B":{"score":3},"C":{"score":2},"D":{"score":2},"E":{"score":1},"F":{"score":2},"G":{"score":2},"H":{"score":1},"I":{"score":1},"J":{"score":8},"K":{"score":4},"L":{"score":2},"M":{"score":2},"N":{"score":1},"O":{"score":1},"P":{"score":2},"Q":{"score":10},"R":{"score":1},"S":{"score":1},"T":{"score":1},"U":{"score":2},"V":{"score":3},"W":{"score":2},"X":{"score":8},"Y":{"score":2},"Z":{"score":10}};
    }*/
    if (dictionary === "test") {
      let letterset = { "A": { "score": 1 }, "C": { "score": 3 }, "T": { "score": 2 } };
    }
    return this.letterset;
  }

  checkWord(word) {
    if (word.length >= 1 && typeof this.wordlist != "undefined") {
      if (this.wordlist.indexOf(word.toLowerCase()) <= 0) {
        salert(word + " is not a playable word.");
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }



  returnBonus(pos) {

    let bonus = "";

    if (pos == "1_1") { return "3L"; }
    if (pos == "1_15") { return "3L"; }
    if (pos == "3_8") { return "3L"; }
    if (pos == "8_3") { return "3L"; }
    if (pos == "8_13") { return "3L"; }
    if (pos == "13_8") { return "3L"; }
    if (pos == "15_1") { return "3L"; }
    if (pos == "15_15") { return "3L"; }
    if (pos == "2_2") { return "3W"; }
    if (pos == "2_14") { return "3W"; }
    if (pos == "8_8") { return "3W"; }
    if (pos == "14_2") { return "3W"; }
    if (pos == "14_14") { return "3W"; }
    if (pos == "1_5") { return "2L"; }
    if (pos == "1_11") { return "2L"; }
    if (pos == "3_4") { return "2L"; }
    if (pos == "3_12") { return "2L"; }
    if (pos == "4_3") { return "2L"; }
    if (pos == "4_13") { return "2L"; }
    if (pos == "5_8") { return "2L"; }
    if (pos == "5_1") { return "2L"; }
    if (pos == "5_15") { return "2L"; }
    if (pos == "8_5") { return "2L"; }
    if (pos == "8_11") { return "2L"; }
    if (pos == "11_1") { return "2L"; }
    if (pos == "11_8") { return "2L"; }
    if (pos == "11_15") { return "2L"; }
    if (pos == "12_3") { return "2L"; }
    if (pos == "12_13") { return "2L"; }
    if (pos === "13_4") { return "2L"; }
    if (pos === "13_12") { return "2L"; }
    if (pos == "15_5") { return "2L"; }
    if (pos == "15_11") { return "2L"; }
    if (pos == "1_8") { return "2W"; }
    if (pos == "4_6") { return "2W"; }
    if (pos == "4_10") { return "2W"; }
    if (pos == "6_4") { return "2W"; }
    if (pos == "6_12") { return "2W"; }
    if (pos == "8_1") { return "2W"; }
    if (pos == "8_15") { return "2W"; }
    if (pos == "10_4") { return "2W"; }
    if (pos == "10_12") { return "2W"; }
    if (pos == "12_6") { return "2W"; }
    if (pos == "12_10") { return "2W"; }
    if (pos == "15_8") { return "2W"; }
    return bonus;
  }

  /*
  For scoring words, I use cartesian coordinate templating to make the coding easier
  (x,y) is represented as "y_x". A slot template fixes one of the dimensions with a constant
  to traverse the (main) axis of the word, or, alternately examine the cross axis of an 
  intersecting word.  "#" is used as a variable, to be replaced by "i" in the for loops.  
  */

  getWordScope(head, slotPattern){
    let boardslot;
    let wordStart = head;
    let wordEnd = head;
    for (let i = parseInt(head); i>=1; i--){
      boardslot = slotPattern.replace("#",i);
      if (this.game.board[boardslot].letter == "_") break;
      wordStart = i;
    }
    for (let i = parseInt(head); i<=15; i++){
        boardslot = slotPattern.replace("#",i);
      if (this.game.board[boardslot].letter == "_") break;
        wordEnd = i;
    }

    return {"start":wordStart, "end":wordEnd};
  }

  scoreWord(wordStart, wordEnd, boardSlotTemplate){
    let tilesUsed = 0;
    let word_bonus = 1;
    let thisword = "";
    let score = 0;
    let html = '';
   for (let i = wordStart; i <= wordEnd; i++) {
        boardslot = boardSlotTemplate.replace("#",i);
        let letter_bonus = 1;
        
        if (this.game.board[boardslot].fresh == 1){
          let tmpb = this.returnBonus(boardslot);
          switch(tmpb){ //Word_bonuses can be combined...maybe
            case "3W": word_bonus = word_bonus * 3; break;
            case "2W": word_bonus = word_bonus * 2; break;
            case "3L": letter_bonus = 3; break; 
            case "2L": letter_bonus = 2; break;
          }
          tilesUsed += 1;
        }else{
          touchesWord = 1;
        } 

        let thisletter = this.game.board[boardslot].letter;
        //console.log(boardslot,thisletter);
        thisword += thisletter;
        score += this.letters[thisletter].score * letter_bonus;
        if (letter_bonus>1){
          html += ` + ${this.letters[thisletter].score} x${letter_bonus}`;
        }else{
          html += " + "+this.letters[thisletter].score;
        }
    }

    if (!this.checkWord(thisword)) {
       return -1;
    }

    /*Technically only care for the main word, but not worth adding code to avoid 
      doing a couple extra additions and a comparison
    */
    if (tilesUsed == 7) {
      score += 10;
      word_bonus += 1;
      html += " +10(!)";
    }

      score *= word_bonus;
      html = html.substring(3);
      if (word_bonus>1){
        html = "("+html+") x "+word_bonus;
      }
      console.log("word:",thisword,"score:",score);
      return {word:thisword, score:score, math:html};
  }

  ////////////////
  // Score Word //
  // Returns -1 if not found in dictionary //
  ////////////////
  scorePlay(word, player, orientation, x, y) {
    let boardslot;
    //Orientation-dependent metadata/variables
    const mainAxis = (orientation == "horizontal") ? x : y;
    const crossAxis = (orientation == "horizontal") ? y : x;
    const boardSlotTemplate = (orientation == "horizontal") ? crossAxis+"_#" : "#_"+crossAxis;
    
    console.log(mainAxis,crossAxis,boardSlotTemplate);
    //
    // find the start and end of the word
    //
    let wordBoundaries = this.getWordScope(mainAxis, boardSlotTemplate);
     
    //Score main-axis word
    let results = this.scoreWord(wordBoundaries.start, wordBoundaries.end, boardSlotTemplate);
    if (results == -1)
      return -1;
    console.log(orientation, wordBoundaries, results);  
    let play = new Array(results);
    let totalscore = results.score;

    //For each letter in the main-axis word...
    
      for (let i = wordBoundaries.start; i <= wordBoundaries.end; i++) {
        boardslot = boardSlotTemplate.replace("#",i); 
        
        //console.log(boardslot);
        if (this.game.board[boardslot].fresh == 1) { //...Is it newly placed...?
          let altTemplate = boardSlotTemplate.replace(crossAxis,"@").replace("#",i).replace("@","#");  
          //..and does it have a word along the cross axis
          let crossWord = this.getWordScope(crossAxis, altTemplate);
          if (crossWord.start != crossWord.end){ //Only score word if more than 1 letter
            //Make cross-axis variable
            console.log(crossAxis,altTemplate,crossWord);
             results = this.scoreWord(crossWord.start, crossWord.end, altTemplate);
             if (results == -1)
               return -1;
             
             play.push(results);
             totalscore += results.score;  
          }
        }
      }

    this.firstmove = 0; //We have an acceptable move, so game has commenced. Repeat assignment simpler than adding conditional
    console.log(play);

    this.last_played_word = { player, word: play[0].word, score:play[0].score, totalscore, play};
    //console.log(this.last_played_word);
    return totalscore;
  }

  expandWord(word, orientation, x, y){
    const mainAxis = (orientation == "horizontal") ? x : y;
    const crossAxis = (orientation == "horizontal") ? y : x;
    const boardSlotTemplate = (orientation == "horizontal") ? crossAxis+"_#" : "#_"+crossAxis;
    let wordBoundaries = this.getWordScope(mainAxis, boardSlotTemplate);
    //console.log(orientation,wordBoundaries);
    let fullword = "";

    for (let i = wordBoundaries.start; i <= wordBoundaries.end; i++) {
        boardslot = boardSlotTemplate.replace("#",i);
        fullword += this.game.board[boardslot].letter;
    }
    //console.log(word,fullword);
    return fullword;
  }
    
  

  //
  // Core Game Logic
  //
  handleGameLoop(msg = null) {

    let wordblocks_self = this;

    //
    // show board and tiles
    //

    this.showTiles();

    ///////////
    // QUEUE // Possibilities: gameover, endgame, place, turn
    ///////////

    if (this.game.queue.length > 0) {
      //
      // save before we start executing the game queue
      //
      wordblocks_self.saveGame(wordblocks_self.game.id);
      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      //
      // game over conditions
      //

      if (mv[0] === "gameover") {

        //
        // pick the winner
        //
        let x = 0;
        let idx = 0;

        for (let i = 0; i < wordblocks_self.game.score.length; i++) {
          if (wordblocks_self.game.score[i] > x) {
            x = wordblocks_self.game.score[i];
            idx = i;
          }
        }

        for (let i = 0; i < wordblocks_self.game.score.length; i++) {
          if (i != idx && wordblocks_self.game.score[i] == wordblocks_self.game.score[idx]) {
            idx = -1;
          }
        }

        wordblocks_self.game.winner = idx + 1;
        //wordblocks_self.game.over = 1;
        wordblocks_self.saveGame(wordblocks_self.game.id);

        if (wordblocks_self.browser_active == 1) {
          var result = `Game Over -- Player ${wordblocks_self.game.winner} Wins!`;

          if (idx < 0) {
            result = "It's a tie! Well done everyone!";
          }

          wordblocks_self.updateStatusWithTiles(result);
          wordblocks_self.updateLog(result);

          if(this.game.winner == this.game.player) {
            //not resigning as game.winner is set.
            this.resignGame();
          }
        }

        this.game.queue.splice(this.game.queue.length - 1, 1);
        return 0;
      }

      if (mv[0] === "endgame") {
        this.game.queue.splice(this.game.queue.length - 1, 1);
        this.addMove("gameover");
        return 1;
      }


      //
      // place word player x y [horizontal/vertical]
      //
      if (mv[0] === "place") {
        let word = mv[1];
        let player = mv[2];
        let x = mv[3];
        let y = mv[4];
        let orient = mv[5];
        let score = 0;

        if (player != wordblocks_self.game.player) {
          this.addWordToBoard(word, orient, x, y);
          //this.setBoard(word, orient, x, y);
          score = this.scorePlay(word, player, orient, x, y);
          this.finalizeWord(word, orient, x, y);
          this.addScoreToPlayer(player, score);

	        this.game.words_played[parseInt(player)-1].push({ word : word , score : score });

        } 

        if (wordblocks_self.game.over == 1) {
          return;
        }

        if (wordblocks_self.game.player == wordblocks_self.returnNextPlayer(player)) {
          if (wordblocks_self.checkForEndGame() == 1) {
            return;
          }

          wordblocks_self.updateStatusWithTiles("YOUR GO: "+wordblocks_self.defaultMsg);
          wordblocks_self.enableEvents();
        } else {
          wordblocks_self.updateStatusWithTiles("Player " + wordblocks_self.returnNextPlayer(player) + "'s turn");
        }

        this.game.queue.splice(this.game.queue.length - 1, 1);
        return 1; // remove word and wait for next
      }

      if (mv[0] === "turn") {
        //
	      // observer mode
	       //
	       if (this.game.player == 0) {
	         this.game.queue.push("OBSERVER_CHECKPOINT");
           this.game.queue.splice(this.game.queue.length - 1, 1);
	         return 1;
	       }


          if (wordblocks_self.checkForEndGame() == 1) {
            return;
          }

          let player = mv[1];
          let discardedTiles = mv[2];
          //Code to keep the discard and redraws in the game log history
          wordblocks_self.last_played_word = { player, word: discardedTiles, score:0};
          wordblocks_self.game.words_played[parseInt(player)-1].push({ word : "---" , score : 0 });

          if (wordblocks_self.game.player == wordblocks_self.returnNextPlayer(player)) {
            wordblocks_self.updateStatusWithTiles("YOUR GO: "+wordblocks_self.defaultMsg);
            wordblocks_self.enableEvents();
          } else {
            wordblocks_self.updateStatusWithTiles("Player " + wordblocks_self.returnNextPlayer(player) + "'s turn");
          }

        this.game.queue.splice(this.game.queue.length - 1, 1);
        return 1;
      }

      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        return 0;
      }
    }

    return 1;

  }


  checkForEndGame() {
    //
    // the game ends when one player has no cards left
    //
    if (this.game.deck[0].hand.length == 0 && this.game.deck[0].crypt.length == 0) {
      this.addMove("endgame");
      this.endTurn();
      return 1;
    }

    return 0;
  }



  addScoreToPlayer(player, score) {
    if (this.browser_active == 0) {
      return;
    }

    let divname = "#score_" + player;
    this.game.score[player - 1] = this.game.score[player - 1] + score;
    $(divname).html(parseInt($(divname).html()) + score);
  }



  addMove(mv) {
    this.moves.push(mv);
  }


  endTurn() {
    this.updateStatusWithTiles("Waiting for information from peers....");
    let extra = {};
    extra.target = this.returnNextPlayer(this.game.player);
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);
  }

  returnGameOptionsHTML() {
    let testHtml = '';
    if(this.app.config && this.app.config.currentEnv == "DEV") {
      testHtml = `<option value="test">Test Dictionary</option>`;
    }
    return `
          <label for="dictionary">Dictionary:</label>
          <select name="dictionary">
            <option value="sowpods" title="A combination of the Official Scrabble Player Dictionary and Official Scrabble Words" selected>English: SOWPODS</option>
            <option value="twl" title="Scrabble Tournament Word List">English: TWL06</option>
            <option value="fise">Spanish: FISE</option>
            <option value="tagalog">Tagalog</option>
            ${testHtml}
          </select>

          <label for="observer_mode">Observer Mode:</label>
          <select name="observer">
            <option value="enable" selected>enable</option>
            <option value="disable">disable</option>
          </select>


          <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>

          `;
  }

}

module.exports = Wordblocks;
