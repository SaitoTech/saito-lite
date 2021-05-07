const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');




//////////////////
// CONSTRUCTOR  //
//////////////////
class Blackjack extends GameTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "Blackjack";
    this.description = 'BETA version of Blackjack. This game is a playable demo under active development!';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Classic Cardgame";

    this.card_img_dir = '/poker/img/cards';
    this.useHUD = 0;

    this.minPlayers = 2;
    this.maxPlayers = 6;
    this.interface = 1;

    this.boardgameWidth = 5100;

    this.updateHTML = "";

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
      obj.background = "/poker/img/arcade/arcade-banner-background.png";
      obj.title = "Blackjack";
      return obj;
    }

    return null;

  }





  startRound() {

    this.game.queue.push("startplay");

    this.game.state.player_wager = [];
    this.game.state.player_payout = [];
    this.game.state.player_hands = [];
    this.game.state.player_total = [];
    for (let i = 0; i < this.game.players.length; i++) {
      this.game.state.player_wager[i] = 0;
      this.game.state.player_payout[i] = 1;
      this.game.state.player_hands[i] = [];
      this.game.state.player_total[i] = 0;
    }


    //
    // players
    //
    if (this.game.players.length == 2) {
      this.game.queue.push("revealhand\t2");
      this.game.queue.push("revealhand\t1");
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 3) {
      this.game.queue.push("revealhand\t3");
      this.game.queue.push("revealhand\t2");
      this.game.queue.push("revealhand\t1");
      this.game.queue.push("DEAL\t1\t3\t2");
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 4) {
      this.game.queue.push("revealhand\t4");
      this.game.queue.push("revealhand\t3");
      this.game.queue.push("revealhand\t2");
      this.game.queue.push("revealhand\t1");
      this.game.queue.push("DEAL\t1\t4\t2");
      this.game.queue.push("DEAL\t1\t3\t2");
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t4");
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t4");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 5) {
      this.game.queue.push("revealhand\t5");
      this.game.queue.push("revealhand\t4");
      this.game.queue.push("revealhand\t3");
      this.game.queue.push("revealhand\t2");
      this.game.queue.push("revealhand\t1");
      this.game.queue.push("DEAL\t1\t5\t2");
      this.game.queue.push("DEAL\t1\t4\t2");
      this.game.queue.push("DEAL\t1\t3\t2");
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t5");
      this.game.queue.push("DECKENCRYPT\t1\t4");
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t5");
      this.game.queue.push("DECKXOR\t1\t4");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 6) {
      this.game.queue.push("revealhand\t6");
      this.game.queue.push("revealhand\t5");
      this.game.queue.push("revealhand\t4");
      this.game.queue.push("revealhand\t3");
      this.game.queue.push("revealhand\t2");
      this.game.queue.push("revealhand\t1");
      this.game.queue.push("DEAL\t1\t6\t2");
      this.game.queue.push("DEAL\t1\t5\t2");
      this.game.queue.push("DEAL\t1\t4\t2");
      this.game.queue.push("DEAL\t1\t3\t2");
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t6");
      this.game.queue.push("DECKENCRYPT\t1\t5");
      this.game.queue.push("DECKENCRYPT\t1\t4");
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t6");
      this.game.queue.push("DECKXOR\t1\t5");
      this.game.queue.push("DECKXOR\t1\t4");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    //this.game.queue.push("BALANCE\t0\t"+this.app.wallet.returnPublicKey()+"\t"+"SAITO");

    //
    // set your wager before cards dealt
    //
    for (let i = 0; i < this.game.players.length; i++) {
      if ( (i+1) != this.game.state.dealer) {
        this.game.queue.push("selectwager\t"+(i+1));
      }
    }

  }



  initializeHTML(app) {

    super.initializeHTML(app);

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    this.log.render(app, this);
    this.log.attachEvents(app, this);

  }





  initializeGame(game_id) {

    //
    // game engine needs this to start
    //
    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.dice == "") { this.initializeDice(); }

    //
    // initialize
    //
    if (this.game.deck.length == 0) {
      this.game.state = this.returnState(this.game.players.length);
      this.updateStatus("Generating the Game");
      this.game.state.required_pot = this.game.state.big_blind;

      this.game.queue = [];
      this.game.queue.push("start");
      this.game.queue.push("READY");
    }

    if (this.browser_active) {
      this.displayBoard();
    }
  }







  newRound() {

    //
    // advance and reset variables
    //
    this.game.state.turn = 0;
    this.game.state.round++;
    this.game.state.dealer++;

    if (this.game.state.dealer > this.game.players.length) { this.game.state.dealer = 1; }

    for (let i = 0; i < this.game.players.length; i++) {
      this.game.state.player_wager[i] = 0;
      this.game.state.player_payout[i] = 1;;
    }

    console.log("Round: "+ this.game.state.round);

    this.updateLog("New Round...");
    this.updateLog("Round: "+(this.game.state.round));
    document.querySelectorAll('.plog').forEach(el => {
       el.innerHTML = "";
    });

    this.startRound();
    this.displayPlayers();

  }




  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      if (mv[0] === "start") {
        this.newRound();
        return 1;
      }

      if (mv[0] === "newround") {
        this.game.queue.splice(qe, 1);
        this.newRound(); 
        return 1;
      }

      if (mv[0] === "startround") {
        this.game.queue.splice(qe, 1);
        this.startRound(); 
        return 1;
      }

      if (mv[0] === "play") {
        let player_to_go = parseInt(mv[1]);
        this.displayBoard();
        if (parseInt(mv[1]) == this.game.player) {
          this.playerTurn();
          return 0;
        } else {
          this.updateStatus("Waiting for " + this.game.state.player_names[mv[1] - 1], 1);
          return 0;
        }
      }

      if (mv[0] === "hit") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        if (player == this.game.state.dealer) {
          this.game.queue.push("revealhand\t"+player+"\t1");
        } else {
          this.game.queue.push("revealhand\t"+player);
        }
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 1;
      }

      if (mv[0] === "selectwager") {

        let blackjack_self = this;
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

        this.displayPlayers();

        if (this.game.player != player) {
          if (this.game.player == this.game.state.dealer) {
            this.updateStatus('<div class="">You are the dealer. Waiting for players to set their wager</div>');
            return 0;
          } else {
            this.updateStatus('<div class="">Player '+player+' is picking wager</div>');
            return 0;
          }
        }

        let html = `<div class="">How much would you like to wager? (${this.game.state.player_credit[this.game.player-1]})`;
            html += '</div>';
            html += '<ul>';
            html += '<li class="menu_option" id="25">25</li>';
            html += '<li class="menu_option" id="50">50</li>';
            html += '<li class="menu_option" id="75">75</li>';
            html += '<li class="menu_option" id="100">100</li>';
        html += '</ul>';
    
        this.updateStatus(html, 1);

        this.lockInterface();

	try {
        $('.menu_option').off();
        $('.menu_option').on('click', function () {

          $('.menu_option').off();
          blackjack_self.unlockInterface();
          blackjack_self.updateStatus("dealing cards");
          let choice = $(this).attr("id");

          blackjack_self.addMove("setwager\t" + blackjack_self.game.player + "\t" + choice);
          blackjack_self.endTurn();
          return 0;
        });
	} catch (err) {}

        return 0;
      }


      if (mv[0] === "setwager") {
        this.game.queue.splice(qe, 1);
        let player = parseInt(mv[1]);
        let wager = parseInt(mv[2]);
        this.game.state.player_wager[player-1] = wager;
        return 1;
      }



      if (mv[0] === "stand") {
        this.game.queue.splice(qe, 1);
        return 1;
      }

      if (mv[0] === "bust") {
        this.game.queue.splice(qe, 1);
        return 1;
      }


      if (mv[0] === "startplay") {

        this.game.queue.splice(qe, 1);

        this.displayBoard();
        this.game.queue.push("pickwinner");

        for (let i = 0; i < this.game.players.length; i++) {
          if ((i+1) == this.game.state.dealer) {
            this.game.queue.push("PLAY\t"+(i+1));
            this.game.queue.push("STATUS\tThe dealer is taking his turn");
          }
        }

        let players_to_go = [];
        let players_to_reveal = [];
        for (let i = 0; i < this.game.players.length; i++) {
          if ((i+1) != this.game.state.dealer) {
            players_to_go.push((i+1));
            players_to_reveal.push((i+1));
          }
        }

        this.game.queue.push("PLAY\t"+JSON.stringify(players_to_go));
        for (let i = 0; i < players_to_reveal.length; i++) {
          this.game.queue.push("revealhand\t"+players_to_reveal[i]);
        }

        if (this.game.player == this.game.state.dealer) {
          this.updateStatus("You are the dealer this round");
        }

        return 1;
      }


      if (mv[0] === "revealhand") {

        this.game.queue.splice(qe, 1);

        let player = parseInt(mv[1]);
        let force_reveal = 0;
        if (mv[2] == 1) { force_reveal = 1; }

        if (this.game.player == parseInt(mv[1])) {
          if (this.game.state.dealer == this.game.player && force_reveal == 0) {
            if (this.game.deck[0].hand.length > 0) {
              let cardarray = [this.game.deck[0].hand[0]];
              this.addMove("hand\t"+this.game.player+"\t"+JSON.stringify(cardarray));
            }
            this.endTurn();
          } else {
            if (this.game.deck[0].hand.length > 0) {
              this.addMove("hand\t"+this.game.player+"\t"+JSON.stringify(this.game.deck[0].hand));
            }
            this.endTurn();
          }
        }
        return 0;
      }

      if (mv[0] === "hand") {
        let player = parseInt(mv[1]);
        let hand = JSON.parse(mv[2]);
        this.game.state.player_hands[player-1] = hand;
        this.game.queue.splice(qe, 1);
        return 1;
      }


      if (mv[0] === "pickwinner") {

        this.game.queue.splice(qe, 1);
        this.pickWinner();

        //
        // move to next round when done
        //
        this.game.queue.push("newround");

        //
        // decide who wins
        //
        let number_of_winners = 0;
        let dealer_wins = 0;

        for (let i = 0; i < this.game.state.player_winner.length; i++) {
          if (this.game.state.player_winner[i] == 1) {
            number_of_winners++;
            if ((i+1) == this.game.state.dealer) {
              dealer_wins = 1;
            }
          }
        }

        //
        // calculate losses
        //
        let total_losses = 0;
        let my_losses = 0;
        for (let i = 0; i < this.game.state.player_winner.length; i++) {
          if (this.game.state.player_winner[i] == 0) {
            let losses = this.game.state.player_wager[i] * this.game.state.player_payout[i];
            my_losses = losses;
            this.game.state.player_credit[i] -= Math.floor(losses);
          } else {

//
//
// HACK CHECK TIES DEALER, ETC.
//
            let gains = this.game.state.player_wager[i] * this.game.state.player_payout[i];
            this.game.state.player_credit[i] += Math.floor(gains);
          }
        }



        //
        // manage payout
        //
        if (number_of_winners == 0) {
          this.game.queue.push("ACKNOWLEDGE\teveryone loses");
        } else {
          if (this.game.state.player_winner[this.game.player-1] == 1) {
            if (this.game.player == this.game.state.dealer) {
              if (this.game.state.player_winner[this.game.player-1] == 1) {
                if (number_of_winners > 1) {
                  this.game.queue.push("ACKNOWLEDGE\tyou tie");
                } else {
                  this.game.queue.push("ACKNOWLEDGE\tyou win");
                }
              } else {
                if (number_of_winners > 1) {
                  this.game.queue.push("ACKNOWLEDGE\tyou lose, badly");
                } else {
                  this.game.queue.push("ACKNOWLEDGE\tyou lose");
                }
              }
            } else {
              if (this.game.state.player_winner[this.game.player-1] == 1 && this.game.state.player_winner[this.game.state.dealer-1] == 1) {
                this.game.queue.push("ACKNOWLEDGE\tyou tie");
              } else {
                this.game.queue.push("ACKNOWLEDGE\tyou win");
              }
            }
          } else {
            this.game.queue.push("ACKNOWLEDGE\tyou lose");
            //
            // send tokens to others
            //
            if (this.game.player != this.game.state.dealer) {
              this.game.queue.push("PAY" + "\t" + my_losses + "\t" + this.app.wallet.returnPublicKey() + "\t" + this.game.players[this.game.state.dealer] + "\t" + (new Date().getTime()) + "\t" + "SAITO");            
            } else {
              for (let i = 0; i < this.game.state.player_winner.length; i++) {
                  if (this.game.state.player_winner[i] == 1) {
                      let gains = this.game.state.player_wager[i] * this.game.state.player_payout[i];
                  this.game.queue.push("PAY" + "\t" + my_losses + "\t" + this.app.wallet.returnPublicKey() + "\t" + this.game.players[i] + "\t" + (new Date().getTime()) + "\t" + "SAITO");            
                  }
              }
            }
          }
        }

        return 1;
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





  playerTurn() {

    let blackjack_self = this;

    this.displayBoard();
    this.pickWinner();

    let array_of_cards = [];
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      let tmpr = this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
      let tmpr2 = tmpr.split(".");
      array_of_cards.push(tmpr2[0]);
    }
    my_total = this.scoreArrayOfCards(array_of_cards);

    if (my_total > 21) {

      let html = "";
      html += '<div class="menu-player">You have gone bust</div>';
      html += '<ul>';
      html += '<li class="menu_option" id="bust">confirm</li>';
      html += '</ul>';
    
      this.updateStatus(html, 1);

    } else {

      let html = "";
      if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
        html += '<div class="menu-player">You are the dealer. Casino rules suggest hitting until 17:';
      } else {
        html += '<div class="menu-player">Your move ';
      }
      html += '</div>';
      html += '<ul>';

      html += '<li class="menu_option" id="hit">hit</li>';
      html += '<li class="menu_option" id="stand">stand</li>';
      html += '</ul>';
    
      this.updateStatus(html, 1);

    }

    this.lockInterface();

    $('.menu_option').off();
    $('.menu_option').on('click', function () {

      $('.menu_option').off();
      blackjack_self.unlockInterface();
      let choice = $(this).attr("id");

      if (choice === "hit") {
        blackjack_self.addMove("hit\t" + blackjack_self.game.player);
        if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
          blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
        } 
        blackjack_self.endTurn();
        return 0;
      }

      if (choice === "bust") {
        blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("bust\t" + blackjack_self.game.player);
        if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
          blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
        } 
        blackjack_self.endTurn();
        return 0;
      }

      if (choice === "stand") {
        blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("stand\t" + blackjack_self.game.player);
        if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
          blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
        } 
        blackjack_self.endTurn();
        return 0;
      }
    });
  }




  displayBoard() {

    if (this.browser_active == 0) { return; }

    try {
      this.displayPlayers();
      this.displayHand();
    } catch (err) {
      console.log("err: " + err);
    }

  }



  returnState(num_of_players) {

    let state = {};

    state.round = 0;
    state.turn = 0;
    state.player_names = [];
    state.player_credit = [];
    state.player_wager = [];
    state.player_payout = [];
    state.player_hands = [];
    state.player_total = [];
    state.player_winner = [];
    state.dealer = 1;                // player 1 starts as the dealer


    for (let i = 0; i < num_of_players; i++) {
      state.player_credit[i] = 1000;
      if (this.game.options.stake != undefined) { state.player_credit[i] = parseInt(this.game.options.stake); }
      state.player_names[i] = this.app.keys.returnIdentifierByPublicKey(this.game.players[i], 1);
      if (state.player_names[i].indexOf("@") > 0) {
        state.player_names[i] = state.player_names[i].substring(0, state.player_names[i].indexOf("@"));
      }
      if (state.player_names[i] === this.game.players[i]) {
        state.player_names[i] = this.game.players[i].substring(0, 10) + "...";
      }
    }

    return state;

  }




  returnCardFromDeck(idx) {

    let deck = this.returnDeck();
    let card = deck[idx];

    return card.name.substring(0, card.name.indexOf('.'));

  }

  returnDeck() {

    var deck = {};

    deck['1'] = { name: "S1.png" }
    deck['2'] = { name: "S2.png" }
    deck['3'] = { name: "S3.png" }
    deck['4'] = { name: "S4.png" }
    deck['5'] = { name: "S5.png" }
    deck['6'] = { name: "S6.png" }
    deck['7'] = { name: "S7.png" }
    deck['8'] = { name: "S8.png" }
    deck['9'] = { name: "S9.png" }
    deck['10'] = { name: "S10.png" }
    deck['11'] = { name: "S11.png" }
    deck['12'] = { name: "S12.png" }
    deck['13'] = { name: "S13.png" }
    deck['14'] = { name: "C1.png" }
    deck['15'] = { name: "C2.png" }
    deck['16'] = { name: "C3.png" }
    deck['17'] = { name: "C4.png" }
    deck['18'] = { name: "C5.png" }
    deck['19'] = { name: "C6.png" }
    deck['20'] = { name: "C7.png" }
    deck['21'] = { name: "C8.png" }
    deck['22'] = { name: "C9.png" }
    deck['23'] = { name: "C10.png" }
    deck['24'] = { name: "C11.png" }
    deck['25'] = { name: "C12.png" }
    deck['26'] = { name: "C13.png" }
    deck['27'] = { name: "H1.png" }
    deck['28'] = { name: "H2.png" }
    deck['29'] = { name: "H3.png" }
    deck['30'] = { name: "H4.png" }
    deck['31'] = { name: "H5.png" }
    deck['32'] = { name: "H6.png" }
    deck['33'] = { name: "H7.png" }
    deck['34'] = { name: "H8.png" }
    deck['35'] = { name: "H9.png" }
    deck['36'] = { name: "H10.png" }
    deck['37'] = { name: "H11.png" }
    deck['38'] = { name: "H12.png" }
    deck['39'] = { name: "H13.png" }
    deck['40'] = { name: "D1.png" }
    deck['41'] = { name: "D2.png" }
    deck['42'] = { name: "D3.png" }
    deck['43'] = { name: "D4.png" }
    deck['44'] = { name: "D5.png" }
    deck['45'] = { name: "D6.png" }
    deck['46'] = { name: "D7.png" }
    deck['47'] = { name: "D8.png" }
    deck['48'] = { name: "D9.png" }
    deck['49'] = { name: "D10.png" }
    deck['50'] = { name: "D11.png" }
    deck['51'] = { name: "D12.png" }
    deck['52'] = { name: "D13.png" }

    return deck;

  }




  updatePlayerLog(player, msg) {

    let divname = "#player-info-log-" + (player);
    let logobj = document.querySelector(divname);
    if (logobj) {
      logobj.innerHTML = msg;
    }

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

  displayPlayers() {

    if (this.browser_active == 0) { return; }

    let player_box = "";

    var prank = "";
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

console.log("YES");

    for (let i = 0; i < this.game.players.length; i++) {

console.log(i);

      let seat = i - prank;
      if (seat < 0) { seat += this.game.players.length }

      let player_box_num = player_box[seat];
      let divname = "#player-info-" + player_box_num;
      let boxobj = document.querySelector(divname);
      let newhtml = '';
      let player_hand_shown = 0;

      if (this.game.state.player_hands.length > 0) {
        if (this.game.state.player_hands[i] != null) {
          if (this.game.state.player_hands[i].length > 0) {
            player_hand_shown = 1;
            newhtml = `<div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">`;
            if (this.game.state.player_hands[i] != null) {
              for (let z = 0; z < this.game.state.player_hands[i].length; z++) {
                let card = this.game.deck[0].cards[this.game.state.player_hands[i][z]];
                newhtml += `<img class="card" src="${this.card_img_dir}/${card.name}">`;
              }
              if (this.game.state.player_hands[i].length == 1 && this.game.state.dealer == ([i+1])) {
                    newhtml += `<img class="card" src="${this.card_img_dir}/red_back.png">`;
              }
            }
            
            newhtml += `
              </div>
              <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player_names[i]}</div>
              <div class="player-info-chips" id="player-info-chips-${i + 1}">${this.game.state.player_credit[i]} SAITO</div> 
           `;
          }
        }
      }
      if (player_hand_shown == 0) {
console.log("is the player hand shown?");
        newhtml = `
          <div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">
            <img class="card" src="${this.card_img_dir}/red_back.png">
            <img class="card" src="${this.card_img_dir}/red_back.png">
          </div>
          <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player_names[i]}</div>
          <div class="player-info-chips" id="player-info-chips-${i + 1}">${this.game.state.player_credit[i]} SAITO</div> 
        `;
console.log("this is my hand");
          let cardfan_backs = `
              <img class="card" src="${this.card_img_dir}/red_back.png">
              <img class="card" src="${this.card_img_dir}/red_back.png">
          `;
          this.cardfan.render(this.app, this, cardfan_backs);
          this.cardfan.attachEvents(this.app, this);

      }

      boxobj.querySelector(".info").innerHTML = newhtml;

      /*
      if (boxobj.querySelector(".plog").innerHTML == "") {
        boxobj.querySelector(".plog").innerHTML += `<div class="player-info-log" id="player-info-log-${i + 1}"></div>`;
      }
      */
      if (this.game.state.dealer == (i+1)) {
        boxobj.querySelector(".plog").innerHTML = `<div class="dealer-notice">DEALER</div>`;
      }

    }
  }


  displayHand() {
    this.cardfan.render(this.app, this);
    this.cardfan.attachEvents(this.app, this);
  }




  addMove(mv) {
    this.moves.push(mv);
  }





  endTurn(nextTarget = 0) {

    $(".menu_option").off();

    let extra = {};
    extra.target = this.returnNextPlayer(this.game.player);

    if (nextTarget != 0) { extra.target = nextTarget; }
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  }





  scoreArrayOfCards(array_of_cards) {

    let total = 0;
    let aces = 0;

console.log("starting");
    for (let i = 0; i < array_of_cards.length; i++) {
      let card = array_of_cards[i];
console.log("CARD: " + card);
      if (card[1] === '1' && card.length == 2) {
          total += parseInt(1);
          aces++;
      } else {
        let card_total = parseInt(card.substring(1));
        if ((card_total+total) == 11 && aces == 1) {
console.log("score is: " + 21);
          return 21;
        }
        if (card_total > 10) { card_total = 10; }
        total += parseInt(card_total);
      }
    }

    for (let z = 0; z < aces; z++) {
      if ((total+10) <= 21) { total += 10; }
    }

console.log("score is: " + total);

    return total;
  }


  pickWinner() {

    //
    // score players
    //
    this.game.state.player_total = [];
    for (let i = 0; i < this.game.state.player_hands.length; i++) {
      let array_of_cards = [];
      if (this.game.state.player_hands[i] != null) {
        for (let ii = 0; ii < this.game.state.player_hands[i].length; ii++) {
         // array_of_cards.push(this.game.state.player_hands[i][ii]);
          let tmpr = this.game.deck[0].cards[this.game.state.player_hands[i][ii]].name;
          let tmpr2 = tmpr.split(".");
          array_of_cards.push(tmpr2[0]);
        };
      }
      let handscore = this.scoreArrayOfCards(array_of_cards);
      this.game.state.player_total.push(handscore);
      if (this.game.state.player_total[i] == 21 && this.game.state.player_total.length == 2) {
        this.game.state.player_payout[i] = 1.5;
      }
    }

    let max_score = 0;
    for (let i = 0; i < this.game.state.player_total.length; i++) {
      if (this.game.state.player_total[i] > max_score && this.game.state.player_total[i] <= 21) {
        max_score = this.game.state.player_total[i];
      }
    }
    for (let i = 0; i < this.game.state.player_total.length; i++) {
      if (this.game.state.player_total[i] == max_score) {
        this.game.state.player_winner[i] = 1;
      } else {
        this.game.state.player_winner[i] = 0;
      }
    }

    return 1;
  }



  returnGameOptionsHTML() {

    return `
      <label for="stake">Initial Stake:</label>
      <select name="stake">
              <option value="1000" selected="selected">1000</option>
              <option value="5000" >5000</option>
              <option value="10000">10000</option>
      </select>

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


  updateStatus(str, hide_info=0) {

    try {
    if (hide_info == 0) {
      document.querySelector(".p1 > .info").style.display = "block";
    } else {
      document.querySelector(".p1 > .info").style.display = "none";
    }

    if (this.lock_interface == 1) { return; }

    this.game.status = str;

    if (this.browser_active == 1) {
      let status_obj = document.querySelector(".status");
      if (this.game.players.includes(this.app.wallet.returnPublicKey())) {
        status_obj.innerHTML = str;
      }
    }
    } catch (err) { 
console.log("ERR: " + err);
    }

  }




}

module.exports = Blackjack;

