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
    this.last_played_word = { player: '', finalword: '', score: '' };

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

    this.hud.mode = 1; // square

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
      text : "Log",
      id : "game-log",
      class : "game-log",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.log.toggleLog();
      }
    });
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



  returnStatsOverlay() {

    let html = '';

    html += '<div class="stats-overlay">';
    html += '<table cellspacing="10px" rowspacing="10px">';
    html += '<tr>';
    for (let i = 0; i < this.game.opponents.length+1; i++) {
      html += `<td>Player ${(i+1)}</td>`;
    }
    html += '</tr>';

    html += '<tr>';
    let total_score = [];
    for (let i = 0; i < this.game.opponents.length+1; i++) {
      total_score.push(0);
      let words_scored_html = '<table>';
      for (let z = 0; z < this.game.words_played[i].length; z++) {
        if (this.game.words_played[i][z] != undefined) {
	  words_scored_html += '<tr><td>' + this.game.words_played[i][z].word + '</td><td>' + this.game.words_played[i][z].score + '</td></tr>';
	  total_score[i] += this.game.words_played[i][z].score;
        }
      }
      words_scored_html += '</table>';
      html += `<td>${words_scored_html}</td>`;
    }
    html += '</tr><tr>';
    for (let i = 0; i < this.game.opponents.length+1; i++) {
      html += `<td>${total_score[i]}</td>`;
    }
    html += '</tr>';
    html += '</table>';
    html += '</div>';

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
            <span class="player_name">Your Score</span>
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

    if (this.game.target == this.game.player) {
      this.updateStatusWithTiles("YOUR GO: click board to place or <span class=\"link tosstiles\">discard</span>.");
      this.enableEvents();
    } else {
      this.updateStatusWithTiles(`Waiting for Player ${this.game.target} to move.`);
      this.disableEvents();
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


    //
    // attach events
    //
    if (this.game.target == this.game.player) {
      this.addEventsToBoard();
    }

    try {

      $('#shuffle').on('click', function () {
        for (var i = $('#tiles').children.length; i >= 0; i--) {
          $('#tiles')[0].appendChild($('#tiles')[0].childNodes[Math.random() * i | 0]);
        }
      });
      $('#tiles').sortable();
      $('#tiles').disableSelection();
      $(window).resize(function () {
        resizeBoard();
      });

      var element = document.getElementById('gameboard');
  
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
    let { player, finalword, score } = this.last_played_word;
    let last_move_html = finalword == '' ? '...' : `Player ${player} played ${finalword} for: ${this.game.words_played[player-1][this.game.words_played[player-1].length-1].score} points (total: ${this.game.score[player-1]})`;
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
          <img id="shuffle" class="shuffle" src="/wordblocks/img/reload.png">
          <div id="remainder" class="remainder">DECK: ${this.game.deck[0].crypt.length}</div>
          <div class="lastmove" id="lastmove">${last_move_html}</div>
        </div>
      </div
    `;
    this.updateStatus(html);
    this.calculateScore();
    this.enableEvents();
    } catch (err) {}
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
/***
    for (let i = 0; i < players; i++) {
      let this_player = i + 1;

      if (this.game.player == this_player) {
        html += `
          <div class="player">
            <span class="player_name">Your Score</span>
            <span class="player_score" id="score_${this_player}"> ${this.game.score[i]} </span>
          </div>
        `;
      } else {
        let opponent = this.game.opponents[op];
        opponent = this.app.keys.returnIdentifierByPublicKey(opponent, true);
        op++;
        html += `
          <div class="player">
            <span class="player_name">${opponent.substring(0, 16)}</span>
            <span class="player_score" id="score_${this_player}"> ${this.game.score[i]} </span>
          </div>
        `;
      }
    }
***/

    if (this.browser_active == 1) {
      $('.score').html(html);
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



  disableEvents() {
    if (this.browser_active == 1) {
      $('.slot').off();
    }
  }


  enableEvents() {
    if (this.browser_active == 1) {
      this.addEventsToBoard();
    }
  }


  async addEventsToBoard() {
    if (this.browser_active == 0) { return; }
    let wordblocks_self = this;

    try {

    $('.tosstiles').off();
    $('.tosstiles').on('click', async function () {
      tiles = await sprompt("Which tiles do you want to discard? Tossed tiles count against your score:");

      if (tiles) {
        salert("Tossed: " + tiles);
        wordblocks_self.removeTilesFromHand(tiles);
        wordblocks_self.addMove("turn\t" + wordblocks_self.game.player);
        let cards_needed = 7;
        cards_needed = cards_needed - wordblocks_self.game.deck[0].hand.length;

        if (cards_needed > wordblocks_self.game.deck[0].crypt.length) {
          cards_needed = wordblocks_self.game.deck[0].crypt.length;
        }

        if (cards_needed > 0) {
          wordblocks_self.addMove("DEAL\t1\t" + wordblocks_self.game.player + "\t" + cards_needed);
        }

        wordblocks_self.showTiles();
        wordblocks_self.endTurn();
      }
    });

    $('.slot').off();
    $('.slot').on('mousedown', function (e) {
      xpos = e.clientX;
      ypos = e.clientY;
    });
    $('.slot').on('mouseup', function (e) {
      if (Math.abs(xpos-e.clientX) > 4) { return; }
      if (Math.abs(ypos-e.clientY) > 4) { return; }
      let divname = $(this).attr("id");
      let html = `
        <div class="tile-placement-controls">
          <span class="action" id="horizontally"><i class="fas fa-arrows-alt-h"></i> horizontally</span>
          <span class="action" id="vertically"><i class="fas fa-arrows-alt-v"></i> vertically</span>
          <span class="action" id="cancel"><i class="far fa-window-close"></i> cancel</span>
        </div>`;
      let tmpx = divname.split("_");
      let y = tmpx[0];
      let x = tmpx[1];
      let orientation = "";
      let word = "";

      let offsetX = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 25 : 55;
      let offsetY = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 25 : 55;

      let greater_offsetX = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 135 : 155;
      let greater_offsetY = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 135 : 155;

      let left = $(this).offset().left + offsetX;
      let top = $(this).offset().top + offsetY;

      if (x > 8) { left -= greater_offsetX; }
      if (y > 8) { top -= greater_offsetY; }

      $('.tile-placement-controls').remove();

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

      $('.action').off();
      $('.action').on('click', async function () {

        let action2 = $(this).attr("id");

        if (action2 == "horizontally") {
          orientation = "horizontal";
        }

        if (action2 == "vertically") {
          orientation = "vertical";
        }

        if (action2 == "cancel") {

          $('.action').off();
          $('.tile-placement-controls').remove();
          wordblocks_self.updateStatusWithTiles("Click on the board to place a letter from that square, or <span class=\"link tosstiles\">discard tiles</span> if you cannot move.");
          wordblocks_self.addEventsToBoard();
          return;
        }

        word = await sprompt("Provide your word:");

        if (word) {
          //
          // reset board
          //
          $('.tile-placement-controls').html('');
          $('.status').html("Processing your turn.");

          //
          // if entry is valid
          //
          if (wordblocks_self.isEntryValid(word, orientation, x, y) == 1) {
            let myscore = 0;
            wordblocks_self.addWordToBoard(word, orientation, x, y);
            myscore = wordblocks_self.scoreWord(word, wordblocks_self.game.player, orientation, x, y);
  	    wordblocks_self.game.words_played[parseInt(wordblocks_self.game.player)-1].push({ word : word , score : myscore });

            if (myscore <= 1) {
              wordblocks_self.removeWordFromBoard(word, orientation, x, y);
              wordblocks_self.updateStatusWithTiles(
                `Try again! Click on the board to place a letter from that square, or
                <span class="link tosstiles">discard tiles</span> if you cannot move.`
              );
              wordblocks_self.addEventsToBoard();
            } else {
              wordblocks_self.setBoard(word, orientation, x, y); 

	      //
              // place word on board
              //
              wordblocks_self.addMove("place\t" + word + "\t" + wordblocks_self.game.player + "\t" + x + "\t" + y + "\t" + orientation);
	      //
              // discard tiles
              //
              wordblocks_self.discardTiles(word, orientation, x, y);

	      //
              // get new cards
              //
              let cards_needed = 7;
              cards_needed = cards_needed - wordblocks_self.game.deck[0].hand.length;

              if (cards_needed > wordblocks_self.game.deck[0].crypt.length) {
                cards_needed = wordblocks_self.game.deck[0].crypt.length;
              }

              if (cards_needed > 0) {
                wordblocks_self.addMove("DEAL\t1\t" + wordblocks_self.game.player + "\t" + cards_needed);
              }

              wordblocks_self.exhaustWord(word, orientation, x, y);
              wordblocks_self.addScoreToPlayer(wordblocks_self.game.player, myscore);

              if (wordblocks_self.checkForEndGame() == 1) {
                return;
              }

              $('#remainder').html("DECK: " + wordblocks_self.game.deck[0].crypt.length);
              wordblocks_self.endTurn();
            };

          } else {
            wordblocks_self.updateStatusWithTiles(
              `Word is not valid, try again! Click on the board to place a word, or
              <span class="link tosstiles">discard tiles</span>`
            );
            wordblocks_self.addEventsToBoard();
          }
        }
      });
    });

    $('#shuffle').on('click', function () {
      for (var i = $('#tiles').children.length; i >= 0; i--) {
        $('#tiles')[0].appendChild($('#tiles')[0].childNodes[Math.random() * i | 0]);
      }
    });
    $('#tiles').sortable();
    $('#tiles').disableSelection();
    //$(window).resize(function () { resizeBoard(); });

    } catch (err) {}
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
    }

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
      }

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
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


  exhaustWord(word, orientation, x, y) {

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

      this.game.board[boardslot].fresh = 0;
    }
  }


  discardTiles(word, orientation, x, y) {

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
        this.removeTilesFromHand(word[i]);
      }
    }
  }




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
        if (this.game.board[boardslot].letter != letter) {
          this.game.board[boardslot].letter = letter;
          this.addTile($(divname), letter);
        }
      } else {
        this.game.board[boardslot].letter = letter;
        this.addTile($(divname), letter);
      }
    }
  }



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




  returnBoard() {

    var board = {};

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        let divname = i + 1 + "_" + (j + 1);
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
    if (dictionary === "twl") {
      this.mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"B"},"11":{"name":"B"},"12":{"name":"C"},"13":{"name":"C"},"14":{"name":"D"},"15":{"name":"D"},"16":{"name":"D"},"17":{"name":"D"},"18":{"name":"E"},"19":{"name":"E"},"20":{"name":"E"},"21":{"name":"E"},"22":{"name":"E"},"23":{"name":"E"},"24":{"name":"E"},"25":{"name":"E"},"26":{"name":"E"},"27":{"name":"E"},"28":{"name":"E"},"29":{"name":"E"},"30":{"name":"F"},"41":{"name":"F"},"42":{"name":"G"},"43":{"name":"G"},"44":{"name":"G"},"45":{"name":"H"},"46":{"name":"H"},"47":{"name":"I"},"48":{"name":"I"},"49":{"name":"I"},"50":{"name":"I"},"51":{"name":"I"},"52":{"name":"I"},"53":{"name":"I"},"54":{"name":"I"},"55":{"name":"I"},"56":{"name":"J"},"57":{"name":"K"},"58":{"name":"L"},"59":{"name":"L"},"60":{"name":"L"},"61":{"name":"L"},"62":{"name":"M"},"63":{"name":"M"},"64":{"name":"N"},"65":{"name":"N"},"66":{"name":"N"},"67":{"name":"N"},"68":{"name":"N"},"69":{"name":"N"},"70":{"name":"O"},"71":{"name":"O"},"72":{"name":"O"},"73":{"name":"O"},"74":{"name":"O"},"75":{"name":"O"},"76":{"name":"O"},"77":{"name":"O"},"78":{"name":"P"},"79":{"name":"P"},"80":{"name":"Q"},"81":{"name":"R"},"82":{"name":"R"},"83":{"name":"R"},"84":{"name":"R"},"85":{"name":"R"},"86":{"name":"R"},"87":{"name":"S"},"88":{"name":"S"},"89":{"name":"S"},"90":{"name":"S"},"91":{"name":"T"},"92":{"name":"T"},"93":{"name":"T"},"94":{"name":"T"},"95":{"name":"T"},"96":{"name":"T"},"97":{"name":"U"},"98":{"name":"U"},"99":{"name":"U"},"100":{"name":"U"},"101":{"name":"V"},"102":{"name":"V"},"103":{"name":"W"},"104":{"name":"W"},"105":{"name":"X"},"106":{"name":"U"},"107":{"name":"Y"},"108":{"name":"Y"},"109":{"name":"Z"}};
    }
    if (dictionary === "fise" || dictionary === "tagalog") {
      this.mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"A"},"11":{"name":"A"},"12":{"name":"A"},"13":{"name":"B"},"14":{"name":"B"},"15":{"name":"C"},"16":{"name":"C"},"17":{"name":"C"},"18":{"name":"C"},"19":{"name":"C"},"20":{"name":"D"},"21":{"name":"D"},"22":{"name":"D"},"23":{"name":"D"},"24":{"name":"D"},"25":{"name":"E"},"26":{"name":"E"},"27":{"name":"E"},"28":{"name":"E"},"29":{"name":"E"},"30":{"name":"E"},"31":{"name":"E"},"32":{"name":"E"},"33":{"name":"E"},"34":{"name":"E"},"35":{"name":"E"},"36":{"name":"E"},"37":{"name":"E"},"38":{"name":"F"},"39":{"name":"G"},"40":{"name":"G"},"41":{"name":"H"},"42":{"name":"H"},"43":{"name":"H"},"44":{"name":"I"},"45":{"name":"I"},"46":{"name":"I"},"47":{"name":"I"},"48":{"name":"I"},"49":{"name":"I"},"50":{"name":"J"},"51":{"name":"L"},"52":{"name":"L"},"53":{"name":"L"},"54":{"name":"L"},"55":{"name":"L"},"56":{"name":"L"},"57":{"name":"M"},"58":{"name":"M"},"59":{"name":"N"},"60":{"name":"N"},"61":{"name":"N"},"62":{"name":"N"},"63":{"name":"N"},"64":{"name":"Ñ"},"65":{"name":"Ñ"},"66":{"name":"O"},"67":{"name":"O"},"68":{"name":"O"},"69":{"name":"O"},"70":{"name":"O"},"71":{"name":"O"},"72":{"name":"O"},"73":{"name":"O"},"74":{"name":"O"},"75":{"name":"O"},"76":{"name":"P"},"77":{"name":"P"},"78":{"name":"Q"},"79":{"name":"R"},"80":{"name":"R"},"81":{"name":"R"},"82":{"name":"R"},"83":{"name":"R"},"84":{"name":"R"},"85":{"name":"R"},"86":{"name":"S"},"87":{"name":"S"},"88":{"name":"S"},"89":{"name":"S"},"90":{"name":"S"},"91":{"name":"S"},"92":{"name":"S"},"93":{"name":"T"},"94":{"name":"T"},"95":{"name":"T"},"96":{"name":"T"},"97":{"name":"U"},"98":{"name":"U"},"99":{"name":"U"},"100":{"name":"U"},"101":{"name":"U"},"102":{"name":"V"},"103":{"name":"X"},"104":{"name":"Y"},"105":{"name":"Z"}};
    }
    if (dictionary === "sowpods") {
      this.mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"B"},"11":{"name":"B"},"12":{"name":"C"},"13":{"name":"C"},"14":{"name":"D"},"15":{"name":"D"},"16":{"name":"D"},"17":{"name":"D"},"18":{"name":"E"},"19":{"name":"E"},"20":{"name":"E"},"21":{"name":"E"},"22":{"name":"E"},"23":{"name":"E"},"24":{"name":"E"},"25":{"name":"E"},"26":{"name":"E"},"27":{"name":"E"},"28":{"name":"E"},"29":{"name":"E"},"30":{"name":"F"},"41":{"name":"F"},"42":{"name":"G"},"43":{"name":"G"},"44":{"name":"G"},"45":{"name":"H"},"46":{"name":"H"},"47":{"name":"I"},"48":{"name":"I"},"49":{"name":"I"},"50":{"name":"I"},"51":{"name":"I"},"52":{"name":"I"},"53":{"name":"I"},"54":{"name":"I"},"55":{"name":"I"},"56":{"name":"J"},"57":{"name":"K"},"58":{"name":"L"},"59":{"name":"L"},"60":{"name":"L"},"61":{"name":"L"},"62":{"name":"M"},"63":{"name":"M"},"64":{"name":"N"},"65":{"name":"N"},"66":{"name":"N"},"67":{"name":"N"},"68":{"name":"N"},"69":{"name":"N"},"70":{"name":"O"},"71":{"name":"O"},"72":{"name":"O"},"73":{"name":"O"},"74":{"name":"O"},"75":{"name":"O"},"76":{"name":"O"},"77":{"name":"O"},"78":{"name":"P"},"79":{"name":"P"},"80":{"name":"Q"},"81":{"name":"R"},"82":{"name":"R"},"83":{"name":"R"},"84":{"name":"R"},"85":{"name":"R"},"86":{"name":"R"},"87":{"name":"S"},"88":{"name":"S"},"89":{"name":"S"},"90":{"name":"S"},"91":{"name":"T"},"92":{"name":"T"},"93":{"name":"T"},"94":{"name":"T"},"95":{"name":"T"},"96":{"name":"T"},"97":{"name":"U"},"98":{"name":"U"},"99":{"name":"U"},"100":{"name":"U"},"101":{"name":"V"},"102":{"name":"V"},"103":{"name":"W"},"104":{"name":"W"},"105":{"name":"X"},"106":{"name":"U"},"107":{"name":"Y"},"108":{"name":"Y"},"109":{"name":"Z"}};
    }
    if (dictionary === "test") {
      let mydeck = {"1":{"name":"A"},"2":{"name":"A"},"3":{"name":"A"},"4":{"name":"A"},"5":{"name":"A"},"6":{"name":"A"},"7":{"name":"A"},"8":{"name":"A"},"9":{"name":"A"},"10":{"name":"C"},"11":{"name":"C"},"12":{"name":"C"},"13":{"name":"C"},"14":{"name":"T"},"15":{"name":"T"},"16":{"name":"T"},"17":{"name":"T"},"18":{"name":"T"},"19":{"name":"T"},"20":{"name":"T"}};
    }
    return this.mydeck;
  }

  returnLetters() {
    var dictionary = this.game.options.dictionary;
    if (dictionary === "twl") {
      this.letterset = {"A":{"score":1},"B":{"score":3},"C":{"score":2},"D":{"score":2},"E":{"score":1},"F":{"score":2},"G":{"score":2},"H":{"score":1},"I":{"score":1},"J":{"score":8},"K":{"score":4},"L":{"score":2},"M":{"score":2},"N":{"score":1},"O":{"score":1},"P":{"score":2},"Q":{"score":10},"R":{"score":1},"S":{"score":1},"T":{"score":1},"U":{"score":2},"V":{"score":3},"W":{"score":2},"X":{"score":8},"Y":{"score":2},"Z":{"score":10}};
    }
    if (dictionary === "fise" || dictionary === "tagalog") {
      this.letterset = {"A":{"score":1},"B":{"score":2},"C":{"score":3},"D":{"score":2},"E":{"score":1},"F":{"score":4},"G":{"score":2},"H":{"score":4},"I":{"score":1},"J":{"score":8},"L":{"score":1},"M":{"score":3},"N":{"score":1},"Ñ":{"score":8},"O":{"score":1},"P":{"score":3},"Q":{"score":6},"R":{"score":2},"S":{"score":1},"T":{"score":1},"U":{"score":1},"V":{"score":4},"X":{"score":8},"Y":{"score":4},"Z":{"score":10}};
    }
    if (dictionary === "sowpods") {
      this.letterset = {"A":{"score":1},"B":{"score":3},"C":{"score":2},"D":{"score":2},"E":{"score":1},"F":{"score":2},"G":{"score":2},"H":{"score":1},"I":{"score":1},"J":{"score":8},"K":{"score":4},"L":{"score":2},"M":{"score":2},"N":{"score":1},"O":{"score":1},"P":{"score":2},"Q":{"score":10},"R":{"score":1},"S":{"score":1},"T":{"score":1},"U":{"score":2},"V":{"score":3},"W":{"score":2},"X":{"score":8},"Y":{"score":2},"Z":{"score":10}};
    }
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


  ////////////////
  // Score Word //
  ////////////////
  scoreWord(word, player, orientation, x, y) {

    let score = 0;
    let touchesWord = 0;
    let thisword = "";
    let finalword = "";
    x = parseInt(x);
    y = parseInt(y);

    //
    // find the start of the word
    //

    if (orientation == "horizontal") {

      let beginning_of_word = x;
      let end_of_word = x;
      let tilesUsed = 0;

      //
      // find the beginning of the word
      //
      let current_x = parseInt(x) - 1;
      let current_y = y;
      let boardslot = y + "_" + current_x;
      let divname = "#" + boardslot;

      if (current_x < 1) {
        beginning_of_word = 1;
      } else {
        while (this.game.board[boardslot].letter != "_" && current_x >= 1) {
          beginning_of_word = current_x;
          current_x--;
          boardslot = y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x < 1) {
            break;
          }
        }
      }

      //
      // find the end of the word
      //
      current_x = parseInt(x) + 1;
      current_y = y;
      boardslot = y + "_" + current_x;
      divname = "#" + boardslot;

      if (current_x <= 15) {
        while (this.game.board[boardslot].letter != "_" && current_x <= 15) {
          end_of_word = current_x;
          current_x++;
          boardslot = y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x > 15) {
            break;
          }
        }
      }

      let word_bonus = 1;

      //
      // score this word
      //
      thisword = "";

      for (let i = beginning_of_word, k = 0; i <= end_of_word; i++) {
        boardslot = y + "_" + i;
        let tmpb = this.returnBonus(boardslot);
        let letter_bonus = 1;

console.log(tmpb + " -- " + this.game.board[boardslot].fresh);

        if (tmpb == "3W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 3;
        }

        if (tmpb == "2W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 2;
        }

        if (tmpb == "3L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 3;
        }

        if (tmpb == "2L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 2;
        }

        if (this.game.board[boardslot].fresh == 1) {
          tilesUsed += 1;
        }

        if (this.game.board[boardslot].fresh != 1) {
          touchesWord = 1;
        }

        let thisletter = this.game.board[boardslot].letter;
        thisword += thisletter;
        score += this.letters[thisletter].score * letter_bonus;
      }

      if (!this.checkWord(thisword)) {
        return -1;
      }

      finalword += thisword;

      if (tilesUsed == 7) {
        score += 10;
        word_bonus += 1;
      }

      score *= word_bonus;

      //
      // now score vertical words 
      //

      for (let i = x; i < x + word.length; i++) {
        boardslot = y + "_" + i;

        if (this.game.board[boardslot].fresh == 1) {
          let orth_start = parseInt(y);
          let orth_end = parseInt(y);

          //
          // find the beginning of the word
          //

          current_x = i;
          current_y = orth_start - 1;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y == 0) {
            orth_start = 1;
          } else {
            while (this.game.board[boardslot].letter != "_" && current_y > 0) {
              orth_start = current_y;
              current_y--;
              boardslot = current_y + "_" + current_x;
              divname = "#" + boardslot;

              if (current_y < 1) {
                break;
              }
            }
          }

          //
          // find the end of the word
          //


          current_x = i;
          current_y = orth_end + 1;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y > 15) {
            orth_end = 15;
          } else {
            while (this.game.board[boardslot].letter != "_" && current_y <= 15) {
              orth_end = current_y;
              current_y++;
              boardslot = current_y + "_" + current_x;

              if (current_y > 15) {
                break;
              }
            }
          }

          let wordscore = 0;
          let word_bonus = 1;

          //
          // score this word
          //

          thisword = "";

          if (orth_start != orth_end) {
            for (let w = orth_start, q = 0; w <= orth_end; w++) {
              let boardslot = w + "_" + i;
              let tmpb = this.returnBonus(boardslot);
              let letter_bonus = 1;

              if (tmpb == "3W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 3;
              }

              if (tmpb == "2W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 2;
              }

              if (tmpb == "3L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 3;
              }

              if (tmpb == "2L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 2;
              }

              if (this.game.board[boardslot].fresh != 1) {
                touchesWord = 1;
              }

              let thisletter = this.game.board[boardslot].letter;
              thisword += thisletter;
              wordscore += this.letters[thisletter].score * letter_bonus;
            }

            score += wordscore * word_bonus;

            if (!this.checkWord(thisword)) {
              return -1;
            }
          }
        }
      }
    }

    if (orientation == "vertical") {
      let beginning_of_word = y;
      let end_of_word = y;
      let tilesUsed = 0;

      //
      // find the beginning of the word
      //

      let current_x = parseInt(x);
      let current_y = parseInt(y) - 1;
      let boardslot = current_y + "_" + current_x;
      let divname = "#" + boardslot;

      if (current_y <= 0) {
        beginning_of_word = 1;
      } else {
        while (this.game.board[boardslot].letter != "_" && current_y > 0) {
          beginning_of_word = current_y;
          current_y--;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y <= 0) {
            break;
          }
        }
      }

      //
      // find the end of the word
      //
      current_x = parseInt(x);
      current_y = parseInt(y) + 1;
      boardslot = current_y + "_" + current_x;
      divname = "#" + boardslot;

      if (current_y > 15) {
        end_of_word = 15;
      } else {
        while (this.game.board[boardslot].letter != "_" && current_y <= 15) {
          end_of_word = current_y;
          current_y++;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y > 15) {
            break;
          }
        }
      }

      let word_bonus = 1;

      //
      // score this word
      //
      for (let i = beginning_of_word, k = 0; i <= end_of_word; i++) {
        boardslot = i + "_" + x;
        let tmpb = this.returnBonus(boardslot);
        let letter_bonus = 1;

        if (tmpb == "3W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 3;
        }

        if (tmpb == "2W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 2;
        }

        if (tmpb == "3L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 3;
        }

        if (tmpb == "2L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 2;
        }

        if (this.game.board[boardslot].fresh == 1) {
          tilesUsed += 1;
        }

        if (this.game.board[boardslot].fresh != 1) {
          touchesWord = 1;
        }

        let thisletter = this.game.board[boardslot].letter;
        thisword += thisletter;
        score += this.letters[thisletter].score * letter_bonus;
      }

      if (!this.checkWord(thisword)) {
        return -1;
      }

      finalword += thisword;

      if (tilesUsed == 7) {
        score += 10;
        word_bonus += 1;
      }

      score *= word_bonus;

      //
      // now score horizontal words 
      //

      for (let i = y; i < y + word.length; i++) {
        boardslot = i + "_" + x;

        if (this.game.board[boardslot].fresh == 1) {
          let orth_start = parseInt(x);
          let orth_end = parseInt(x);

          //
          // find the beginning of the word
          //
          current_x = orth_start - 1;
          current_y = i;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x < 1) {
            orth_start = 1;
          } else {
            while (this.game.board[boardslot].letter != "_" && current_x > 0) {
              orth_start = current_x;
              current_x--;
              boardslot = current_y + "_" + current_x;
              divname = "#" + boardslot;

              if (current_x < 1) {
                break;
              }
            }
          }

          //
          // find the end of the word
          //
          current_x = orth_end + 1;
          current_y = i;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x > 15) {
            orth_end = 15;
          } else {
            //
            // >= instead of greater than
            //
            while (this.game.board[boardslot].letter != "_" && current_x <= 15) {
              orth_end = current_x;
              current_x++;
              boardslot = current_y + "_" + current_x;

              if (current_x > 15) {
                break;
              }
            }
          }

          let wordscore = 0;
          let word_bonus = 1;

          //
          // score this word
          //

          thisword = "";

          if (orth_start != orth_end) {
            for (let w = orth_start, q = 0; w <= orth_end; w++) {
              boardslot = i + "_" + w;
              let tmpb = this.returnBonus(boardslot);
              let letter_bonus = 1;

              if (tmpb === "3W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 3;
              }

              if (tmpb === "2W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 2;
              }

              if (tmpb === "3L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 3;
              }

              if (tmpb === "2L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 2;
              }

              if (this.game.board[boardslot].fresh != 1) {
                touchesWord = 1;
              }

              let thisletter = this.game.board[boardslot].letter;
              thisword += thisletter;
              wordscore += this.letters[thisletter].score * letter_bonus;
            }

            score += wordscore * word_bonus;

            if (!this.checkWord(thisword)) {
              return -1;
            }
          }
        }
      }
    }

    if (this.firstmove == 0 && touchesWord == 0) {
      salert("Word does not cross our touch an existing word.");
      return -1;
    }

    this.firstmove = 0;
    let last_move_html = "";
    if (this.game.words_played[player-1].length > 0) { last_move_html = finalword == '' ? '...' : `Player ${player} played ${finalword} for: ${this.game.words_played[player-1][this.game.words_played[player-1].length-1].score} points (total: ${this.game.score[player-1]})`; }
//    let last_move_html = finalword == '' ? '...' : `Player ${player} played ${finalword} for: ${score} points (total: ${this.game.score[player-1]}))`;
    $('.lastmove').html(last_move_html);
    $('#remainder').html(`DECK: ${this.game.deck[0].crypt.length}`);
    this.last_played_word = { player, finalword, score };
    return score;
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
    // QUEUE //
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
          this.disableEvents();
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
          this.setBoard(word, orient, x, y);
          score = this.scoreWord(word, player, orient, x, y);
          this.exhaustWord(word, orient, x, y);
          this.addScoreToPlayer(player, score);

	  this.game.words_played[parseInt(player)-1].push({ word : word , score : score });

        } else {

	  //
	  // scoring done when added to board - MARCH 21
	  //
          //score = this.scoreWord(word, player, orient, x, y);
	  //this.game.words_played[parseInt(player)-1].push({ word : word , score : score });

	}


        if (wordblocks_self.game.over == 1) {
          return;
        }

        if (wordblocks_self.game.player == wordblocks_self.returnNextPlayer(player)) {
          if (wordblocks_self.checkForEndGame() == 1) {
            return;
          }

          wordblocks_self.updateStatusWithTiles("YOUR GO: click board to place or <span class=\"link tosstiles\">discard</span>.");
          wordblocks_self.enableEvents();
        } else {
          wordblocks_self.updateStatusWithTiles("Player " + wordblocks_self.returnNextPlayer(player) + " turn");
          wordblocks_self.disableEvents();
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

        if (wordblocks_self.game.player == wordblocks_self.returnNextPlayer(player)) {
          wordblocks_self.updateStatusWithTiles("YOUR GO: click on board to place tiles, or <span class=\"link tosstiles\">discard</span>.");
          wordblocks_self.enableEvents();
        } else {
          wordblocks_self.updateStatusWithTiles("Player " + wordblocks_self.returnNextPlayer(player) + " turn");
          wordblocks_self.disableEvents();
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
            <option value="sowpods" selected>English: SOWPODS</option>
            <option value="twl">English: TWL06</option>
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
