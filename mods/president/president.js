const GameHud = require('../../lib/templates/lib/game-hud/game-hud');
const Cardfan = require('../../lib/templates/lib/game-cardfan/game-cardfan');
const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');




//////////////////
// CONSTRUCTOR  //
//////////////////
class President extends GameTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "President";
    this.description = 'Play cards in singles or sets in increasing value. Last player starts when all are done. The first player who gets rid of their cards is the President. The last?';
    this.categories = "Games Arcade Entertainment";
    this.card_img_dir = '/president/img/cards';
    this.useHUD = 1;

    this.minPlayers = 2;
    this.maxPlayers = 4;
    this.interface = 1;
    this.boardgameWidth = 5100;

    this.updateHTML = "";

    //this.cardfan = new Cardfan(this.app, this);
    this.hud = new GameHud(this.app, {});
    this.hud.mode = 0;
    this.hud.cardbox.cardfan = 1;

    return this;

  }




  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/president/img/arcade/arcade-banner-background.png";
      obj.title = "President";
      return obj;
    }

    return null;

  }








  initializeQueue() {

    this.game.queue = [];

    this.game.queue.push("newround");
    this.game.queue.push("READY");

  }



  initializeHTML(app) {

    super.initializeHTML(app);
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    //
    // add card events -- text shown and callback run if there
    //
    this.hud.addCardType("logcard", "", null);
    this.hud.addCardType("showcard", "select", this.cardbox_callback);
    this.hud.addCardType("card", "select", this.cardbox_callback);
    if (!app.browser.isMobileBrowser(navigator.userAgent)) {
      this.hud.cardbox.skip_card_prompt = 1;
      // we have to confirm as card select is not automatic in multi-card cardfan
      this.hud.cardbox.skip_card_prompt = 0;
      this.hud.card_width = 80;
    } else {
      this.hud.card_width = 80;
    }

    this.hud.render(app, this);
  }




  initializeGame(game_id) {

    //
    // game engine needs this to start
    //
    if (this.game.status != "") { this.updateStatus(this.game.status); }

    //
    // initialize
    //
    if (this.game.deck.length == 0) {

      this.game.state = this.returnState(this.game.players.length);
      this.game.players_info = this.returnPlayers(this.game.players.length);

      this.updateStatus("Generating the Game");
      this.initializeQueue();

    }

    if (this.browser_active) { this.displayBoard(); }

  }





  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      if (mv[0] == "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
      }

      if (mv[0] === "play") {

        let player = parseInt(mv[1]);
        let cards = JSON.parse(mv[2]);
        let deck = this.returnDeck();
        for (let i = 0; i < cards.length; i++) {
          this.game.state.played.push(cards[i]);
        }
        this.game.state.last_player_to_play = player;
        this.game.state.last_played = cards;

        if (player == this.game.player) {
          for (let i = 0; i < cards.length; i++) {
            this.removeCardFromHand(cards[i]);
          }
        }

        let cards_played = "";
        for (let i = 0; i < cards.length; i++) {
          if (i > 0) { cards_played += ", "; }
          cards_played += deck[cards[i]].name;
        }
        this.updateLog(this.returnPlayerName(player) + " plays " + cards_played);

        this.game.queue.splice(qe, 1);
        this.displayTable();
        return 1;

      }

      if (mv[0] === "cards") {

        let player = parseInt(mv[1]);
        let cards_left = parseInt(mv[2]);
        this.game.players_info[player - 1].cards = cards_left;

        if (cards_left == 0) {
          this.game.players_info[player - 1].out = 1;
          this.game.players_info[player - 1].rank = (this.game.state.players_out + 1);
          this.game.state.players_out++;
        }

        this.game.queue.splice(qe, 1);
        this.displayTable();
        return 1;

      }


      if (mv[0] === "turn") {

        let player_to_go = parseInt(mv[1]);

        this.displayBoard();
        this.game.state.turn++;

        this.game.queue.splice(qe, 1);

        let has_everyone_passed = 1;
        for (let i = 0; i < this.game.players_info.length; i++) {
          if (this.game.players_info[i].passed == 0 && this.game.players_info[i].out != 1) { has_everyone_passed = 0; }
        }
        if (has_everyone_passed == 1) {
          return 1;
        }

        if (this.game.players_info[player_to_go - 1].out == 1) {
          this.game.queue.splice(qe, 1);
          return 1;
        } else {
          this.game.queue.splice(qe, 1);
          if (parseInt(mv[1]) == this.game.player) {
            this.playerTurn();
            return 0;
          } else {
            this.updateStatusAndListCards("Waiting for " + this.game.players[player_to_go - 1]);
            return 0;
          }
          shd_continue = 0;
        }
      }


      if (mv[0] === "newround") {
        this.game.queue.splice(qe, 1);
        this.startNewRound();
        return 1;
      }



      if (mv[0] === "round") {

        this.game.deck[0].hand.sort();

        //
        // new round of turns for players
        //
        let has_everyone_passed = 1;
        for (let i = 0; i < this.game.players_info.length; i++) {
          if (this.game.players_info[i].passed == 0) { has_everyone_passed = 0; }
        }
        if (has_everyone_passed == 1) {

          //
          // clear the table and let the last player go first
          //
          this.game.state.last_played = [];
          for (let i = 0; i < this.game.players_info.length; i++) {
            this.game.players_info[i].passed = 0;
          }

          this.game.state.first_player_in_round = this.game.state.last_player_to_play;

        }



        //
        // are there any players left ?
        //
        let players_left = 0;
        for (let i = 0; i < this.game.players_info.length; i++) {
          if (this.game.players_info[i].out == 0) {
            players_left++;
          }
        }

        //
        // end of a turn, so redeal
        //
        if (players_left <= 1) {

          //
          // the last player out gets the last rank
          //
          for (let i = 0; i < this.game.players_info.length; i++) {
            if (this.game.players_info[i].rank == 0) {
              this.game.players_info[i].rank = (this.game.state.players_out + 1);
              this.game.state.players_out++;
            }
          }

          this.game.queue.splice(qe, 1);
          this.startNewRound();
          return 1;
        }

        this.displayBoard();

        //
        //
        //
        let player_to_go = this.game.state.first_player_in_round;

        if (player_to_go == 0) {
          // we are at the start of a new round
          player_to_go = 1;
        }

        for (let i = player_to_go + 1; i <= (player_to_go + this.game.players.length); i++) {
          let player_to_turn = (i % this.game.players.length);
          if (player_to_turn == 0) { player_to_turn = this.game.players.length; }
          this.game.queue.push("turn\t" + player_to_turn);
        }

      }


      if (mv[0] === "pass") {

        let player = parseInt(mv[1]);
        this.game.players_info[player - 1].passed = 1;
        this.game.queue.splice(qe, 1);

        this.updateLog(this.returnPlayerName(player) + " passes");

      }



      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        console.log("NOT CONTINUING");
        return 0;
      }

    }
    return 1;
  }


  returnPlayerName(player_num) {
    return ("Player " + player_num);
  }


  startNewRound() {

    this.updateLog("shuffling the Deck and dealing new cards...");

    this.resetDeck(0);

    if (this.game.players.length == 2) {
      this.game.queue.push("round");
      this.game.queue.push("cards\t1\t26");
      this.game.queue.push("cards\t2\t26");
      this.game.queue.push("DEAL\t1\t2\t26");
      this.game.queue.push("DEAL\t1\t1\t26");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    }
    if (this.game.players.length == 3) {
      let num = this.rollDice(3);
      let p1c = 17;
      let p2c = 17;
      let p3c = 17;
      if (num == 1) { p1c++; }
      if (num == 2) { p2c++; }
      if (num == 3) { p3c++; }
      this.game.queue.push("round");
      this.game.queue.push("cards\t1\t" + (p1c));
      this.game.queue.push("cards\t2\t" + (p2c));
      this.game.queue.push("cards\t3\t" + (p3c));
      this.game.queue.push("DEAL\t1\t3\t" + (p3c));
      this.game.queue.push("DEAL\t1\t2\t" + (p2c));
      this.game.queue.push("DEAL\t1\t1\t" + (p1c));
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    }
    if (this.game.players.length == 4) {
      this.game.queue.push("round");
      this.game.queue.push("cards\t4\t26");
      this.game.queue.push("cards\t3\t26");
      this.game.queue.push("cards\t2\t26");
      this.game.queue.push("cards\t1\t26");
      this.game.queue.push("DEAL\t1\t4\t26");
      this.game.queue.push("DEAL\t1\t3\t26");
      this.game.queue.push("DEAL\t1\t2\t26");
      this.game.queue.push("DEAL\t1\t1\t26");
      this.game.queue.push("DECKENCRYPT\t1\t4");
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t4");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    }

    this.game.state.turn = 0;
    this.game.state.players_out = 0;
    this.game.state.round++;

    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] === this.app.wallet.returnPublicKey()) {
        this.game.player = (i + 1);
      }
    }

    for (let i = 0; i < this.game.players_info.length; i++) {
      this.game.players_info[i].passed = 0;
      this.game.players_info[i].out = 0;
      this.game.players_info[i].rank = 0;
    }
    this.game.state.last_played = [];
    this.game.state.last_player_to_play = 0;
    this.game.state.first_player_in_round = 0;

  }


  playerTurn() {

    let president_self = this;

    this.displayBoard();

    if (this.game.state.last_played.length == 0) {
      this.updateStatusAndListCards("Start the Round");
    } else {
      this.updateStatusAndListCards("Play a card or <div style='display:inline' class='pass'>pass</div>");
    }

    $('.pass').on('click', function () {
      president_self.addMove("pass\t" + president_self.game.player);
      president_self.endTurn(1);
      return;
    });
    this.addShowCardEvents(function (card) {
      if (president_self.isValidPlay(this.hud.cardbox.cards)) {
        president_self.addMove("cards\t" + president_self.game.player + "\t" + (president_self.game.deck[0].hand.length - 1));
        president_self.addMove("play\t" + president_self.game.player + "\t" + JSON.stringify(this.hud.cardbox.cards));
        president_self.updateLog("cards played");
        president_self.endTurn(1);
      } else {
        alert("invalid move!");
      }
    });

    this.updateLog("Starting New Round...");
    document.querySelectorAll('.plog').forEach(el => {
      el.innerHTML = "";
    });

    this.displayBoard();

  }




  displayBoard() {

    if (this.browser_active == 0) { return; }

    try {
      this.displayPlayers();
      this.displayTable();
    } catch (err) {
      console.log("err: " + err);
    }

  }



  returnPlayers(num_of_players) {

    let players_info = [];

    for (let i = 0; i < num_of_players; i++) {
      players_info.push({});
      players_info[i].cards = 0;
      players_info[i].passed = 0;
      players_info[i].out = 0;
      players_info[i].rank = 0;
    };

    return players_info;

  }

  returnState(num_of_players) {

    let state = {};

    state.round = 0;
    state.turn = 0;
    state.last_player_to_play = 0;
    state.played = [];
    state.last_played = [];
    state.players_out = 0;

    return state;

  }



  returnCardFromDeck(idx) {

    let deck = this.returnDeck();
    let card = deck[idx];

    return card.name.substring(0, card.name.indexOf('.'));

  }

  returnDeck() {

    var deck = {};

    deck['01'] = { name: "C3.png" }
    deck['02'] = { name: "H3.png" }
    deck['03'] = { name: "D3.png" }
    deck['04'] = { name: "S3.png" }
    deck['05'] = { name: "C4.png" }
    deck['06'] = { name: "H4.png" }
    deck['07'] = { name: "D4.png" }
    deck['08'] = { name: "S4.png" }
    deck['09'] = { name: "C5.png" }
    deck['10'] = { name: "H5.png" }
    deck['11'] = { name: "D5.png" }
    deck['12'] = { name: "S5.png" }
    deck['13'] = { name: "C6.png" }
    deck['14'] = { name: "H6.png" }
    deck['15'] = { name: "D6.png" }
    deck['16'] = { name: "S6.png" }
    deck['17'] = { name: "C7.png" }
    deck['18'] = { name: "H7.png" }
    deck['19'] = { name: "D7.png" }
    deck['20'] = { name: "S7.png" }
    deck['21'] = { name: "C8.png" }
    deck['22'] = { name: "H8.png" }
    deck['23'] = { name: "D8.png" }
    deck['24'] = { name: "S8.png" }
    deck['25'] = { name: "C9.png" }
    deck['26'] = { name: "H9.png" }
    deck['27'] = { name: "D9.png" }
    deck['28'] = { name: "S9.png" }
    deck['29'] = { name: "C10.png" }
    deck['30'] = { name: "H10.png" }
    deck['31'] = { name: "D10.png" }
    deck['32'] = { name: "S10.png" }
    deck['33'] = { name: "C11.png" }
    deck['34'] = { name: "H11.png" }
    deck['35'] = { name: "D11.png" }
    deck['36'] = { name: "S11.png" }
    deck['37'] = { name: "C12.png" }
    deck['38'] = { name: "H12.png" }
    deck['39'] = { name: "D12.png" }
    deck['40'] = { name: "S12.png" }
    deck['41'] = { name: "C13.png" }
    deck['42'] = { name: "H13.png" }
    deck['43'] = { name: "D13.png" }
    deck['44'] = { name: "S13.png" }
    deck['45'] = { name: "C1.png" }
    deck['46'] = { name: "H1.png" }
    deck['47'] = { name: "D1.png" }
    deck['48'] = { name: "S1.png" }
    deck['49'] = { name: "C2.png" }
    deck['50'] = { name: "H2.png" }
    deck['51'] = { name: "D2.png" }
    deck['52'] = { name: "S2.png" }
    //deck['53'] = { name: "J1.png" }
    //deck['54'] = { name: "J2.png" }

    return deck;

  }





  displayPlayers() {

    let player_box = null;
    let prank = 0;

    if (this.game.players.includes(this.app.wallet.returnPublicKey())) {
      player_box = this.returnPlayersBoxArray();
      prank = this.game.players.indexOf(this.app.wallet.returnPublicKey());
    } else {
      document.querySelector('.status').innerHTML = "You are out of the game.<br />Feel free to hang out and chat.";
      document.querySelector('.cardfan').classList.add('hidden');
      player_box = this.returnViewBoxArray();
    }

    for (let j = 2; j < 7; j++) {
      let boxobj = document.querySelector("#player-info-" + j);
      if (!player_box.includes(j)) {
        boxobj.style.display = "none";
      } else {
        boxobj.style.display = "block";
      }
    }


    for (let i = 0; i < this.game.players.length; i++) {

      let seat = i - prank;
      if (seat < 0) { seat += this.game.players.length }

      let player_box_num = player_box[seat];
      let divname = "#player-info-" + player_box_num;
      let boxobj = document.querySelector(divname);


      let newhtml = `
        <div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">
        <div class="player-info-hand-cards">${this.game.players_info[i].cards}</div>
        <div class="mini-cardfan-holder">
        <div class="mini-cardfan">`;
      let closehtml = "";

      for (let c = 0; c < this.game.players_info[i].cards; c++) {
        newhtml += `<div><img class="card" src="${this.card_img_dir}/red_back.png">`;
        closehtml += `</div>`;
      };
      newhtml += closehtml;


      newhtml += `
          </div>
        </div>
        <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.players[i]}</div>
      `;
      boxobj.querySelector(".info").innerHTML = newhtml;

      if (boxobj.querySelector(".plog").innerHTML == "") {
        boxobj.querySelector(".plog").innerHTML += `<div class="player-info-log" id="player-info-log-${i + 1}"></div>`;
      }

    }


  }


  displayTable() {

    if (this.browser_active == 0) { return; }

    let obj = document.getElementById("played_cards");
    let html = '';
    for (let i = 0; i < this.game.state.last_played.length; i++) {
      html += this.returnCardImage(this.game.state.last_played[i], 1);
    }
    obj.innerHTML = html;

  }




  returnGameOptionsHTML() {

    return `
            <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>
    `;

  }

  returnFormattedGameOptions(options) {
    let new_options = {};
    for (var index in options) {
      if (index == "stake") {
        new_options[index] = options[index];
      }
    }
    return new_options;
  }

  showSplash(message) {
    var shim = document.querySelector('.shim');
    shim.classList.remove('hidden');
    shim.firstElementChild.innerHTML = message;
    shim.addEventListener('click', (e) => {
      shim.classList.add('hidden');
      shim.firstElementChild.innerHTML = "";
    });
  }




  returnCardImage(cardname, force) {

    let cardclass = "card";
    var c = this.game.deck[0].cards[cardname];
    if (c == undefined) { c = this.game.deck[0].discards[cardname]; }
    if (c == undefined) { c = this.game.deck[0].removed[cardname]; }
    if (c == undefined) {

      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">' + cardname + '</div>';

    }

    return `<img class="${cardclass}" src="/president/img/cards/${c.name}" />`;

  }




  returnCardItem(card) {

    if (this.interface == 1) {
      if (this.game.deck[0].cards[card] == undefined) {
        return `<div id="${card.replace(/ /g, '')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card, 1)}</div>`;
      }
      return `<div id="${card.replace(/ /g, '')}" class="card showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card, 1)}</div>`;
    } else {
      if (this.game.deck[0].cards[card] == undefined) {
        return '<li class="card showcard" id="' + card + '">' + this.game.deck[0].cards[card].name + '</li>';
      }
      return '<li class="card showcard" id="' + card + '">' + this.game.deck[0].cards[card].name + '</li>';
    }

  }



  returnCardList(cardarray = []) {

    let hand = this.game.deck[0].hand;
    let html = "";

    if (this.interface == 1) {
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i]);
      }
      html = `
        <div class="status-cardbox" id="status-cardbox">
          ${html}
        </div>`;
    } else {

      html = "<ul>";
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i]);
      }
      html += '</ul>';

    }

    return html;

  }


  updateStatusAndListCards(message, cards = null) {

    if (cards == null) {
      cards = this.game.deck[0].hand;
    }

    html = `
        <div id="status-message" class="status-message">${message}</div>
        ${this.returnCardList(cards)}
    `
    this.updateStatus(html);
    this.addShowCardEvents(function (card) {
    });

  }


  returnPlayersBoxArray() {

    let player_box = [];

    if (this.game.players.length == 2) { player_box = [1, 4]; }
    if (this.game.players.length == 3) { player_box = [1, 3, 5]; }
    if (this.game.players.length == 4) { player_box = [1, 3, 4, 5]; }
    if (this.game.players.length == 5) { player_box = [1, 2, 3, 5, 6]; }
    if (this.game.players.length == 6) { player_box = [1, 2, 3, 4, 5, 6]; }

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



  isValidPlay(cards) {

    let hand1 = this.convertHand(cards);
    let hand2 = this.convertHand(this.game.state.last_played);

    if (hand1.length > 1) {
      if (hand1.length == 2 && hand1.pair == 0) { return 0; }
      if (hand1.length == 3 && hand1.triple == 0) { return 0; }
      if (hand1.length == 4 && hand1.four_of_a_kind == 0) { return 0; }
    }

    if (this.isHigher(hand1, hand2)) {
      return 1;
    } else {
      return 0;
    }

  }





  // is hand1 higher than hand2
  isHigher(hand1, hand2) {
    if (hand2.length != 0) {
      if (hand1.length != hand2.length) { return 0; }
      if (hand1.lowest <= hand2.lowest) { return 0; }
    }
    return 1;
  }


  convertHand(cards) {

    let deck = this.returnDeck();

    let x = {};
    x.suite = [];
    x.val = [];

    for (let i = 0; i < cards.length; i++) {
      let card_from_deck = this.returnCardFromDeck(cards[i]);
      let card_suite = card_from_deck[0];
      let card_value = parseInt(card_from_deck.substring(1));
      let cva = 0;
      x.suite.push(card_suite);
      // aces high
      if (card_suite == "J" && cva == 0) { cva = 1; x.val.push("16"); }
      if (card_value == 2 && cva == 0) { cva = 1; x.val.push("15"); }
      if (card_value == 1 && cva == 0) { cva = 1; x.val.push("14"); }
      if (cva == 0) { cva = 1; x.val.push(card_value); }
    }

    x.lowest = x.val[0];
    for (let i = 0; i < x.val.length; i++) {
      if (x.val[i] < x.lowest) { x.lowest = x.val[i]; }
    }

    x.one_of_a_kind = 0;
    x.pair = 0;
    x.triple = 0;
    x.four_of_a_kind = 0;

    if (x.val.length == 1) {
      x.one_of_a_kind = 1;
    }
    if (x.val.length == 2 && this.isOfAKind(x)) {
      x.pair = 1;
    }
    if (x.val.length == 3 && this.isOfAKind(x)) {
      x.triple = 1;
    }
    if (x.val.length == 4 && this.isOfAKind(x)) {
      x.four_of_a_kind = 1;
    }

    return x;

  }



  isOfAKind(hand) {

    if (hand.val.length == 0) { return 0; }

    let vlu = hand.val[0];

    for (let i = 0; i < hand.val.length; i++) {
      if (hand.val[i] != vlu) { return 0; }
    }

    return 1;

  }



}


module.exports = President;

