const saito = require('../../lib/saito/saito');
const util = require('util');
const GameHud = require('../../lib/templates/lib/game-hud/game-hud');
const GameTemplate = require('../../lib/templates/gametemplate');

const addHammerListeners = require('../../lib/helpers/hammer');



//
// Missile Envy is a bit messy
//
var is_this_missile_envy_noneventable = 0;

//
// allows cancellation of pick "pickagain"
//
var original_selected_card = null;







//////////////////
// CONSTRUCTOR  //
//////////////////
class Twilight extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name            = "Twilight";
    this.slug		         = "twilight";
    this.description     = `Twilight Struggle is a card-driven strategy game for two players, with its theme taken from the Cold War.
      One player plays the United States (US), and the other plays the Soviet Union (USSR).`;
    this.publisher_message = "GMT Games";

    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

    this.moves           = [];
    this.is_testing = 0;

    this.interface = 1;
    this.dont_show_confirm = 0;

    this.gameboardZoom  = 0.90;
    this.gameboardMobileZoom = 0.67;

    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.type       = "Strategy Boardgame";

    this.hud = new GameHud(this.app, this.menuItems());

  }



  menuItems() {
    return {
      'game-cards': {
        name: 'Cards',
        callback: this.handleCardsMenuItem.bind(this)
      },
      'game-lang': {
        name: 'Lang',
        callback: this.handleLangMenuItem.bind(this)
      },
      'game-player': {
        name: 'Players',
        callback: this.handlePlayerMenuItem.bind(this)
      },
    }
  }

  handleCardsMenuItem() {
    let twilight_self = this;
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          Select your deck:
        </div>
        <ul>
          <li class="card" id="hand">Hand</li>
          <li class="card" id="discards">Discard</li>
          <li class="card" id="removed">Removed</li>
        </ul>
      </div>
    `;

    $('.hud-menu-overlay').html(html);

    $('.card').on('click', function() {

      let player_action = $(this).attr("id");
      var deck = twilight_self.game.deck[0];
      var cards_img_html = [];
      var cards;

      switch (player_action) {
        case "hand":
          cards = deck.hand
          break;
        case "discards":
          cards = Object.keys(deck.discards)
          break;
        case "removed":
          cards = Object.keys(deck.removed)
          break;
        default:
          break;
      }

      let cards_in_pile = 0;

      cards_img_html = cards.map(card =>  {
        return `
          <div class="cardbox-hud" id="cardbox-hud-${cards_in_pile}">
            ${twilight_self.returnCardImage(card)}
          </div>`;
      });

      // for (var z in cards) {
      //   cards_in_pile++;
      //   if (cards[z] != undefined) {
      //     display_message += `<div class="cardbox-hud" id="cardbox-hud-${cards_in_pile}">${twilight_self.returnCardImage(cards[z])}</div>`
      //   }
      // }

      let display_message = `<div class="display-cards">${cards_img_html.join('')}</div>`;

      if (cards_img_html.length == 0) {
        display_message = `
          <div style="text-align:center; margin: auto;">
            There are no cards in ${player_action}
          </div>
        `;
      }

      $('.hud-menu-overlay').html(display_message);
    });

  }

  handleLangMenuItem() {

    let twilight_self = this;
    let user_message = `
      <div id="menu-container">
        <h3>Select Language:</h3>
        <ul>
          <li class="card" id="english">English</li>
          <li class="card" id="chinese">简体中文</li>
        </ul>
      </div>`;

    $('.hud-menu-overlay').html(user_message);

    // leave action enabled on other panels
    //$('.card').off();
    $('.card').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 === "english") {
        // twilight_self.displayModal("Card settings changed to English");
        twilight_self.displayModal("Language Settings", "Card settings changed to English");
        twilight_self.lang = "en";
        twilight_self.saveGamePreference("lang", "en");
      }
      if (action2 === "chinese") {
        // twilight_self.displayModal("卡牌语言改成简体中文");
        twilight_self.displayModal("语言设定", "卡牌语言改成简体中文");
        twilight_self.lang = "zh";
        twilight_self.saveGamePreference("lang", "zh");
      }

    });
  }

  async handlePlayerMenuItem() {
    // let opponent = await this.app.dns.fetchIdentifierPromise(this.game.opponents[0]);

    // let's use the address controller for this in the future;
    let opponent = this.game.opponents[0];

    if (this.app.crypto.isPublicKey(opponent)) {
      opponent = opponent.substring(0, 16);
    }

    let user_message = `
      <div id="menu-container">
        Opponent: ${opponent}
      </div>
    `;

    $('.hud-menu-overlay').html(user_message);
  }

  handleLogMenuItem() {
    //
    // we explicitly add this in the mobile version
    //
    $('.hud-menu-overlay').html(`<div style="padding: 0.5em">${$('.log').html()}</div>`);
    twilight_self.addLogCardEvents();
  }



  ////////////////
  // initialize //
  ////////////////
  initializeGame(game_id) {

  //
  // enable chat
  //
  //if (this.browser_active == 1) {
  //  if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
  //    const chat = this.app.modules.returnModule("Chat");
  //    chat.addPopUpChat();
  //  }
  //}

  //
  // check user preferences to update interface, if text
  //
  if (this.app.options != undefined) {
    if (this.app.options.gameprefs != undefined) {
      if (this.app.options.gameprefs.interface == 0) {
        this.interface = 0;
      }
      if (this.app.options.gameprefs.dont_show_confirm == 1) {
        this.dont_show_confirm = 1;
      }
    }
  }


  if (this.game.status != "") { this.updateStatus(this.game.status); }


  //
  // initialize
  //
  if (this.game.countries == undefined) {
    this.game.countries = this.returnCountries();
  }
  if (this.game.state == undefined) {
    this.game.state = this.returnState();
  }
  if (this.game.deck.length == 0) {

console.log("\n\n\n\n");
console.log("---------------------------");
console.log("---------------------------");
console.log("------ INITIALIZE GAME ----");
console.log("---------------------------");
console.log("---------------------------");
console.log("---------------------------");
console.log("\n\n\n\n");

    this.updateStatus("Generating the Game");

    this.game.queue.push("round");
    if (this.game.options.usbonus != undefined) {
      if (this.game.options.usbonus > 0) {
        this.game.queue.push("placement_bonus\t2\t"+this.game.options.usbonus);
      }
    }
    this.game.queue.push("placement\t2");
    this.game.queue.push("placement\t1");
    this.game.queue.push("READY");
    this.game.queue.push("DEAL\t1\t2\t8");
    this.game.queue.push("DEAL\t1\t1\t8");
    this.game.queue.push("DECKENCRYPT\t1\t2");
    this.game.queue.push("DECKENCRYPT\t1\t1");
    this.game.queue.push("DECKXOR\t1\t2");
    this.game.queue.push("DECKXOR\t1\t1");

    //
    // TESTING
    //
    if (this.is_testing == 1) {

      this.game.options = {};
      this.game.options.culturaldiplomacy = 1;
      this.game.options.gouzenkoaffair = 1;
      this.game.options.berlinagreement = 1;
      this.game.options.handshake = 1;
      this.game.options.rustinredsquare = 1;

      let a = this.returnEarlyWarCards();
      let b = this.returnMidWarCards();
      let c = this.returnLateWarCards();
      let d = Object.assign({}, a, b);
      let e = Object.assign({}, d, c);
      console.log("CARDS: " + JSON.stringify(e));
      this.game.queue.push("DECK\t1\t"+JSON.stringify(e));
    } else {
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnEarlyWarCards()));
    }
    this.game.queue.push("init");

    if (this.game.dice === "") {
      this.initializeDice();
    }

  }

  this.countries = this.game.countries;

  // this.hud = new GameHud(this.app, 0, 0, this.menuItems());
  // this.hud.render(this.app, this.game);
  // this.hud.attachEvents(this.app, this.game);

  //
  // adjust screen ratio
  //
  $('.country').css('width', this.scale(202)+"px");
  $('.us').css('width', this.scale(100)+"px");
  $('.ussr').css('width', this.scale(100)+"px");
  $('.us').css('height', this.scale(100)+"px");
  $('.ussr').css('height', this.scale(100)+"px");

  //
  $('.formosan_resolution').css('width', this.scale(202)+"px");
  $('.formosan_resolution').css('height', this.scale(132)+"px");
  $('.formosan_resolution').css('top', this.scale(this.countries['taiwan'].top-32)+"px");
  $('.formosan_resolution').css('left', this.scale(this.countries['taiwan'].left)+"px");

  //
  // update defcon and milops and stuff
  //
  this.updateDefcon();
  this.updateActionRound();
  this.updateSpaceRace();
  this.updateVictoryPoints();
  this.updateMilitaryOperations();
  this.updateRound();

  //
  // initialize interface
  //
  for (var i in this.countries) {

    let divname      = '#'+i;
    let divname_us   = divname + " > .us > img";
    let divname_ussr = divname + " > .ussr > img";

    let us_i   = 0;
    let ussr_i = 0;

    $(divname).css('top', this.scale(this.countries[i].top)+"px");
    $(divname).css('left', this.scale(this.countries[i].left)+"px");
    $(divname_us).css('height', this.scale(100)+"px");
    $(divname_ussr).css('height', this.scale(100)+"px");

    if (this.countries[i].us > 0) { this.showInfluence(i, "us"); }
    if (this.countries[i].ussr > 0) { this.showInfluence(i, "ussr"); }
  }

  var element = document.getElementById('gameboard');
  // if (element !== null) { addHammerListeners(element); }


/*****
  let twilight_self = this;
  $('.scoring_card').off();
  $('.scoring_card')
    .mouseover(function() {

      let region = this.id;
      let scoring = twilight_self.calculateScoring(region);
      let total_vp = scoring.us.vp - scoring.ussr.vp;
      let vp_color = "white";

      if (total_vp > 0) { vp_color = "blue" }
      if (total_vp < 0) { vp_color = "red" }
      if (total_vp > 20 || total_vp < -20) { total_vp = "WIN" }

      $(`.display_card#${region}`).show();
      $(`.display_vp#${region}`).html(
        `VP: <div style="color:${vp_color}">&nbsp${total_vp}</div>`
      );
    })
    .mouseout(function() {
      let region = this.id;
      $(`.display_card#${region}`).hide();
    })
*****/

}





  //
  // Core Game Logic
  //
  handleGameLoop(msg=null) {

    let twilight_self = this;
    let player = "ussr"; if (this.game.player == 2) { player = "us"; }

    //
    // support observer mode
    //
    if (this.game.player == 0) { player = "observer"; }


    if (this.game.over == 1) {
      let winner = "ussr";
      if (this.game.winner == 2) { winner = "us"; }
      let gid = $('#sage_game_id').attr("class");
      if (gid === this.game.id) {
        this.updateStatus("<span>Game Over:</span> "+winner.toUpperCase() + "</span> <span>wins</span>");
      }
      return 0;
    }

    //this.game.state.opponent_cards_in_hand = msg.extra.cards_in_hand;



    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

  console.log("QUEUE: " + JSON.stringify(this.game.queue));

        let qe = this.game.queue.length-1;
        let mv = this.game.queue[qe].split("\t");
        let shd_continue = 1;

        //
        // cambridge region
        // chernobyl region
        // grainsales sender card
        // missileenvy sender card
        // latinamericandebtcrisis (if USSR can double)
        // che ussr country_of_target1
        //
        // start round
        // flush [discards] // empty discards pile if exists
        // placement (initial placement)
        // ops [us/ussr] card num
        // round
        // move [us/ussr]
        // turn [us/ussr]
        // event [us/ussr] card
        // remove [us/ussr] [us/ussr] countryname influence     // player moving, then player whose ops to remove
        // place [us/ussr] [us/ussr] countryname influence      // player moving, then player whose ops to remove
        // resolve card
        // space [us/ussr] card
        // defcon [lower/raise]
        // notify [msg]
        // coup [us/ussr] countryname influence
        // realign [us/ussr] countryname
        // card [us/ussr] card  --> hand card to play
        // vp [us/ussr] points [delay_settlement_until_end_of_turn=1]
        // discard [us/ussr] card --> discard from hand
        // discard [ussr/us] card
        // deal [1/2]  --- player decides how many cards they need, adds DEAL and clears when ready
        // init
        //
        if (mv[0] == "init") {

          //
          // OPTIONAL - players pick sides
          //
	  // HACK
//
          let tmpar = this.game.players[0];
          if (this.game.options.player1 != undefined) {

            //
            // random pick
            //
            if (this.game.options.player1 == "random") {
              let roll = this.rollDice(6);
              if (roll <= 3) {
                this.game.options.player1 = "us";
              } else {
                this.game.options.player1 = "ussr";
              }
            }

            if (this.game.players[0] === this.app.wallet.returnPublicKey()) {
              if (this.game.options.player1 == "us") {
                this.game.player = 2;
              } else {
                this.game.player = 1;
              }
            } else {
              if (this.game.options.player1 == "us") {
                this.game.player = 1;
              } else {
                this.game.player = 2;
              }
            }
          }

          this.game.queue.splice(qe, 1);

        }
        if (mv[0] === "turn") {
          this.game.state.turn_in_round++;
          this.game.state.events.china_card_eligible = 0;
          this.game.queue.splice(qe, 1);
          this.updateActionRound();
        }
        if (mv[0] === "discard") {
          if (mv[2] === "china") {
            //
            // china card switches hands
            //
            if (mv[1] == "ussr") {
              this.updateLog("China Card passes to US face down");
              this.game.state.events.china_card = 2;
            }
            if (mv[1] == "us") {
              this.updateLog("China Card passes to USSR face down");
              this.game.state.events.china_card = 1;
            }
          } else {

      //
      // remove from hand if present
      //
      this.removeCardFromHand(mv[2]);

      //
      // missile envy is an exception, non-player triggers
      //
      if (mv[2] == "missileenvy" && this.game.state.events.missile_envy != this.game.player) {
        this.game.state.events.missile_envy = 0;
        this.game.state.events.missileenvy = 0;
      }

            for (var i in this.game.deck[0].cards) {
              if (mv[2] == i) {
                if (this.game.deck[0].cards[mv[2]] != undefined) {
                  //
                  // move to discard pile
                  //
                  this.updateLog("<span>" + mv[1].toUpperCase() + " discards</span> <span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.deck[0].cards[mv[2]].name + "</span>");
                  //
                  // discard pile is parallel to normal
                  //
                  this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
                }
              }
            }
          }
          this.game.queue.splice(qe, 1);
        }
        //
        // wargames
        //
        if (mv[0] == "wargames") {

          let player = mv[1];
          let activate = parseInt(mv[2]);

          if (activate == 0) {

            //
            // card is discarded, nothing happens
            //

          } else {

            if (player == "us") {
              this.game.state.vp -= 6;
              this.updateVictoryPoints();
              if (this.game.state.vp > 0) {
                  this.endGame("us","Wargames");
              }
              if (this.game.state.vp < 0) {
                  this.endGame("ussr","Wargames");
              }
              if (this.game.state.vp == 0) {
                this.endGame("ussr","Wargames");
              }
            } else {
              this.game.state.vp += 6;
              this.updateVictoryPoints();
              if (this.game.state.vp > 0) {
                  this.endGame("us","Wargames");
              }
              if (this.game.state.vp < 0) {
                this.endGame("ussr","Wargames");
              }
              if (this.game.state.vp == 0) {
                this.endGame("us","Wargames");
              }
            }

          }

          this.game.queue.splice(qe, 1);
        }



        //
        // grainsales
        //
        if (mv[0] === "grainsales") {

          //
          // this is the ussr telling the
          // us what card they can choose
          //
          if (mv[1] == "ussr") {

            // remove the command triggering this
            this.game.queue.splice(qe, 1);

            if (this.game.player == 2) {

              let html  = "<span>Grain Sales pulls</span> <span class=\"showcard\" id=\""+mv[2]+"\">" + this.game.deck[0].cards[mv[2]].name + "</span> <span>from USSR. Do you want to play this card?</span>";
              if (mv[2] == "unintervention" && this.game.state.headline == 1) {} else {
                  html += '<ul><li class="card" id="play">play card</li>';
              }
                  html += '<li class="card" id="nope">return card</li>';
                  html += '</ul>';
              this.updateStatus(html);

              let twilight_self = this;

              twilight_self.addShowCardEvents(function(card) {
                let action2 = $(card).attr("id");
                if (action2 == "play") {
                  // trigger play of selected card
                  twilight_self.addMove("resolve\tgrainsales");
                  twilight_self.playerTurn(mv[2]);
                }
                if (action2 == "nope") {
                  twilight_self.addMove("resolve\tgrainsales");
                  twilight_self.addMove("ops\tus\tgrainsales\t2");
                  twilight_self.addMove("grainsales\tus\t"+mv[2]);
                  twilight_self.endTurn();
                }
              });

            }
            shd_continue = 0;
          }

          //
          // this is the us telling the
          // ussr they are returning a
          // card
          //
          if (mv[1] == "us") {

            if (this.game.player == 1) {
              this.game.deck[0].hand.push(mv[2]);
            }

            this.game.queue.splice(qe, 1);
            shd_continue = 1;
          }
        }
        //
        // Stage
        //
        if (mv[0] == "stage") {
          this.game.queue.splice(qe, 1);
    shd_continue = 1;
        }
        //
        // Che
        //
        if (mv[0] == "checoup") {

          let target1 = mv[2];
          let original_us = this.countries[mv[2]].us;
          let twilight_self = this;
          let couppower = mv[3];

          //
          // this is the first coup, which runs on both
          // computers, so they can collectively see the
          // results.
          //
          twilight_self.playCoup("ussr", mv[2], couppower, function() {
            if (twilight_self.countries[mv[2]].us < original_us) {

              let valid_targets = 0;
              for (var i in twilight_self.countries) {
                let countryname = i;
                if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
                  if (countryname !== target1) {
                    valid_targets++;
                  }
                }
              }

              if (valid_targets == 0) {
                twilight_self.updateLog("No valid targets for Che");
                twilight_self.game.queue.splice(qe, 1);
                shd_continue = 1;
                  } else {

                if (twilight_self.game.player == 1) {

                  twilight_self.addMove("resolve\tchecoup");
                  twilight_self.updateStatus("Pick second target for coup:");
                  twilight_self.playerFinishedPlacingInfluence();

                  let user_message = "Che takes effect. Pick first target for coup:<p></p><ul>";
                      user_message += '<li class="card" id="skipche">or skip coup</li>';
                      user_message += '</ul>';
                  twilight_self.updateStatus(user_message);

                  $('.card').off();
                  $('.card').on('click', function() {
                    let action2 = $(this).attr("id");
                    if (action2 == "skipche") {
                      twilight_self.updateStatus("Skipping Che coups...");
                      twilight_self.addMove("resolve\tchecoup");
                      twilight_self.endTurn();
                    }
                  });


                  for (var i in twilight_self.countries) {
                    let countryname  = i;
                    let divname      = '#'+i;
                    if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && countryname !== target1 && twilight_self.countries[countryname].us > 0) {
                      $(divname).off();
                      $(divname).on('click', function() {
                        let c = $(this).attr('id');
                        twilight_self.addMove("coup\tussr\t"+c+"\t"+couppower);
                        twilight_self.endTurn();
                      });
                    } else {
                      $(divname).off();
                      $(divname).on('click', function() {
                        // twilight_self.displayModal("Invalid Target");
                        twilight_self.displayModal("Invalid Target");
                      });
                    }
                  }
                }

                //
                // ussr will tell us who to coup next
                //
                twilight_self.game.queue.splice(qe, 1);
                shd_continue = 0;

              }


            } else {
              //
              // done
              //
              twilight_self.game.queue.splice(qe, 1);
              shd_continue = 1;
            }

          });

        }
        //
        // missileenvy \t sender \t card
        //
        if (mv[0] === "missileenvy") {

          let sender = mv[1];
          let card = mv[2];
          let receiver = "us";
          let discarder = "ussr";
          if (sender == 2) { receiver = "ussr"; discarder = "us"; }

          this.game.state.events.missile_envy = sender;

          let opponent_card = 0;
          if (this.game.deck[0].cards[card].player == "us" && sender == 2) { opponent_card = 1; }
          if (this.game.deck[0].cards[card].player == "ussr" && sender == 1) { opponent_card = 1; }

          // remove missileenvy from queue
          this.game.queue.splice(qe, 1);

          //
          // play for ops
          //
          if (opponent_card == 1) {
            this.game.queue.push("discard\t"+discarder+"\t"+card);
            this.game.queue.push("ops\t"+receiver+"\t"+card+"\t"+this.game.deck[0].cards[card].ops);
            this.game.queue.push("notify\t"+discarder.toUpperCase() + " offers " + this.game.deck[0].cards[card].name + " for OPS");
          }

          //
          // or play for event
          //
          if (opponent_card == 0) {
            this.game.queue.push("discard\t"+discarder+"\t"+card);
            this.game.queue.push("event\t"+receiver+"\t"+card);
            this.game.queue.push("notify\t"+discarder.toUpperCase() + " offers " + this.game.deck[0].cards[card].name + " for EVENT");
          }

          //
          // remove card from hand
          //
          if (this.game.player == sender) {
            this.removeCardFromHand(card);
          }

          shd_continue = 1;

        }
        //
        // quagmire ussr/us card
        //
        if (mv[0] === "quagmire") {

          let roll = this.rollDice(6);

          this.updateLog(mv[1].toUpperCase() + " </span>rolls a<span> " + roll);

          if (roll < 5) {

            if (mv[1] == "ussr") {
              this.game.state.events.beartrap = 0;
                this.updateLog("Bear Trap ends");
            }
            if (mv[1] == "us") {
              this.game.state.events.quagmire = 0;
                this.updateLog("Quagmire ends");
            }

          } else {
            if (mv[1] == "ussr") {
                this.updateLog("Bear Trap continues...");
            }
            if (mv[1] == "us") {
                this.updateLog("Quagmire continues...");
            }
          }

          this.game.queue.splice(qe, 1);
          shd_continue = 1;

        }
        //
        // tehran
        //
        if (mv[0] == "tehran") {

          let twilight_self = this;
          let sender  = mv[1];
          let keysnum = mv[2];
          this.game.queue.splice(qe, 1);

          if (sender == "ussr") {

            //
            // ussr has sent keys to decrypt
            //
            if (this.game.player == 1) {

              for (let i = 0; i < keysnum; i++) { this.game.queue.splice(this.game.queue.length-1, 1); }
              shd_continue = 0;

            } else {

              //
              // us decrypts and decides what to toss
              //
              var cardoptions = [];
              var pos_to_discard = [];

              for (let i = 0; i < keysnum; i++) {
                cardoptions[i] = this.game.deck[0].crypt[i];
                cardoptions[i] = this.app.crypto.decodeXOR(cardoptions[i], this.game.deck[0].keys[i]);
              }
              for (let i = 0; i < keysnum; i++) {
                cardoptions[i] = this.app.crypto.decodeXOR(cardoptions[i], this.game.queue[this.game.queue.length-keysnum+i]);
                cardoptions[i] = this.app.crypto.hexToString(cardoptions[i]);
              }
              for (let i = 0; i < keysnum; i++) {
                this.game.queue.splice(this.game.queue.length-1, 1);
              }

              let user_message = "Select cards to discard:<p></p><ul>";
              for (let i = 0; i < cardoptions.length; i++) {
                user_message += '<li class="card" id="'+this.game.deck[0].crypt[i]+'_'+cardoptions[i]+'">'+this.game.deck[0].cards[cardoptions[i]].name+'</li>';
              }
              user_message += '</ul><p></p>When you are done discarding <span class="card dashed" id="finished">click here</span>.';
              twilight_self.updateStatus(user_message);

              //
              // cardoptions is in proper order
              //
              let cards_discarded = 0;

              $('.card').off();
              $('.card').on('click', function() {

                let action2 = $(this).attr("id");

                if (action2 == "finished") {

                  for (let i = 0; i < pos_to_discard.length; i++) { twilight_self.addMove(pos_to_discard[i]); }
                  twilight_self.addMove("tehran\tus\t"+cards_discarded);
                  twilight_self.endTurn();

                } else {

                  let tmpar = action2.split("_");

                      if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
                    twilight_self.mobileCardSelect(card, player, function() {

                      $(this).hide();
                      pos_to_discard.push(tmpar[0]);
                      cards_discarded++;
                      twilight_self.addMove("discard\tus\t"+tmpar[1]);
                      twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+tmpar[1]+"\">"+twilight_self.game.deck[0].cards[tmpar[1]].name +"</span>");

                    }, "discard");
                    return 0;

                  } else {

                    $(this).hide();
                      pos_to_discard.push(tmpar[0]);
                    cards_discarded++;
                    twilight_self.addMove("discard\tus\t"+tmpar[1]);
                    twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+tmpar[1]+"\">"+twilight_self.game.deck[0].cards[tmpar[1]].name +"</span>");

                  }
                }
              });
            }

            shd_continue = 0;

          } else {

            //
            // us has sent keys to discard back
            //
            let removedcard = [];
            for (let i = 0; i < keysnum; i++) {
              removedcard[i] = this.game.queue[this.game.queue.length-1];
              this.game.queue.splice(this.game.queue.length-1, 1);
            }

            for (let i = 0; i < 5; i++) {
              if (removedcard.includes(this.game.deck[0].crypt[i])) {
                //
                // set cards to zero
                //
                this.game.deck[0].crypt[i] = "";
                this.game.deck[0].keys[i] = "";
              }
            }

            //
            // remove empty elements
            //
            var newcards = [];
            var newkeys  = [];
            for (let i = 0; i < this.game.deck[0].crypt.length; i++) {
              if (this.game.deck[0].crypt[i] != "") {
                newcards.push(this.game.deck[0].crypt[i]);
                newkeys.push(this.game.deck[0].keys[i]);
              }
            }

            //
            // keys and cards refreshed
            //
            this.game.deck[0].crypt = newcards;
            this.game.deck[0].keys = newkeys;

          }
        }

        //
        // limit [restriction] [region]
        //
        if (mv[0] == "limit") {
          if (mv[1] == "china") { this.game.state.events.china_card_in_play = 1; }
          if (mv[1] == "coups") { this.game.state.limit_coups = 1; }
          if (mv[1] == "spacerace") { this.game.state.limit_spacerace = 1; }
          if (mv[1] == "realignments") { this.game.state.limit_realignments = 1; }
          if (mv[1] == "placement") { this.game.state.limit_placement = 1; }
          if (mv[1] == "milops") { this.game.state.limit_milops = 1; }
          if (mv[1] == "ignoredefcon") { this.game.state.limit_ignoredefcon = 1; }
          if (mv[1] == "region") { this.game.state.limit_region += mv[2]; }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] == "flush") {

          if (mv[1] == "discards") {
            this.game.deck[0].discards = {};
          }
          this.game.queue.splice(qe, 1);

        }
        //
        // latinamericandebtcrisis
        //
        if (mv[0] == "latinamericandebtcrisis") {

          let twilight_self = this;


          if (this.game.player == 2) {
            this.game.queue.splice(qe, 1);
            return 0;
          }

          if (this.game.player == 1) {

            this.game.queue.splice(qe, 1);

            let countries_to_double = 0;
            for (var i in this.countries) {
              if (this.countries[i].region == "samerica") {
                if (this.countries[i].ussr > 0) { countries_to_double++; }
              }
            }
            if (countries_to_double > 2) { countries_to_double = 2; }
            if (countries_to_double == 0) {
              this.addMove("notify\tUSSR has no countries with influence to double");
              this.endTurn();
              return 0;
            }


            this.updateStatus("<span>Select</span> "+countries_to_double+" <span>countries in South America to double USSR influence</span>");

            //
            // double influence in two countries
            //
            for (var i in this.countries) {

              let countryname  = i;
              let divname      = '#'+i;

              if (this.countries[i].region == "samerica") {

                if (this.countries[i].ussr > 0 ) {
                  twilight_self.countries[countryname].place = 1;
                }

                $(divname).off();
                $(divname).on('click', function() {

                  let countryname = $(this).attr('id');

                  if (twilight_self.countries[countryname].place == 1) {
                    let ops_to_place = twilight_self.countries[countryname].ussr;
                    twilight_self.placeInfluence(countryname, ops_to_place, "ussr", function() {
                      twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t" + ops_to_place);
                        twilight_self.countries[countryname].place = 0;
                      countries_to_double--;
                      if (countries_to_double == 0) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      }
                    });
                  } else {
                    // twilight_self.displayModal("Invalid Target");
                    twilight_self.displayModal("InvalidTarget");
                  }
                });
              }
            }
          }
          return 0;
        }
        //
        // north sea oil bonus turn
        //
        if (mv[0] == "northsea") {
          if (this.game.player == 1) {
            let html  = "US determining whether to take extra turn";
            this.updateStatus(html);
          }
          if (this.game.player == 2) {
            let html  = "<span>Do you wish to take an extra turn:<span><p></p><ul>";
            html += '<li class="card" id="play">play turn</li>';
            html += '<li class="card" id="nope">no turn</li>';
            html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              if (action2 == "play") {
                  twilight_self.addMove("resolve\tnorthsea");
                  twilight_self.addMove("play\t2");
                  twilight_self.endTurn();
              }
              if (action2 == "nope") {
                  twilight_self.addMove("resolve\tnorthsea");
                  twilight_self.addMove("play\t2");
                  twilight_self.endTurn();
              }

            });
          }
          shd_continue = 0;
        }
        //
        // space race  us/ussr card
        //
        if (mv[0] == "space") {
          this.playerSpaceCard(mv[2], mv[1]);
          this.game.deck[0].discards[mv[2]] = this.game.deck[0].cards[mv[2]];
          this.game.queue.splice(qe, 1);
        }
        //
        // unlimit
        //
        if (mv[0] == "unlimit") {
          if (mv[1] == "china") { this.game.state.events_china_card_in_play = 0; }
          if (mv[1] == "cmc") { this.game.state.events.cubanmissilecrisis = 0; }
          if (mv[1] == "coups") { this.game.state.limit_coups = 0; }
          if (mv[1] == "spacerace") { this.game.state.limit_spacerace = 0; }
          if (mv[1] == "realignments") { this.game.state.limit_realignments = 0; }
          if (mv[1] == "placement") { this.game.state.limit_placement = 0; }
          if (mv[1] == "milops") { this.game.state.limit_milops = 0; }
          if (mv[1] == "ignoredefcon") { this.game.state.limit_ignoredefcon = 0; }
          if (mv[1] == "region") { this.game.state.limit_region = ""; }
          this.game.queue.splice(qe, 1);
        }
        //
        // chernobyl
        //
        if (mv[0] == "chernobyl") {
          this.game.state.events.chernobyl = mv[1];
          this.game.queue.splice(qe, 1);
        }
        //
        // burn die roll
        //
        if (mv[0] == "dice") {
          if (mv[1] == "burn") {
            if (this.game.player == 1 && mv[2] == "ussr") {
              roll = this.rollDice(6);
            }
            if (this.game.player == 2 && mv[2] == "us")   {
              roll = this.rollDice(6);
            }
          }
          this.game.queue.splice(qe, 1);
        }
        //
        // aldrich ames
        //
        if (mv[0] == "aldrichreveal") {

          if (this.game.player == 2) {

            let cards_to_reveal = this.game.deck[0].hand.length;
            let revealed = "";
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (i > 0) { revealed += ", "; }
              revealed += this.game.deck[0].hand[i];
            }
            this.addMove("notify\tUS hand contains: "+revealed);
            this.endTurn();
          }

          this.game.queue.splice(qe, 1);
          return 0;

        }
        if (mv[0] == "aldrich") {

          //
          // us telling ussr their hand
          //
          if (mv[1] == "us") {

            let num = mv[2];
            let html = "<span>Aldrich Ames triggered. USSR discard card from US hand:<span><p></p><ul>";
            this.game.queue.splice(qe, 1);

            for (let i = 0; i < num; i++) {
              let uscard = this.game.queue[this.game.queue.length-1];
              html += '<li class="card showcard" id="'+uscard+'">'+this.game.deck[0].cards[uscard].name+'</li>';
              this.game.queue.splice(this.game.queue.length-1, 1);
            }
            html += '</ul>';

            if (this.game.player == 2) {
              this.updateStatus("USSR is playing Aldrich Ames");
            }

            if (this.game.player == 1) {

              this.updateStatus(html);

              let twilight_self = this;

              twilight_self.addShowCardEvents(function(card) {
                let action2 = $(card).attr("id");
                twilight_self.addMove("aldrich\tussr\t"+action2);
                twilight_self.endTurn();
              });
            }

            shd_continue = 0;
          }


          if (mv[1] == "ussr") {

            if (this.game.player == 2) {
              this.removeCardFromHand(mv[2]);
            }

            this.game.queue.splice(qe, 1);
            this.updateLog("<span>USSR discards </span><span class=\"logcard\" id=\""+mv[2]+"\">"+this.game.deck[0].cards[mv[2]].name + "</span>");
            shd_continue = 1;
          }

        }
        //
        // cambridge five
        //
        if (mv[0] === "cambridge") {
          if (this.game.player == 1) {
            let placetxt = player.toUpperCase() + " place 1 OP in";
            for (let b = 1; b < mv.length; b++) {
              placetxt += " ";
              placetxt += mv[b];
            }
            twilight_self.updateStatus(placetxt);
            for (let i = 1; i < mv.length; i++) {
              for (var k in this.countries) {

                //
                // names of cards differ for these two. update so region matches
                //
                if (mv[i] == "centralamerica") { mv[i] = "camerica"; }
                if (mv[i] == "southamerica") { mv[i] = "samerica"; }

                if (this.countries[k].region.indexOf(mv[i]) > -1) {
                  let divname = "#"+k;
                  $(divname).off();
                  $(divname).on('click',function() {
                    let countryname = $(this).attr('id');
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.countries[countryname].ussr += 1;
                    twilight_self.showInfluence(countryname, "ussr");
                    twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                    twilight_self.endTurn();
                  });
                }
              }
            }
          }
          this.game.queue.splice(qe, 1);
          shd_continue = 0;
        }
        //
        // tear down this wall
        //
        if (mv[0] === "teardownthiswall") {

          if (this.game.player == 1) {
            this.updateStatus("US playing Tear Down This Wall");
            return 0;
          }

          let user_message = "<span>Tear Down this Wall is played -- US may make 3 OP free Coup Attempt or Realignments in Europe.</span><p></p><ul>";
              user_message += '<li class="card" id="taketear"><span>make coup or realign</span></li>';
              user_message += '<li class="card" id="skiptear"><span>skip coup</span></li>';
              user_message += '</ul>';
          twilight_self.updateStatus(user_message);


          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

              if (action2 == "skiptear") {
              twilight_self.updateStatus("<span>Skipping Tear Down this Wall...</span>");
              twilight_self.addMove("resolve\tteardownthiswall");
              twilight_self.endTurn();
            }

              if (action2 == "taketear") {
              twilight_self.addMove("resolve\tteardownthiswall");
              twilight_self.addMove("unlimit\tignoredefcon");
              twilight_self.addMove("unlimit\tregion");
              twilight_self.addMove("unlimit\tplacement");
              twilight_self.addMove("unlimit\tmilops");
              twilight_self.addMove("ops\tus\tteardown\t3");
              twilight_self.addMove("limit\tmilops");
              twilight_self.addMove("limit\tplacement");
              twilight_self.addMove("limit\tregion\tasia");
              twilight_self.addMove("limit\tregion\tmideast");
              twilight_self.addMove("limit\tregion\tsamerica");
              twilight_self.addMove("limit\tregion\tcamerica");
              twilight_self.addMove("limit\tregion\tafrica");
              twilight_self.addMove("limit\tignoredefcon");
              twilight_self.endTurn();
            }

          });

          shd_continue = 0;

        }
        if (mv[0] === "deal") {
          if (this.game.player == mv[1]) {

            let cards_needed_per_player = 8;
            if (this.game.state.round >= 4) { cards_needed_per_player = 9; }

            let ussr_cards = this.game.deck[0].hand.length;
            for (let z = 0; z < this.game.deck[0].hand.length; z++) {
              if (this.game.deck[0].hand[z] == "china") {
                ussr_cards--;
              }
            }
            let us_cards   = this.game.state.opponent_cards_in_hand;

            if (this.game.player == 2) {
              let x = ussr_cards;
              ussr_cards = us_cards;
              us_cards = x;
            }

            let us_cards_needed = cards_needed_per_player - us_cards;
            let ussr_cards_needed = cards_needed_per_player - ussr_cards;
            reshuffle_limit = us_cards_needed + ussr_cards_needed;

  console.log("\n\n\n-------debugging-------");
  console.log("CARDS IN MY DECK: " + this.game.deck[0].hand.length);
  console.log("US cards needed: " + us_cards_needed);
  console.log("USSR cards needed: " + ussr_cards_needed);
  console.log("\n\n\n");

            if (mv[1] == 1) {
              this.addMove("resolve\tdeal");
              this.addMove("DEAL\t1\t"+mv[1]+"\t"+ussr_cards_needed);
            } else {
              this.addMove("resolve\tdeal");
              this.addMove("DEAL\t1\t"+mv[1]+"\t"+us_cards_needed);
            }
            this.endTurn();
          } else {
            this.updateStatus("<span>Opponent is being dealt new cards.</span>");
          }
          this.updateStatus(player.toUpperCase() + "</span> <span>is fetching new cards</span>");
          return 0;
        }
        if (mv[0] === "ops") {
          if (this.game.deck[0].cards[mv[2]] != undefined) { this.game.state.event_name = this.game.deck[0].cards[mv[2]].name; }
          this.updateLog("<span>" + mv[1].toUpperCase() + " plays </span><span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.state.event_name + "</span> <span>for " + mv[3] + " OPS</span>");
          //
          // unset formosan if China card played by US
          //
          if (mv[1] == "us" && mv[2] == "china") {
      this.game.state.events.formosan = 0;
      $('.formosan').hide();
    }
          this.playOps(mv[1], mv[3], mv[2]);
          shd_continue = 0;
        }
        if (mv[0] === "milops") {
          this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> <span>" + mv[2] + "</span> <span>milops");
          if (mv[1] === "us") {
            this.game.state.milops_us += parseInt(mv[2]);
          } else {
            this.game.state.milops_ussr += parseInt(mv[2]);
          }
          this.updateMilitaryOperations();
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "vp") {
          if (mv.length > 3) {
            if (parseInt(mv[3]) == 1) {
              this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> " + mv[2] + " <span>VP");
              if (mv[1] === "us") {
                this.game.state.vp_outstanding += parseInt(mv[2]);
              } else {
                this.game.state.vp_outstanding -= parseInt(mv[2]);
              }
            }
          } else {
            this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> <span>" + mv[2] + "</span> <span>VP");
            if (mv[1] === "us") {
              this.game.state.vp += parseInt(mv[2]);
            } else {
              this.game.state.vp -= parseInt(mv[2]);
            }
            this.updateVictoryPoints();
          }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "coup") {

    let card = "";
    if (mv.length >= 5) { card = mv[4]; }

          this.updateLog("<span>" + mv[1].toUpperCase() + "</span> <span>coups</span> <span>" + this.countries[mv[2]].name + "</span> <span>with</span> <span>" + mv[3] + "</span> <span>OPS</span>");
          if (this.game.state.limit_milops != 1) {
      //
      // modify ops is handled incoherently with milops, so we calculate afresh here
      //
      // reason is that modify ops is run before submitting coups sometimes and sometimes now
      //
      if (card != "") {
              if (mv[1] == "us") { this.game.state.milops_us += this.modifyOps(parseInt(mv[3]), card, 2); }
              if (mv[1] == "ussr") { this.game.state.milops_ussr += this.modifyOps(parseInt(mv[3]), card, 1); }
      } else {
              if (mv[1] == "us") { this.game.state.milops_us += this.modifyOps(parseInt(mv[3]), "", 2); }
              if (mv[1] == "ussr") { this.game.state.milops_ussr += this.modifyOps(parseInt(mv[3]), "", 1); }
      }
            this.updateMilitaryOperations();
          }
    //
    // do not submit card, ops already modified
    //
          this.playCoup(mv[1], mv[2], mv[3]);
          this.game.queue.splice(qe, 1);
        }


        if (mv[0] === "realign") {
          this.updateLog("<span>" + mv[1].toUpperCase() + " <span>realigns</span> <span>" + this.countries[mv[2]].name + "</span> <span>with 1 OPS</span>");
          if (mv[1] != player) { this.playRealign(mv[2]); }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "defcon") {
          if (mv[1] == "lower") {
              this.lowerDefcon();
            if (this.game.state.defcon <= 0) {
              if (this.game.state.headline == 1) {
          if (this.game.state.player_to_go == 1) {
      this.endGame("us", "headline defcon suicide!");
          } else {
      this.endGame("ussr", "headline defcon suicide!");
          }
          return;
        }
              if (this.game.state.turn == 0) {
                this.endGame("ussr", "defcon");
              } else {
                this.endGame("us", "defcon");
              }
        return;
            }
          }
          if (mv[1] == "raise") {
              this.game.state.defcon++;
            if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
            this.updateDefcon();
          }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "notify") {
          this.updateLog(mv[1]);
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "move") {
          if (mv[1] == "ussr") { this.game.state.move = 0; }
          if (mv[1] == "us") { this.game.state.move = 1; }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "event") {

          if (this.game.deck[0].cards[mv[2]] != undefined) { this.game.state.event_name = this.game.deck[0].cards[mv[2]].name; }
          this.updateLog("<span>" + mv[1].toUpperCase() + "</span> <span>triggers</span> <span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.state.event_name + "</span> <span>event</span>");

          shd_continue = this.playEvent(mv[1], mv[2]);

          //
          // show active events
          //
          this.updateEventTiles();

          if (shd_continue == 0) {

            //
            // game will stop
            //
            //this.game.saveGame(this.game.id);

          } else {

            //
            // only continue if we do not stop
            //
            if (mv[1] == "china") {
            } else {

              //
              // remove non-recurring events from game
              //
              for (var i in this.game.deck[0].cards) {
                if (mv[2] == i) {
                  if (this.game.deck[0].cards[i].recurring != 1) {

                    let event_removal = 1;

                    //
                    // Wargames not removed if DEFCON > 2
                    //
                    if (this.game.state.defcon > 2 && mv[2] == "wargames") {
                      event_removal = 0;
                    }

                    //
                    // NATO not removed if prerequisitcs not met
                    //
                    if (this.game.state.events.nato == 0 && mv[2] == "nato") {
                      event_removal = 0;
                    }

                    //
                    // Solidarity not removed if Pope John Paul II not in play
                    //
                    if (this.game.state.events.johnpaul == 0 && mv[2] == "solidarity") {
                      event_removal = 0;
                    }

                    //
                    // Star Wars not removed if not triggered
                    //
                    if (this.game.state.events.starwars == 0 && mv[2] == "starwars") {
                      event_removal = 0;
                    }


                    //
                    // Our Man in Tehran not removed if not triggered
                    //
                    if (this.game.state.events.ourmanintehran == 0 && mv[2] == "ourmanintehran") {
                      event_removal = 0;
                    }


                    //
                    // Kitchen Debates not removed if not triggered
                    //
                    if (this.game.state.events.kitchendebates == 0 && mv[2] == "kitchendebates") {
                      event_removal = 0;
                    }


                    if (event_removal == 1) {

                      this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>removed from game</span>");
                      this.game.deck[0].removed[i] = this.game.deck[0].cards[i];
                      delete this.game.deck[0].cards[i];

                    } else {

                      // just discard -- NATO catch mostly
                      this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                        this.game.deck[0].discards[i] = this.game.deck[0].cards[i];

                    }
                  } else {
                    this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                      this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
                  }
                  }
              }
            }

            // delete event if not deleted already
            this.game.queue.splice(qe, 1);
          }
        }
        if (mv[0] === "place") {
          if (player != mv[1]) { this.placeInfluence(mv[3], parseInt(mv[4]), mv[2]); }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "setvar") {

          if (mv[1] == "opponent_cards_in_hand") {
      this.game.state.opponent_cards_in_hand = parseInt(mv[2]);
    }

          this.game.queue.splice(qe, 1);

        }
        if (mv[0] === "remove") {
          if (player != mv[1]) { this.removeInfluence(mv[3], parseInt(mv[4]), mv[2]); }
          this.showInfluence(mv[3], "us");
          this.showInfluence(mv[3], "ussr");
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "resolve") {

          //
          // eliminate junta
          //
          if (mv[1] === "junta") { this.game.state.events.junta = 0; }

          if (qe == 0) {
              this.game.queue = [];
          } else {

            let le = qe-1;

            //
            // resolving UN intervention means disabling the effect
            //
            if (mv[1] == "unintervention") {

              //
              // UNIntervention causing issues with USSR when US plays
              // force the event to reset in ALL circumstances
              //
              this.game.state.events.unintervention = 0;

              let lmv = this.game.queue[le].split("\t");
              if (lmv[0] == "event" && lmv[2] == mv[1]) {
                this.game.state.events.unintervention = 0;
              }

            }
            //
            // we can remove the event if it is immediately above us in the queue
            //
            if (le <= 0) {
              this.game.queue = [];
            } else {

              let lmv = this.game.queue[le].split("\t");
              let rmvd = 0;

              if (lmv[0] == "headline" && mv[1] == "headline") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "ops" && mv[1] == "ops") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "play" && mv[1] == "play") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "event" && lmv[2] == mv[1]) {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "placement" && mv[1] == "placement") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "placement_bonus" && mv[1] == "placement_bonus") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
        if (lmv[0] == "deal" && mv[1] == "deal") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "discard" && lmv[2] == mv[1]) {
                this.game.queue.splice(qe, 1);
                rmvd = 1;
              }
              if (lmv[0] === mv[1]) {	// "discard teardownthiswall"
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (rmvd == 0) {

                //
                // remove the event
                //
                this.game.queue.splice(qe, 1);

                //
                // go back through the queue and remove any event tht matches this one
                //
                for (let z = le, zz = 1; z >= 0 && zz == 1; z--) {
                  let tmplmv = this.game.queue[z].split("\t");
                  if (tmplmv.length > 0) {
                    if (tmplmv[0] === "event") {
                      if (tmplmv.length > 2) {
                        if (tmplmv[2] === mv[1]) {
  console.log("resolving earlier: " + this.game.queue[z]);
                          this.game.queue.splice(z);
                          zz = 0;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          //
          // remove non-recurring events from game
          //
          for (var i in this.game.deck[0].cards) {
            if (mv[1] == i) {
              if (this.game.deck[0].cards[i].recurring != 1) {
                this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>removed from game</span>");
                this.game.deck[0].removed[i] = this.game.deck[0].cards[i];
                delete this.game.deck[0].cards[i];
              } else {
                this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
              }
            }
          }


        }
        if (mv[0] === "placement") {

          //
          // TESTING
          //
          // if you want to hardcode the hands of the players, you can set
          // them manually here. Be sure that all of the cards have been
          // dealt into the DECK during the setup phase though.
          //

          if (this.is_testing == 1) {
            if (this.game.player == 1) {
              this.game.deck[0].hand = ["aldrichames","fiveyearplan", "berlinagreement", "junta", "che","degaulle","nato","naziscientist","missileenvy","formosan"];
            } else {
              //this.game.deck[0].hand = ["duckandcover","degaulle","lonegunman","cubanmissile","handshake","lonegunman","asia","nasser","sadat"];
              this.game.deck[0].hand = ["duckandcover","degaulle"];
            }
          }

  console.log("IN PLACEMENT");

          //
          // add china card
          //
          this.game.deck[0].cards["china"] = this.returnChinaCard();
          if (this.game.player == 1) {
            let hand_contains_china = 0;
            for (let x = 0; x < this.game.deck[0].hand.length; x++) {
              if (this.game.deck[0].hand[x] == "china") { hand_contains_china = 1; }
            }
            if (hand_contains_china == 0) {
              if (! this.game.deck[0].hand.includes("china")) {
                this.game.deck[0].hand.push("china");
              }
            }
          }

          if (mv[1] == 1) {
            if (this.game.player == mv[1]) {
              this.playerPlaceInitialInfluence("ussr");
            } else {
              this.updateStatusAndListCards('USSR is making its initial placement of influence:');
            }
          } else {
            if (this.game.player == mv[1]) {
              this.playerPlaceInitialInfluence("us");
            } else {
              this.updateStatusAndListCards('US is making its initial placement of influence:');
            }
          }

          //
          // do not remove from queue -- handle RESOLVE on endTurn submission
          //
          return 0;

        }
        if (mv[0] === "placement_bonus") {
          if (mv[1] == 1) {
            if (this.game.player == mv[1]) {
              this.playerPlaceBonusInfluence("ussr", mv[2]);
            } else {
              this.updateStatusAndListCards(`USSR is making its bonus placement of ${mv[2]} influence`);
            }
          } else {
            if (this.game.player == mv[1]) {
              this.playerPlaceBonusInfluence("us", mv[2]);
            } else {
              this.updateStatusAndListCards(`US is making its bonus placement of ${mv[2]} influence`);
            }
          }

          //
          // do not remove from queue -- handle RESOLVE on endTurn submission
          //
          return 0;

        }

        if (mv[0] === "headline") {

    let stage  = "headline1";
          let player = 1;
    let hash   = "";
    let xor    = "";
    let card   = "";

    if (mv.length > 2) {
      stage = mv[1];
      player = parseInt(mv[2]);
    }

          if (stage === "headline1") {
      this.game.state.defectors_pulled_in_headline = 0;
          }

          if (mv.length > 3) { hash = mv[3]; }
          if (mv.length > 4) { xor = mv[4]; }
    if (mv.length > 5) { card = mv[5]; }

  console.log("HEADLINE: " + stage + " -- " + player + " -- " + hash + " -- " + xor + " -- " + card);

          let x = this.playHeadlineModern(stage, player, hash, xor, card);

    //
    // do not remove from queue -- handle RESOLVE on endTurn submission
    //
    return 0;

        }
        if (mv[0] === "round") {


          //
          // NORAD
          //
          if (this.game.state.us_defcon_bonus == 1) {
            if (this.isControlled("us", "canada") == 1) {

              let twilight_self = this;
              this.game.state.us_defcon_bonus = 0;

              if (this.game.player == 1) {
                this.updateStatus("NORAD triggers: US places 1 influence in country with US influence");
                this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                return 0;
              }
              if (this.game.player == 2) {
              this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                for (var i in this.countries) {

                  let countryname  = i;
                  let divname      = '#'+i;

                  if (this.countries[countryname].us > 0) {

                      this.updateStatus("Place your NORAD bonus: (1 OP)");

                      $(divname).off();
                      $(divname).on('click', function() {

                      // no need for this end-of-round
                      // twilight_self.addMove("resolve\tturn");

                      let countryname = $(this).attr('id');
                      twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                      twilight_self.placeInfluence(countryname, 1, "us", function() {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      });
                    });
                  }
                }
              }
              return 0;
            } else {
              this.game.state.us_defcon_bonus = 0;
            }
          }

          //
          // prevent DEFCON bonus from carrying over to next round
          //
          this.game.state.us_defcon_bonus = 0;


          //
          // settle outstanding VP issue
          //
          this.settleVPOutstanding();


          //
          // show active events
          //
          this.updateEventTiles();

          if (this.game.state.events.northseaoil_bonus == 1) {

            this.game.state.events.northseaoil_bonus = 0;
            if (this.game.player == 1) {
              this.updateStatus("US is deciding whether to take extra turn");
              return 0;
            }

            //
            // US gets extra move
            //
            let html  = "<span>Do you want to take an extra turn: (North Sea Oil)</span><p></p><ul>";
                html += '<li class="card" id="play">play extra turn</li>';
                html += '<li class="card" id="nope">do not play</li>';
                html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              if (action2 == "play") {
                twilight_self.addMove("play\t2");
                twilight_self.endTurn(1);
              }
              if (action2 == "nope") {
                twilight_self.addMove("notify\tUS does not play extra turn");
                twilight_self.endTurn(1);
              }

            });

            return 0;

          }


          //
          // Eagle Has Landed
          //
          if (this.game.state.eagle_has_landed != "" && this.game.state.eagle_has_landed_bonus_taken == 0 && this.game.state.round > 0) {

            this.game.state.eagle_has_landed_bonus_taken = 1;

            let bonus_player = 1;
            if (this.game.state.eagle_has_landed == "us") { bonus_player = 2; }

            if (this.game.player != bonus_player) {
              this.updateStatus(this.game.state.eagle_has_landed.toUpperCase() + " </span> <span>is deciding whether to discard a card");
        //
        // commented-out 2019-09-18
        //
              //this.saveGame(this.game.id);
              return 0;
            }

            //
            // DISCARD CARD
            //
            let html  = "<span>US may discard a card: (Eagle Has Landed)</span><p></p><ul>";
            if (bonus_player == 1) { html  = "<span>USSR may discard a card: (Bear Has Landed)</span><p></p><ul>"; }
                html += '<li class="card" id="discard">discard card</li>';
                html += '<li class="card" id="nope">do not discard</li>';
                html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              if (action2 == "nope") {
                twilight_self.addMove("notify\t"+twilight_self.game.state.eagle_has_landed.toUpperCase()+" does not discard a card");
                twilight_self.endTurn(1);
              }

              if (action2 == "discard") {

                let cards_discarded = 0;

                let cards_to_discard = 0;
                let user_message = "<span>Select card to discard:</span><p></p><ul>";
                for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
                  if (twilight_self.game.deck[0].hand[i] != "china") {
                    user_message += '<li class="card showcard" id="'+twilight_self.game.deck[0].hand[i]+'">'+twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].name+'</li>';
                    cards_to_discard++;
                  }
                }

                if (cards_to_discard == 0) {
                  twilight_self.updateStatus("<span>No cards available to discard! Please wait for next turn...</span>");
                  twilight_self.addMove("notify\tUS has no cards available to discard");
                  twilight_self.endTurn(1);
            //
            // commented-out 2019-09-18
            //
                  //twilight_self.saveGame(twilight_self.game.id);
                  return;
                }

                user_message += '</ul><p></p></span>If you wish to cancel your discard,</span> <span class="card dashed" id="finished">click here</span>.';
                twilight_self.updateStatus(user_message);

                twilight_self.addShowCardEvents(function(card) {
                  let action2 = $(card).attr("id");
                  if (action2 == "finished") {
                    twilight_self.endTurn(1);
                  } else {
                    $(card).hide();
                    twilight_self.hideCard();
                    twilight_self.updateStatus("Discarding...");
                    cards_discarded++;
                    twilight_self.removeCardFromHand(action2);
                    twilight_self.addMove("discard\t"+twilight_self.game.state.eagle_has_landed+"\t"+action2);
                    twilight_self.addMove("notify\t"+twilight_self.game.state.eagle_has_landed.toUpperCase()+" discards <span class=\"logcard\" id=\""+action2+"\">"+twilight_self.game.deck[0].cards[action2].name + "</span>");
                    twilight_self.endTurn(1);
                    return 0;
                  }
                });
              }

              return 0;

            });

            return 0;

          }




          //
          // Space Shuttle
          //
          if (this.game.state.space_shuttle != "" && this.game.state.space_shuttle_bonus_taken == 0 && this.game.state.round > 0) {

            this.game.state.space_shuttle_bonus_taken = 1;

            let bonus_player = 1;
            if (this.game.state.space_shuttle == "us") { bonus_player = 2; }

            if (this.game.player != bonus_player) {
              this.updateStatus(this.game.state.space_shuttle.toUpperCase() + "</span> <span>is deciding whether to take extra turn");
              return 0;
            }

            //
            // player gets extra move
            //
            let html  = "<span>Do you want to take an extra turn: (Space Shuttle)</span><p></p><ul>";
                html += '<li class="card" id="play">play extra turn</li>';
                html += '<li class="card" id="nope">do not play</li>';
                html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              if (action2 == "play") {
                twilight_self.addMove("play\t"+bonus_player);
                twilight_self.endTurn(1);
              }
              if (action2 == "nope") {
                twilight_self.addMove("notify\t"+twilight_self.game.state.space_shuttle.toUpperCase()+" does not play extra turn");
                twilight_self.endTurn(1);
              }

            });

            return 0;

          }



          //
          // if we have come this far, move to the next turn
          //
          if (this.game.state.round > 0) {
            this.updateLog("End of Round");
          }
          this.endRound();

          this.updateStatus("<span>Preparing for round</span> " + this.game.state.round);

          let rounds_in_turn = 6;
          if (this.game.state.round > 3) { rounds_in_turn = 7; }

          for (let i = 0; i < rounds_in_turn; i++) {
            this.game.queue.push("turn");
            this.game.queue.push("play\t2");
            this.game.queue.push("play\t1");
          }
          this.game.queue.push("headline");
          this.game.state.headline = 0;


          //
          // END GAME IF WE MAKE IT !
          //
          if (this.game.state.round == 11) {
            this.finalScoring();
          }


          //
          // DEAL MISSING CARDS
          //
          if (this.game.state.round > 1) {

            this.updateLog(this.game.deck[0].crypt.length + " <span>cards remaining in deck...</span>");

            this.game.queue.push("deal\t2");
            this.game.queue.push("deal\t1");

            let reshuffle_limit = 14;

            let cards_needed_per_player = 8;
            if (this.game.state.round >= 4) { cards_needed_per_player = 9; }

            let ussr_cards = this.game.deck[0].hand.length;
            for (let z = 0; z < this.game.deck[0].hand.length; z++) {
              if (this.game.deck[0].hand[z] == "china") {
                ussr_cards--;
              }
            }
            let us_cards   = this.game.state.opponent_cards_in_hand;

            if (this.game.player == 2) {
              let x = ussr_cards;
              ussr_cards = us_cards;
              us_cards = x;
            }

            let us_cards_needed = cards_needed_per_player - us_cards;
            let ussr_cards_needed = cards_needed_per_player - ussr_cards;
            reshuffle_limit = us_cards_needed + ussr_cards_needed;

            if (this.game.deck[0].crypt.length < reshuffle_limit) {

              //
              // no need to reshuffle in turn 4 or 8 as we have new cards inbound
              //
              if (this.game.state.round != 4 && this.game.state.round != 8) {

                //
                // this resets discards = {} so that DECKBACKUP will not retain
                //
                let discarded_cards = this.returnDiscardedCards();
                if (Object.keys(discarded_cards).length > 0) {

                  //
                  // shuffle in discarded cards
                  //
                  this.game.queue.push("SHUFFLE\t1");
                  this.game.queue.push("DECKRESTORE\t1");
                  this.game.queue.push("DECKENCRYPT\t1\t2");
                  this.game.queue.push("DECKENCRYPT\t1\t1");
                  this.game.queue.push("DECKXOR\t1\t2");
                  this.game.queue.push("DECKXOR\t1\t1");
                  this.game.queue.push("DECK\t1\t"+JSON.stringify(discarded_cards));
                  this.game.queue.push("DECKBACKUP\t1");
                  this.updateLog("Shuffling discarded cards back into the deck...");

                }

                //
                // deal existing cards before
                // we shuffle the discards into the
                // deck
                //
                let cards_available = this.game.deck[0].crypt.length;
                let player2_cards = Math.floor(cards_available / 2);
                let player1_cards = cards_available - player2_cards;;

                //
                // adjust distribution of cards
                //
                if (player2_cards > us_cards_needed) {
                  let surplus_cards = player2_cards - us_cards_needed;
                  player2_cards = us_cards_needed;
                  player1_cards += surplus_cards;
                }
                if (player1_cards > ussr_cards_needed) {
                  let surplus_cards = player1_cards - ussr_cards_needed;
                  player1_cards = ussr_cards_needed;
                  player2_cards += surplus_cards;
                }

                if (player1_cards > 0) {
                  this.game.queue.push("DEAL\t1\t2\t"+player2_cards);
                  this.game.queue.push("DEAL\t1\t1\t"+player1_cards);
                }
                this.updateStatus("Dealing remaining cards from draw deck before reshuffling...");
                this.updateLog("Dealing remaining cards from draw deck before reshuffling...");

              }

            }



            if (this.game.state.round == 4) {

              this.game.queue.push("SHUFFLE\t1");
              this.game.queue.push("DECKRESTORE\t1");
              this.game.queue.push("DECKENCRYPT\t1\t2");
              this.game.queue.push("DECKENCRYPT\t1\t1");
              this.game.queue.push("DECKXOR\t1\t2");
              this.game.queue.push("DECKXOR\t1\t1");
              this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnMidWarCards()));
              this.game.queue.push("DECKBACKUP\t1");
              this.updateLog("Adding Mid War cards to the deck...");

            }


            if (this.game.state.round == 8) {

              this.game.queue.push("SHUFFLE\t1");
              this.game.queue.push("DECKRESTORE\t1");
              this.game.queue.push("DECKENCRYPT\t1\t2");
              this.game.queue.push("DECKENCRYPT\t1\t1");
              this.game.queue.push("DECKXOR\t1\t2");
              this.game.queue.push("DECKXOR\t1\t1");
              this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnLateWarCards()));
              this.game.queue.push("DECKBACKUP\t1");
              this.updateLog("Adding Late War cards to the deck...");

            }
          }

          return 1;
        }
        if (mv[0] === "play") {

          //
          // it is no longer the headline
          //
          this.game.state.headline = 0;

          //
          // resolve outstanding VP
          //
          this.settleVPOutstanding();

          //
          // show active events
          //
          this.updateEventTiles();


          if (mv[1] == 1) {
            this.game.state.turn = 0;
          }
          if (mv[1] == 2) { this.game.state.turn = 1; }

          //
          // deactivate cards
          //
          this.game.state.events.china_card_eligible = 0;

    //
    // back button functions again
    //
          this.game.state.back_button_cancelled = 0;

          //
          // NORAD
          //
          if (this.game.state.us_defcon_bonus == 1) {
            if (this.isControlled("us", "canada") == 1) {

              let twilight_self = this;
              this.game.state.us_defcon_bonus = 0;

              if (this.game.player == 1) {
                this.updateStatus("NORAD triggers: US places 1 influence in country with US influence");
                this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                return 0;
              }
              if (this.game.player == 2) {
              this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                for (var i in this.countries) {

                  let countryname  = i;
                  let divname      = '#'+i;

                  if (this.countries[countryname].us > 0) {

                      this.updateStatus("US place NORAD bonus: (1 OP)");

                      $(divname).off();
                      $(divname).on('click', function() {

                      twilight_self.addMove("resolve\tturn");

                      let countryname = $(this).attr('id');
                      twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                      twilight_self.placeInfluence(countryname, 1, "us", function() {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      });
                    });
                  }
                }
              }
              return 0;
            } else {
              this.game.state.us_defcon_bonus = 0;
            }
          }

          this.updateDefcon();
          this.updateActionRound();
          this.updateSpaceRace();
          this.updateVictoryPoints();
          this.updateMilitaryOperations();
          this.updateRound();

          this.playMove(msg);
          return 0;
        }


        //
        // avoid infinite loops
        //
        if (shd_continue == 0) {
          console.log("NOT CONTINUING");
          return 0;
        }


    } // if cards in queue
    return 1;

  }





  playHeadlineModern(stage, player, hash="", xor="", card="") {

    this.game.state.headline = 1;

    //
    // NO HEADLINE PEEKING
    //
    if (this.game.state.man_in_earth_orbit == "") {

      //
      // USSR picks
      //
      if (stage == "headline1") {

        //
        // both players reset headline info
        //
        this.game.state.headline_hash  		= "";
        this.game.state.headline_xor   		= "";
        this.game.state.headline_card  		= "";
        this.game.state.headline_opponent_hash  	= "";
        this.game.state.headline_opponent_xor   	= "";
        this.game.state.headline_opponent_card  	= "";

        if (this.game.player == player) {
          this.updateLog("USSR selecting headline card");
    this.addMove("resolve\theadline");
          this.playerPickHeadlineCard();
        } else {
          this.updateStatusAndListCards(`Waiting for USSR to pick headline card`);
        }

        return 0;
      }

      //
      // US picks
      //
      if (stage == "headline2") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_hash = hash;

          this.updateLog("US selecting headline card");
    this.addMove("resolve\theadline");
          this.playerPickHeadlineCard();

        } else {

          this.updateStatusAndListCards(`Waiting for US to pick headline card`);

        }
        return 0;
      }


      //
      // USSR sends XOR
      //
      if (stage == "headline3") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_hash = hash;

          this.updateLog("Initiating blind headline card swap");

    this.addMove("resolve\theadline");
    this.addMove("headline\theadline4\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
    this.endTurn();

        } else {

          this.updateLog("Waiting for USSR to confirm card selection");

        }
        return 0;
      }


      //
      // US confirms USSR XOR and sends its XOR
      //
      if (stage == "headline4") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_xor  = xor;
          this.game.state.headline_opponent_card = card;

          if (this.game.state.headline_opponent_hash != this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor)) {
            alert("PLAYER 1 HASH WRONG: -- this is a development error message that can be triggered if the opponent attempts to cheat by changing their selected card after sharing the encrypted hash. It can also be rarely caused if one or both players reload or have unreliable connections during the headline exchange process. The solution in this case is for both players to reload until the game hits the first turn. " + this.game.state.headline_opponent_hash + " -- " + this.game.state.headline_opponent_card + " -- " + this.game.state.headline_opponent_xor + " -- " + this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor));
          }

          this.updateLog("Initiating blind headline card swap");

    this.addMove("resolve\theadline");
    this.addMove("headline\theadline5\t"+1+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
    this.endTurn();

        } else {

          this.updateLog("Waiting for US to confirm card selection");

        }
        return 0;
      }


      //
      // USSR confirms US XOR
      //
      if (stage == "headline5") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_xor  = xor;
          this.game.state.headline_opponent_card = card;

          if (this.game.state.headline_opponent_hash != this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor)) {
            alert("PLAYER 2 HASH WRONG: -- this is a development error message that can be triggered if the opponent attempts to cheat by changing their selected card after sharing the encrypted hash. It can also be rarely caused if one or both players reload or have unreliable connections during the headline exchange process. The solution in this case is for both players to reload until the game hits the first turn. " + this.game.state.headline_opponent_hash + " -- " + this.game.state.headline_opponent_card + " -- " + this.game.state.headline_opponent_xor + " -- " + this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor));
          }

          this.updateLog("Initiating blind headline card swap");

    this.addMove("resolve\theadline");
    this.addMove("headline\theadline6\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
    this.endTurn();

        } else {

          this.updateLog("Waiting for US to confirm card selection");

        }
        return 0;
      }



    } // end man-in-earth orbit




    //
    // man in earth orbit = HEADLINE PEEKING
    //
    else {

      //
      // first remember we are in the headline phase
      //
      this.game.state.headline = 1;

      let first_picker = 2;
      let second_picker = 1;
      let playerside = "US";

      if (this.game.state.man_in_earth_orbit === "us") { first_picker = 1; second_picker = 2; playerside = "USSR"; }


      //
      // first player sends card
      //
      if (stage == "headline1") {

        if (this.game.player == first_picker) {
          this.updateLog(playerside + " selecting headline card first");
    this.addMove("resolve\theadline");
    this.playerPickHeadlineCard();
        } else {
          this.updateStatusAndListCards(playerside + ' picks headline card first');
        }
        return 0;

      }



      //
      // second player sends card
      //
      if (stage == "headline2") {

        if (this.game.player == second_picker) {

          this.game.state.headline_opponent_hash = hash;
          this.game.state.headline_opponent_xor = xor;
          this.game.state.headline_opponent_card = card;

          this.updateLog(playerside + " selecting headline card player");
    this.addMove("resolve\theadline");
    this.playerPickHeadlineCard();

        } else {
          this.updateStatusAndListCards('Opponent picking headline card second');
        }
        return 0;

      }



      //
      // first player gets second player pick, then we move on....
      //
      if (stage == "headline3") {

        if (this.game.player == first_picker) {

          this.game.state.headline_opponent_hash = hash;
          this.game.state.headline_opponent_xor = xor;
          this.game.state.headline_opponent_card = card;

        }

        stage = "headline6";

      }

    } // end man-in-earth-orbit









    //
    // default to ussr
    //
    this.game.state.player_to_go = 1;

    //
    // headline execution starts here
    //
    if (stage == "headline6") {

      this.updateLog("Moving into first headline card event");

      let my_card = this.game.state.headline_card;
      let opponent_card = this.game.state.headline_opponent_card;

      if (this.game.player == 1) {
        if (this.returnOpsOfCard(my_card) > this.returnOpsOfCard(opponent_card)) {
          this.game.state.player_to_go = 1;
        } else {
          this.game.state.player_to_go = 2;
        }
      }
      if (this.game.player == 2) {
        if (this.returnOpsOfCard(my_card) >= this.returnOpsOfCard(opponent_card)) {
          this.game.state.player_to_go = 2;
        } else {
          this.game.state.player_to_go = 1;
        }
      }

      let player = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { player = "us"; opponent = "ussr"; }
      let card_player = player;

      //
      // headline4 is our FIRST headline card
      // headline5 is our SECOND headline card
      //
      let shd_continue = 1;

      //
      // check to see if defectors is live
      //
      let us_plays_defectors = 0;
      let ussr_plays_defectors = 0;

      if (my_card == "defectors") {
        if (opponent == "ussr") {
          us_plays_defectors = 1;
        }
        if (opponent == "us") {
          ussr_plays_defectors = 1;
        }
      } else {
        if (opponent_card == "defectors") {
          if (opponent == "ussr") {
              ussr_plays_defectors = 1;
          }
          if (opponent == "us") {
              us_plays_defectors = 1;
          }
        }
      }


      if (us_plays_defectors == 1) {

        this.updateLog("<span>US headlines</span> <span class=\"logcard\" id=\"defectors\">Defectors</span>");

        this.game.turn = [];
        if (my_card != "defectors") {
          this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        } else {
          this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>");
        }

        this.updateLog("Defectors cancels USSR headline.");
        this.updateStatus("Defectors cancels USSR headline. Moving into first turn...");

        //
        // only one player should trigger next round
        //
        if (this.game.player == 1) {
          this.addMove("resolve\theadline");
          this.addMove("discard\tus\tdefectors");
          this.addMove("discard\tussr\t"+my_card);
          this.endTurn();
        }

      } else {

        // show headline card information to both players
        if (this.game.player == 1) {
          this.updateStatus("<span>US headlines</span> <span class=\"showcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>. USSR headlines <span class=\"showcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
          this.updateLog("<span>US headlines</span> <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>.");
          this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        } else {
          this.updateStatus("<span>USSR headlines</span> <span class=\"showcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>. US headlines <span class=\"showcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
          this.updateLog("<span>USSR headlines <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>.");
          this.updateLog("<span>US headlines <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        }



        if (this.game.state.player_to_go == this.game.player) {
    this.addMove("resolve\theadline");
    this.addMove("headline\theadline7\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
          this.addMove("event\t"+card_player+"\t"+my_card);
          this.addMove("discard\t"+card_player+"\t"+my_card);
          this.addMove("discard\t"+opponent+"\t"+opponent_card);
          this.removeCardFromHand(my_card);
          this.endTurn();
        }
      }
      return 0;
    }




    //
    // second player plays headline card
    //
    if (stage == "headline7") {

      let my_card = this.game.state.headline_card;
      let opponent_card = this.game.state.headline_opponent_card;

      //
      // we switch to the other player now
      //
      if (this.game.player == 1) {
        if (this.game.deck[0].cards[my_card] == undefined) { this.game.state.player_to_go = 2; } else {
          if (this.game.deck[0].cards[opponent_card] == undefined) { this.game.state.player_to_go = 1; } else {
            if (this.returnOpsOfCard(my_card) > this.returnOpsOfCard(opponent_card)) {
              this.game.state.player_to_go = 2;
            } else {
              this.game.state.player_to_go = 1;
            }
          }
        }
      }

      if (this.game.player == 2) {
        if (this.game.deck[0].cards[my_card] == undefined) { this.game.state.player_to_go = 1; } else {
          if (this.game.deck[0].cards[opponent_card] == undefined) { this.game.state.player_to_go = 2; } else {
            if (this.returnOpsOfCard(my_card) >= this.returnOpsOfCard(opponent_card)) {
              this.game.state.player_to_go = 1;
            } else {
              this.game.state.player_to_go = 2;
            }
            }
        }
      }


      let player = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { player = "us"; opponent = "ussr"; }
      let card_player = player;

      if (player == "ussr" && this.game.state.defectors_pulled_in_headline == 1) {
        if (this.game.state.player_to_go == this.game.player) {
          this.addMove("resolve\theadline");
          this.addMove("notify\tDefectors cancels USSR headline. Tough luck, there.");
          this.removeCardFromHand(my_card);
          this.endTurn();
        }
      } else {
        if (this.game.state.player_to_go == this.game.player) {
          this.addMove("resolve\theadline");
          this.addMove("event\t"+card_player+"\t"+my_card);
          this.removeCardFromHand(my_card);
          this.endTurn();
        }
      }

      return 0;

    }

    return 1;
  }





  playMove(msg) {

    this.game.state.headline  = 0;
    this.game.state.headline_hash = "";
    this.game.state.headline_card = "";
    this.game.state.headline_xor = "";
    this.game.state.headline_opponent_hash = "";
    this.game.state.headline_opponent_card = "";
    this.game.state.headline_opponent_xor = "";


    //
    // how many turns left?
    //
    let rounds_in_turn = 6;
    if (this.game.state.round > 3) { rounds_in_turn = 7; }
    let moves_remaining = rounds_in_turn - this.game.state.turn_in_round;


    //
    //
    //
    let scoring_cards_available = 0;
    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; }
      }
    }

    //
    // player 1 moves
    //
    if (this.game.state.turn == 0) {
      if (this.game.player == 1) {
        if (this.game.state.turn_in_round == 0) {
          this.game.state.turn_in_round++;
          this.updateActionRound();
        }
        if (this.game.state.events.missile_envy == 1) {

          //
          // if must play scoring card -- moves remaining at 0 in last move
          //
          if (scoring_cards_available > moves_remaining) {
            this.playerTurn("scoringcard");
          } else {

            //
            // if cannot sacrifice missile envy to bear trap because red purged
            //
            if (this.game.state.events.beartrap == 1 && this.game.state.events.redscare_player1 == 1) {
              this.playerTurn();
            } else {
              this.playerTurn("missileenvy");
            }
          }
        } else {
          this.playerTurn();
        }
      } else {
        this.updateStatusAndListCards(`Waiting for USSR to move`);
        if (this.game.state.turn_in_round == 0) {
          this.game.state.turn_in_round++;
          this.updateActionRound();
        }
      }
      return;
    }

    //
    // player 2 moves
    //
    if (this.game.state.turn == 1) {

      if (this.game.player == 2) {

        if (this.game.state.turn_in_round == 0) {
          this.removeCardFromHand(this.game.state.headline_card);
        }

        if (this.game.state.events.missile_envy == 2) {

          //
          // moves remaining will be 0 last turn
          //
          if (scoring_cards_available > moves_remaining) {
            this.playerTurn("scoringcard");
          } else {

            //
            // if cannot sacrifice missile envy to quagmire because red scare
            //
            if (this.game.state.events.quagmire == 1 && this.game.state.events.redscare_player2 == 1) {
              this.playerTurn();
            } else {
              this.playerTurn("missileenvy");
            }

          }
        } else {
          this.playerTurn();
        }
      } else {
        // this.updateStatus("Waiting for US to move");
        this.updateStatusAndListCards(`Waiting for US to move`);
      }
      return;
    }


    return 1;

  }






  playOps(player, ops, card) {

    //
    // modify ops
    //
    ops = this.modifyOps(ops, card);

    let me = "ussr";
    let twilight_self = this;

    // reset events / DOM
    twilight_self.playerFinishedPlacingInfluence();

    if (this.game.player == 2) { me = "us"; }

    if (player === me) {

      let html = twilight_self.formatPlayOpsStatus(player, ops);
      twilight_self.updateStatus(html);

      // TODO:
      $('.card').off();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        //
        // prevent ops hang
        //
        twilight_self.addMove("resolve\tops");

        if (action2 == "place") {

          let j = ops;
          let html = twilight_self.formatStatusHeader("Place " + j + " influence", true)
          twilight_self.updateStatus(html);
          twilight_self.prePlayerPlaceInfluence(player);
          if (j == 1) {
            twilight_self.uneventOpponentControlledCountries(player, card);
          }
          twilight_self.playerPlaceInfluence(player, (country, player) => {

            j--;

            //
            // breaking control must be costly
            //
            if (twilight_self.game.break_control == 1) {
              j--;
              if (j < 0) { twilight_self.endRegionBonus(); j = 0; }
            }
            twilight_self.game.break_control = 0;

            if (j < 2) {
              twilight_self.uneventOpponentControlledCountries(player, card);
            }

            let html = twilight_self.formatStatusHeader("Place " + j + " influence", true)
            twilight_self.updateStatus(html);

            if (j <= 0) {
              if (twilight_self.isRegionBonus(card) == 1) {
                twilight_self.updateStatus("Place regional bonus");
                j++;
                twilight_self.limitToRegionBonus();
                twilight_self.endRegionBonus();
              } else {
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.endTurn();
                return;
              }
            }


            twilight_self.bindBackButtonFunction(() => {
        //
              // If the placement array is full, then
              // undo all of the influence placed this turn
        //
              if (twilight_self.undoMove(action2, ops - j)) {
                twilight_self.playOps(player, ops, card);
        }
      });

          });

        }

        if (action2 == "coup") {

          let html = twilight_self.formatStatusHeader("Pick a country to coup", true);
          twilight_self.updateStatus(html);
          twilight_self.playerCoupCountry(player, ops, card);

          // return;
        }


        if (action2 == "realign") {

          let html = twilight_self.formatStatusHeader(`Realign with ${ops} OPS, or:`, true);
          html += `<p></p><ul><li class=\"card\" id=\"cancelrealign\">end turn</li></ul>`;
          twilight_self.updateStatus(html);

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");
            if (action2 == "cancelrealign") {
              twilight_self.addMove("notify\t"+player.toUpperCase()+" opts to end realignments");
              twilight_self.endTurn();
              return;
            }

          });

          let j = ops;
          twilight_self.playerRealign(player, card, () => {

            //
            // disable countries without
            //
            for (var countryname in twilight_self.countries) {

              let divname3 = "#"+countryname;

              if (twilight_self.game.player == 1) {
                if (twilight_self.countries[countryname].us < 1) {
                  $(divname3).off();
                  $(divname3).on('click',()=>{ twilght_self.displayModal('Invalid Realign Target'); });
                }
              } else {
                if (twilight_self.countries[countryname].ussr < 1) {
                  $(divname3).off();
                  $(divname3).on('click',()=>{ twilght_self.displayModal('Invalid Realign Target'); });
                }
              }
            }


            j--;

            twilight_self.updateStatus("Realign with " + j + " OPS, or:<p></p><ul><li class=\"card\" id=\"cancelrealign\">stop realigning</li></ul>");
            let html = twilight_self.formatStatusHeader(`Realign with ${j} OPS, or:`, true);
            html += `<p></p><ul><li class=\"card\" id=\"cancelrealign\">end turn</li></ul>`;
            twilight_self.updateStatus(html);

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");
              if (action2 == "cancelrealign") {

                //
                // reverse order of realigns
                //
                // they need to be executed in the order that we did them for bonuses to work properly
                //
                let new_moves = [];
                for (let z = twilight_self.moves.length-1; z >= 0; z--) {
                  let tmpar = twilight_self.moves[z].split("\t");
                  if (tmpar[0] === "realign") {
                    new_moves.push(twilight_self.moves[z]);
                  } else {
                    new_moves.unshift(twilight_self.moves[z])
                  }
                }
                twilight_self.moves = new_moves;
                twilight_self.endTurn();
                return;
              }
            });


            if (j <= 0) {
              if (twilight_self.isRegionBonus(card) == 1) {
                twilight_self.updateStatus("Realign with bonus OP");
                j++;
                twilight_self.limitToRegionBonus();
                twilight_self.endRegionBonus();
              } else {

                //
                // reverse order of realigns
                //
                // they need to be executed in the order that we did them for bonuses to work properly
                //
                let new_moves = [];
                for (let z = twilight_self.moves.length-1; z >= 0; z--) {
                  let tmpar = twilight_self.moves[z].split("\t");
                  if (tmpar[0] === "realign") {
                    new_moves.push(twilight_self.moves[z]);
                  } else {
                    new_moves.unshift(twilight_self.moves[z])
                  }
                }
                twilight_self.moves = new_moves;
                twilight_self.endTurn();
                return;
              }
            }
          });
        }

        twilight_self.bindBackButtonFunction(() => {
    twilight_self.playOps(player, ops, card);
        });

      });
    }

    return;

  }

  confirmEvent() {
    return confirm("Confirm your desire to play this event");
  }

  formatPlayOpsStatus(player, ops) {
    let html = `<span>${player.toUpperCase()} plays ${ops} OPS:</span><p></p><ul>`;
    if (this.game.state.limit_placement == 0) { html += '<li class="card" id="place">place influence</li>'; }
    if (this.game.state.limit_coups == 0) { html += '<li class="card" id="coup">launch coup</li>'; }
    if (this.game.state.limit_realignments == 0) { html += '<li class="card" id="realign">realign country</li>'; }
    html += '</ul>';
    return html;
  }

  bindBackButtonFunction(mycallback) {
    $('#back_button').off();
    $('#back_button').on('click', mycallback);
  }



  playerPickHeadlineCard() {

    let twilight_self = this;

    if (this.browser_active == 0) { return; }

    let player = "us";
    if (this.game.player == 1) { player = "ussr"; }
    let x = "";

    //
    // HEADLINE PEEKING / man in earth orbit
    //
    if (this.game.state.man_in_earth_orbit != "") {
      if (this.game.state.man_in_earth_orbit === "us") {
        if (this.game.player == 1) {
          x = `<div class="cardbox-status-container">
            <div><span>${player.toUpperCase()}</span> <span>pick your headline card first</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          </div>`;
        } else {
          x = `<div class="cardbox-status-container">
            <div><span>${player.toUpperCase()}</span> <span>pick your headline card second (opponent selected: ${twilight_self.game.state.headline_opponent_card})</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          </div>`;
        }
      } else {
        if (this.game.player == 1) {
          x = `<div class="cardbox-status-container">
            <div><span>${player.toUpperCase()}</span> <span>pick your headline card second (opponent selected: ${twilight_self.game.state.headline_opponent_card})</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          </div>`;
        } else {
          x = `<div class="cardbox-status-container">
            <div><span>${player.toUpperCase()}</span> <span>pick your headline card first</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          </div>`;
        }
      }
    //
    // NORMAL HEADLINE ORDER
    //
    } else {
      x = `<div class="cardbox-status-container">
        <div><span>${player.toUpperCase()}</span> <span>pick your headline card</span></div>
        ${this.returnCardList(this.game.deck[0].hand)}
      </div>`;
    }

    this.updateStatus(x);

    twilight_self.addShowCardEvents(function(card) {

      card = $(card).attr("id");

      //
      // mobile clients have sanity check on card check
      //
      if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
        twilight_self.mobileCardSelect(card, player, function() {
          twilight_self.playerTurnHeadlineSelected(card, player);
        }, "play");

        return;
      }

      twilight_self.playerTurnHeadlineSelected(card, player);

    });

  }


  playerTurnHeadlineSelected(card, player) {

    let twilight_self = this;

    // cannot pick china card or UN intervention
    if (card == "china") {
      twilght_self.displayModal("Invalid Headline", "You cannot headline China"); return; }
    if (card == "unintervention") {
      twilght_self.displayModal("Invalid Headline", "You cannot headline UN Intervention"); return; }

    twilight_self.game.state.headline_card = card;
    twilight_self.game.state.headline_xor = twilight_self.app.crypto.hash(Math.random());
    twilight_self.game.state.headline_hash = twilight_self.app.crypto.encodeXOR(twilight_self.app.crypto.stringToHex(twilight_self.game.state.headline_card), twilight_self.game.state.headline_xor);


    //
    // HEADLINE PEEKING / man in earth orbit
    //
    if (this.game.state.man_in_earth_orbit != "") {
      if (this.game.state.man_in_earth_orbit === "us") {
        if (this.game.player == 1) {
          twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        } else {
          twilight_self.addMove("headline\theadline3\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        }
      } else {
        if (this.game.player == 1) {
          twilight_self.addMove("headline\theadline3\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        } else {
          twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        }
      }
    //
    // NORMAL HEADLINE ORDER
    //
    } else {
      if (this.game.player == 1) {
        twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t\t\t");
      } else {
        twilight_self.addMove("headline\theadline3\t1\t"+twilight_self.game.state.headline_hash+"\t\t\t");
      }
    }

    twilight_self.updateStatus("simultaneous blind pick... encrypting selected card");
    twilight_self.game.turn = [];

    $('.card').off();
    $('.showcard').off();
    twilight_self.hideCard();
    twilight_self.endTurn();

    return;

  }



  playerTurn(selected_card=null) {

    //
    // remove back button from forced gameplay
    //
    if (selected_card != null) { this.game.state.back_button_cancelled = 1; }


    //
    // show active events
    //
    this.updateEventTiles();


    original_selected_card = selected_card;

    if (this.browser_active == 0) { return; }

    //
    // reset region bonuses (if applicable)
    //
    this.game.state.events.china_card_in_play = 0;
    this.game.state.events.vietnam_revolts_eligible = 1;
    this.game.state.events.china_card_eligible = 1;
    this.game.state.events.region_bonus = "";
    this.game.state.ironlady_before_ops = 0;

    let player = "ussr";
    let opponent = "us";
    let playable_cards = [];

    if (this.game.player == 2) { player = "us"; opponent = "ussr"; }

    is_this_missile_envy_noneventable = this.game.state.events.missileenvy;

  console.log("IS_THIS_MISSILE_ENVY_NONEVENTABLE: " + is_this_missile_envy_noneventable);

    let user_message = "";
    if (selected_card == null) {

      user_message = player.toUpperCase() + " pick a card: ";
      for (i = 0; i < this.game.deck[0].hand.length; i++) {
        //
        // when UN Intervention is eventing, we can only select opponent cards
        //
        if (this.game.state.events.unintervention == 1) {
          if (this.game.player == 1 && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "us") {
            playable_cards.push(this.game.deck[0].hand[i]);
          }
          if (this.game.player == 2 && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "ussr") {
            playable_cards.push(this.game.deck[0].hand[i]);
          }
        } else {
          playable_cards.push(this.game.deck[0].hand[i]);
        }
      };
    } else {

      if (selected_card === "scoringcard") {
        user_message = 'Scoring card must be played: <p></p><ul>';
        for (i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
              selected_card = this.game.deck[0].hand[i];
              playable_cards.push(this.game.deck[0].hand[i]);
            }
          }
        }
      } else {
        playable_cards.push(selected_card);
      }
    }

    //
    // Cuban Missile Crisis
    //
    if ((this.game.player == 1 && this.game.state.events.cubanmissilecrisis == 1) || (this.game.player == 2 && this.game.state.events.cubanmissilecrisis == 2)) {
      let can_remove = 0;
      if (this.game.player == 1 && this.countries['cuba'].ussr >= 2) { can_remove = 1; }
      if (this.game.player == 2 && this.countries['turkey'].us >= 2) { can_remove = 1; }
      if (this.game.player == 2 && this.countries['westgermany'].us >= 2) { can_remove = 1; }
      if (can_remove == 1) {
        playable_cards.push("cancel cuban missile crisis");
      }
    }

    //
    // Bear Trap and Quagmire
    //
    // headline check ensures that Quagmire does not trigger if headlined and the US triggers a card pull
    //
    if (this.game.state.headline == 0 && ((this.game.player == 1 && this.game.state.events.beartrap == 1) || (this.game.player == 2 && this.game.state.events.quagmire == 1)) ) {

      //
      // do we have cards to select
      //
      let cards_available = 0;
      let scoring_cards_available = 0;

      //
      // how many turns left?
      //
      let rounds_in_turn = 6;
      if (this.game.state.round > 3) { rounds_in_turn = 7; }
      let moves_remaining = rounds_in_turn - this.game.state.turn_in_round;


      if (this.game.state.events.beartrap == 1 && this.game.player == 1) {
        user_message = "Select a card for Bear Trap: ";
      } else {
        user_message = "Select a card for Quagmire: ";
      }

      for (i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) >= 2 && this.game.deck[0].hand[i] != "china") {
          cards_available++;
        }
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; }
        }
      }

      //
      // handle missile envy if needed
      //
      if (this.game.state.events.missile_envy == this.game.player) {
        if (this.modifyOps(2, "missileenvy", this.game.player, 0) >= 2) {
    playable_cards = [];
    playable_cards.push("missileenvy");
        }
      } else {

        //
        // do we have any cards to play?
        //
        if (cards_available > 0 && scoring_cards_available <= moves_remaining) {
          this.updateStatus(user_message);
          playable_cards = [];
          for (i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
              if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) >= 2 && this.game.deck[0].hand[i] != "china") {
                playable_cards.push(this.game.deck[0].hand[i]);
              }
            }
          }
        } else {
          if (scoring_cards_available > 0) {
            if (this.game.state.events.beartrap == 1) {
              user_message = "Bear Trap restricts you to Scoring Cards: ";
            } else {
              user_message = "Quagmire restricts you to Scoring Cards: ";
            }
            for (i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
                if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
                  playable_cards.push(this.game.deck[0].hand[i]);
                }
              }
            }
          } else {
            if (this.game.state.events.beartrap == 1) {
              user_message = "No cards playable due to Bear Trap: ";
            } else {
              user_message = "No cards playable due to Quagmire: ";
            }
            playable_cards = [];
            playable_cards.push("skip turn");
          }
        }
      }
    }

    //
    // display the cards
    //
    if (playable_cards.length > 0) {
      this.updateStatusAndListCards(user_message, playable_cards);
    } else {
      this.updateStatusAndListCards(user_message, this.game.deck[0].hand);
    }


    let twilight_self = this;

    if (this.game.state.events.unintervention != 1 && selected_card != "grainsales") {
      this.moves = [];
    }

    twilight_self.playerFinishedPlacingInfluence();

    //
    // cannot play if no cards remain
    //
    if (selected_card == null && this.game.deck[0].hand.length == 0) {
      this.updateStatus("Skipping turn... no cards left to play");
      this.updateLog("Skipping turn... no cards left to play");
      this.addMove("resolve\tplay");
      this.endTurn();
      return;
    }


    twilight_self.addShowCardEvents(function(card) {

      card = $(card).attr("id");

      //
      // mobile clients have sanity check on card check
      //
      if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
        twilight_self.mobileCardSelect(card, player, function() {

          // cancel missile envy if played appropriately
          if (twilight_self.game.state.events.missile_envy != 0 && twilight_self.game.state.events.missileenvy != 0 && card == "missileenvy") {
            twilight_self.game.state.events.missile_envy = 0;
            twilight_self.game.state.events.missileenvy = 0;
          }

          twilight_self.playerTurnCardSelected(card, player);
        }, "select");
        return;
      }


      // cancel missile envy if played appropriately
      if (twilight_self.game.state.events.missile_envy != 0 && twilight_self.game.state.events.missileenvy != 0 && card == "missileenvy") {
        twilight_self.game.state.events.missile_envy = 0;
        twilight_self.game.state.events.missileenvy = 0;
      }

      twilight_self.playerTurnCardSelected(card, player);

    });

  }


  playerTurnCardSelected(card, player) {

    let twilight_self = this;
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; }

      //
      // Skip Turn
      //
      if (card === "skipturn") {
        twilight_self.hideCard(card);
        twilight_self.addMove("resolve\tplay");
        twilight_self.addMove("notify\t"+player+" has no cards playable.");
        twilight_self.endTurn();
        return 0;
      }


      //
      // warn if user is leaving a scoring card in hand
      //
      let scoring_cards_available = 0;
      let rounds_in_turn = 6;
      if (twilight_self.game.state.round > 3) { rounds_in_turn = 7; }
      let moves_remaining = rounds_in_turn - twilight_self.game.state.turn_in_round;

      for (i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
          if (twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; }
        }
      }

      if (scoring_cards_available > 0 && scoring_cards_available > moves_remaining && twilight_self.game.deck[0].cards[card].scoring == 0) {
        let c = confirm("Holding a scoring card at the end of the turn will lose you the game. Still play this card?");
        if (c) {} else { return; }
      }

      //
      // Quagmire / Bear Trap
      //
      if (twilight_self.game.state.headline == 0 && (twilight_self.game.state.events.quagmire == 1 && twilight_self.game.player == 2) || (twilight_self.game.state.events.beartrap == 1 && twilight_self.game.player == 1) ) {

        //
        // scoring cards score, not get discarded
        //
        if (twilight_self.game.deck[0].cards[card].scoring == 0) {
          twilight_self.hideCard(card);
          twilight_self.removeCardFromHand(card);
          twilight_self.addMove("resolve\tplay");
          twilight_self.addMove("quagmire\t"+player+"\t"+card);
          twilight_self.addMove("discard\t"+player+"\t"+card);
          twilight_self.endTurn();
          return 0;
        }
      }


      //
      // Cuban Missile Crisis
      //
      if (card == "cancelcubanmissilecrisis") {
        if (twilight_self.game.player == 1) {
          twilight_self.removeInfluence("cuba", 2, "ussr");
          twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
          twilight_self.addMove("unlimit\tcmc");
          twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
          twilight_self.endTurn();
        } else {

          let user_message = "Select country from which to remove influence:<p></p><ul>";
          if (twilight_self.countries['turkey'].us >= 2) {
            user_message += '<li class="card showcard" id="turkey">Turkey</li>';
          }
          if (twilight_self.countries['westgermany'].us >= 2) {
            user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
          }
          user_message += '</ul>';
          twilight_self.updateStatus(user_message);

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 === "turkey") {
              twilight_self.removeInfluence("turkey", 2, "us");
              twilight_self.addMove("remove\tus\tus\tturkey\t2");
              twilight_self.addMove("unlimit\tcmc");
              twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
              twilight_self.endTurn();
            }
            if (action2 === "westgermany") {
              twilight_self.removeInfluence("westgermany", 2, "us");
              twilight_self.addMove("remove\tus\tus\twestgermany\t2");
              twilight_self.addMove("unlimit\tcmc");
              twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
            }
          });

        }
        return 0;
      }

      //
      // The China Card
      //
      twilight_self.hideCard(card);
      twilight_self.addMove("resolve\tplay");
      twilight_self.addMove("discard\t"+player+"\t"+card);

      if (card == "china") {
        twilight_self.addMove("unlimit\tchina");
        twilight_self.game.state.events.china_card_in_play = 1;
      }

      //
      // WWBY triggers on non-headlines, so Grain Sales headline shdn't trigger
      //
      if (twilight_self.game.state.events.wwby == 1 && twilight_self.game.state.headline == 0) {
        if (player == "us") {
          if (card != "unintervention") {
            twilight_self.game.state.events.wwby_triggers = 1;
          }
          twilight_self.game.state.events.wwby = 0;
        }
      }


      if (twilight_self.game.deck[0].cards[card].scoring == 1) {
        let status_header = `Playing ${twilight_self.game.deck[0].cards[card].name}:`;
        let html = ``;

        // true means we want to include the back button in our functionality
        if (this.game.state.back_button_cancelled == 1) {
          html += twilight_self.formatStatusHeader(status_header, false);
        } else {
          html += twilight_self.formatStatusHeader(status_header, true);
        }
        html += `<p></p><ul><li class="card" id="event">score region</li></ul>`
        twilight_self.updateStatus(html);
      } else {

        let ops = twilight_self.modifyOps(twilight_self.game.deck[0].cards[card].ops, card, twilight_self.game.player, 0);


        //
        // is space race an option
        //
        let sre = 1;
        if (twilight_self.game.player == 1 && twilight_self.game.state.space_race_ussr_counter >= 1) {
          if (twilight_self.game.state.animal_in_space == "ussr" && twilight_self.game.state.space_race_ussr_counter < 2) {} else {
            sre = 0;
          }
        }
        if (twilight_self.game.player == 2 && twilight_self.game.state.space_race_us_counter >= 1) {
          if (twilight_self.game.state.animal_in_space == "us" && twilight_self.game.state.space_race_us_counter < 2) {} else {
            sre = 0;
          }
        }


        let announcement = "";

        if (twilight_self.game.state.back_button_cancelled == 1) {
          announcement = twilight_self.formatStatusHeader(
            `<span>${player.toUpperCase()}</span> <span>playing</span> <span>${twilight_self.game.deck[0].cards[card].name}</span>`,
            false
          );
        } else {
          announcement = twilight_self.formatStatusHeader(
            `<span>${player.toUpperCase()}</span> <span>playing</span> <span>${twilight_self.game.deck[0].cards[card].name}</span>`,
            true
          );

        }
        announcement += `<p></p><ul>`;

        //
        // cannot play China card or Missile Envy (forced) for event
        //
        // cannot event UN Intervention w/o the opponent card in hand
        //
        let can_play_event = 1;
        if (card == "unintervention") {
          let opponent_event_in_hand = 0;
          for (let b = 0; b < twilight_self.game.deck[0].hand.length; b++) {
            let tmpc = twilight_self.game.deck[0].hand[b];
            if (tmpc != "china") {
              if (twilight_self.game.player == 1) {
                if (twilight_self.game.deck[0].cards[tmpc].player === "us") { opponent_event_in_hand = 1; }
              } else {
                if (twilight_self.game.deck[0].cards[tmpc].player === "ussr") { opponent_event_in_hand = 1; }
              }
            }
          }
          if (opponent_event_in_hand == 0) { can_play_event = 0; }
        }
        if (card == "china") { can_play_event = 0; }
        if (card == "missileenvy" && is_this_missile_envy_noneventable == 1) { can_play_event = 0; }

        //
        // cannot play event of opponent card (usability fix)
        //
        if (twilight_self.game.deck[0].cards[card].player == opponent) { can_play_event = 0; }

        if (can_play_event == 1) { announcement += '<li class="card" id="event">play event</li>'; }

        announcement += '<li class="card" id="ops">play ops</li>';

        if (sre == 1) {
          if (player == "ussr" && ops > 1) {
            if (twilight_self.game.state.space_race_ussr < 4 && ops > 1) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_ussr >= 4 && twilight_self.game.state.space_race_ussr < 7 && ops > 2) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_ussr == 7 && ops > 3) {
              announcement += '<li class="card" id="space">space race</li>';
              }
          }
          if (player == "us" && ops > 1) {
            if (twilight_self.game.state.space_race_us < 4 && ops > 1) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_us >= 4 && twilight_self.game.state.space_race_us < 7 && ops > 2) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_us == 7 && ops > 3) {
              announcement += '<li class="card" id="space">space race</li>';
              }
          }
        } else {
        }

        //
        // cancel cuban missile crisis
        //
        if ((twilight_self.game.player == 1 && twilight_self.game.state.events.cubanmissilecrisis == 1) || (twilight_self.game.player == 2 && twilight_self.game.state.events.cubanmissilecrisis == 2)) {
          let can_remove = 0;
          if (twilight_self.game.player == 1 && twilight_self.countries['cuba'].ussr >= 2) { can_remove = 1; }
          if (twilight_self.game.player == 2 && twilight_self.countries['turkey'].us >= 2) { can_remove = 1; }
          if (can_remove == 1) {
            announcement += '<li class="card" id="cancel_cmc">cancel cuban missile crisis</li>';
          }
        }

        twilight_self.updateStatus(announcement);
      }

      $('#back_button').off();
      $('#back_button').on('click', () => {
        this.playerTurn();
      });

      $('.card').off();
      $('.card').on('click', function() {

        let action = $(this).attr("id");
        $('.card').off();

        //
        // Cuban Missile Crisis
        //
        if (action == "cancel_cmc") {
          this.moves = [];
          if (twilight_self.game.player == 1) {
            twilight_self.removeInfluence("cuba", 2, "ussr");
            twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
            twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
            twilight_self.addMove("unlimit\tcmc");
            twilight_self.endTurn();
          } else {

            let user_message = "Select country from which to remove influence:<p></p><ul>";
            if (twilight_self.countries['turkey'].us >= 2) {
              user_message += '<li class="card showcard" id="turkey">Turkey</li>';
            }
            if (twilight_self.countries['westgermany'].us >= 2) {
              user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
            }
            user_message += '</ul>';
            twilight_self.updateStatus(user_message);

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              if (action2 === "turkey") {
                twilight_self.removeInfluence("turkey", 2, "us");
                twilight_self.addMove("remove\tus\tus\tturkey\t2");
                twilight_self.addMove("unlimit\tcmc");
                twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
              }
              if (action2 === "westgermany") {
                twilight_self.removeInfluence("westgermany", 2, "us");
                twilight_self.addMove("remove\tus\tus\twestgermany\t2");
                twilight_self.addMove("unlimit\tcmc");
                twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                  twilight_self.endTurn();
              }
            });
          }
          return;
        }


        if (action == "event") {

          //
          // sanity check on opponent event choice
          //
          if (twilight_self.game.deck[0].cards[card].player != "both" && twilight_self.game.deck[0].cards[card].player != player) {

            let fr =  "<span>This is your opponent's event. Are you sure you wish to play it for the event instead of the OPS?</span><p></p><ul>";
                fr += '<li class="card" id="playevent">play event</li>';
                fr += '<li class="card" id="pickagain">pick again</li>';
                fr += '</ul>';

            twilight_self.updateStatus(fr);

            $('.card').off();
            $('.card').on('click', function() {

              let action = $(this).attr("id");
              $('.card').off();

              if (action == "playevent") {
                twilight_self.playerTriggerEvent(player, card);
                return;
              }
              if (action == "pickagain") {
                twilight_self.playerTurn(original_selected_card);
                return;
              }

            });

            return;
          }

          // our event or both
          //
          if (twilight_self.dont_show_confirm == 0) {
            let fr =
              `
              Confirm you want to play this event
              <ul>
              <li class="card" id="playevent">play event</li>
              <li class="card" id="pickagain">pick again</li>
              </ul>
              <input type="checkbox" name="dontshowme" value="true" style="width: 20px;height: 1.5em;"> Don't show me this again
              `;

            twilight_self.updateStatus(fr);

            $('.card').off();
            $('.card').on('click', function() {

              let action = $(this).attr("id");
              $('.card').off();

              if (action == "playevent") {
                twilight_self.playerTriggerEvent(player, card);
                return;
              }
              if (action == "pickagain") {
                twilight_self.playerTurn(original_selected_card);
                return;
              }

            });

            $('input:checkbox').change(function() {
              if ($(this).is(':checked')) {
                twilight_self.dont_show_confirm = 1;
                twilight_self.saveGamePreference('dont_show_confirm', 1);
              }
            })

            return;
          }

          // play normally when not confirmed
          twilight_self.playerTriggerEvent(player, card);
          return;

        }

        if (action == "ops") {

          if (twilight_self.game.deck[0].cards[card].player == opponent) {
            if (twilight_self.game.state.events.unintervention == 1) {

              //
              // Flower Power
              //
              if (twilight_self.game.state.events.flowerpower == 1) {
                if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
                  if (player === "us") {
                    twilight_self.addMove("notify\tFlower Power triggered by "+card);
                    twilight_self.addMove("vp\tussr\t2\t1");
                  }
                }
              }

              // resolve added
              twilight_self.addMove("notify\t"+player.toUpperCase()+" plays "+card+" with UN Intervention");
              twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
              twilight_self.removeCardFromHand(card);
              twilight_self.endTurn();
              return;

            } else {

              //
              // Flower Power
              //
              if (twilight_self.game.state.events.flowerpower == 1) {
                if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
                  if (player === "us") {
                    twilight_self.addMove("notify\tFlower Power triggered by "+card);
                    twilight_self.addMove("vp\tussr\t2\t1");
                  }
                }
              }

              let html = twilight_self.formatStatusHeader('Playing opponent card:', true);
                  html += '<p></p><ul><li class="card" id="before">event before ops</li><li class="card" id="after">event after ops</li></ul>';
              twilight_self.updateStatus(html);
              twilight_self.bindBackButtonFunction(() => {
          twilight_self.playerTurnCardSelected(card, player);
              });

              $('.card').off();
              $('.card').on('click', function() {

                let action2 = $(this).attr("id");

                twilight_self.game.state.event_before_ops = 0;
                twilight_self.game.state.event_name = "";

                if (action2 === "before") {
                  twilight_self.game.state.event_before_ops = 1;
                  twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
                  twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
                  twilight_self.addMove("event\t"+player+"\t"+card);
                  twilight_self.removeCardFromHand(card);
                  twilight_self.endTurn();
                  return;
                }
                if (action2 === "after") {
                  twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
                  twilight_self.addMove("event\t"+player+"\t"+card);
                  twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
                  twilight_self.removeCardFromHand(card);
                  twilight_self.endTurn();
                  return;
                }

              });
            }

            return;

          } else {

            twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
            if (card == "china") { twilight_self.addMove("limit\tchina"); }
            twilight_self.removeCardFromHand(card);

            //
            // Flower Power
            //
            if (twilight_self.game.state.events.flowerpower == 1) {
              if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
                if (player === "us") {
                  twilight_self.addMove("notify\tFlower Power triggered by "+card);
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
              }
            }

            twilight_self.endTurn();
            return;

          }
        }

        if (action == "space") {
          twilight_self.addMove("space\t"+player+"\t"+card);
          twilight_self.removeCardFromHand(card);
          twilight_self.endTurn();
          return;
        }

        twilight_self.updateStatus("");

      });

  }


  playerTriggerEvent(player, card) {

    let twilight_self = this;

    //
    // Flower Power
    //
    if (twilight_self.game.state.events.flowerpower == 1) {
      if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
        if (player === "us") {
          twilight_self.addMove("notify\tFlower Power triggered by "+card);
          twilight_self.addMove("vp\tussr\t2\t1");
        }
      }
    }

    twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
    twilight_self.addMove("event\t"+player+"\t"+card);
    twilight_self.removeCardFromHand(card);


    //
    // Our Man in Tehran -- check if reshuffle is needed
    //
    if (card == "tehran") {

      //
      // reshuffle needed before event
      //
      if (5 > twilight_self.game.deck[0].crypt.length) {

        let discarded_cards = twilight_self.returnDiscardedCards();
        if (Object.keys(discarded_cards).length > 0) {

          //
          // shuffle in discarded cards -- eliminate SHUFFLE here as unnecessary
          //
          twilight_self.addMove("DECKRESTORE\t1");
          twilight_self.addMove("DECKENCRYPT\t1\t2");
          twilight_self.addMove("DECKENCRYPT\t1\t1");
          twilight_self.addMove("DECKXOR\t1\t2");
          twilight_self.addMove("DECKXOR\t1\t1");
          twilight_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
          twilight_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
          twilight_self.addMove("DECKBACKUP\t1");
          twilight_self.updateLog("cards remaining: " + twilight_self.game.deck[0].crypt.length);
          twilight_self.updateLog("Shuffling discarded cards back into the deck...");

        }
      }
    }

    twilight_self.endTurn();
    return;

  }











  /////////////////////
  // Place Influence //
  /////////////////////
  uneventOpponentControlledCountries(player, card) {

    let bonus_regions = this.returnArrayOfRegionBonuses(card);

    for (var i in this.countries) {
      if (player == "us") {
        if (this.isControlled("ussr", i) == 1) {

          //
          // allow bonus regions to break control with bonuses
          //
          let bonus_region_applies = 0;
          for (let z = 0; z < bonus_regions.length; z++) {
            if (this.countries[i].region.indexOf(bonus_regions[z]) > -1) { bonus_region_applies = 1; }
          }

          if (bonus_region_applies == 1) {
          } else {
            this.countries[i].place = 0;
            let divname = '#'+i;
            $(divname).off();
          }

        }
      }

      if (player == "ussr") {
        if (this.isControlled("us", i) == 1) {

          //
          // allow bonus regions to break control with bonuses
          //
          let bonus_region_applies = 0;
          for (let z = 0; z < bonus_regions.length; z++) {
            if (this.countries[i].region.indexOf(bonus_regions[z]) > -1) { bonus_region_applies = 1; }
          }

          if (bonus_region_applies == 1) {
          } else {
            this.countries[i].place = 0;
            let divname = '#'+i;
            $(divname).off();
          }

        }
      }
    }

  }

  prePlayerPlaceInfluence(player) {

    //
    // reset
    //
    for (var i in this.pountries) { this.game.countries[i].place = 0; }

    //
    // ussr
    //
    if (player == "ussr") {

      this.game.countries['finland'].place = 1;
      this.game.countries['poland'].place = 1;
      this.game.countries['romania'].place = 1;
      this.game.countries['afghanistan'].place = 1;
      this.game.countries['northkorea'].place = 1;

      for (var i in this.game.countries) {
        if (this.game.countries[i].ussr > 0) {

          let place_in_country = 1;

          //
          // skip argentina if only has 1 and ironlady_before_ops
          //
          if (this.game.state.ironlady_before_ops == 1 && this.game.countries['chile'].ussr < 1 && this.game.countries['uruguay'].ussr < 1 && this.game.countries['paraguay'].ussr < 1 && this.game.countries['argentina'].ussr == 1 && i === "argentina") { place_in_country = 0; }

          this.game.countries[i].place = place_in_country;

          if (place_in_country == 1) {
            for (let n = 0; n < this.game.countries[i].neighbours.length; n++) {
              let j = this.game.countries[i].neighbours[n];
              this.game.countries[j].place = 1;
            }
          }

        }
      }
    }

    //
    // us
    //
    if (player == "us") {

      this.game.countries['canada'].place = 1;
      this.game.countries['mexico'].place = 1;
      this.game.countries['cuba'].place = 1;
      this.game.countries['japan'].place = 1;

      for (var i in this.game.countries) {
        if (this.game.countries[i].us > 0) {
          this.game.countries[i].place = 1;
          for (let n = 0; n < this.game.countries[i].neighbours.length; n++) {
            let j = this.game.countries[i].neighbours[n];
            this.game.countries[j].place = 1;
          }
        }
      }
    }

  }



  playerPlaceInitialInfluence(player) {

    let twilight_self = this;

    if (player == "ussr") {

      twilight_self.addMove("resolve\tplacement");

      this.updateStatusAndListCards(`You are the USSR. Place six additional influence in Eastern Europe.`);


      var placeable = [];
      placeable.push("finland");
      placeable.push("eastgermany");
      placeable.push("poland");
      placeable.push("austria");
      placeable.push("czechoslovakia");
      placeable.push("hungary");
      placeable.push("romania");
      placeable.push("yugoslavia");
      placeable.push("bulgaria");

      let ops_to_place = 6;

      for (let i = 0; i < placeable.length; i++) {

        this.game.countries[placeable[i]].place = 1;

        let divname = "#"+placeable[i];

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          if (twilight_self.countries[countryname].place == 1) {
            twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "ussr");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          } else {
            // twilight_self.displayModal("you cannot place there...: " + j + " influence left");
            twilight_self.displayModal("Invalid Influence Placement", `You cannot place there...: ${j} influence left`);
          }
        });
      }
    }


    if (player == "us") {

      twilight_self.addMove("resolve\tplacement");

      this.updateStatusAndListCards(`You are the US. Place seven additional influence in Western Europe.`)

      var placeable = [];

      placeable.push("canada");
      placeable.push("uk");
      placeable.push("benelux");
      placeable.push("france");
      placeable.push("italy");
      placeable.push("westgermany");
      placeable.push("greece");
      placeable.push("spain");
      placeable.push("turkey");
      placeable.push("austria");
      placeable.push("norway");
      placeable.push("denmark");
      placeable.push("sweden");
      placeable.push("finland");

      var ops_to_place = 7;

      for (let i = 0; i < placeable.length; i++) {
        this.game.countries[placeable[i]].place = 1;

        let divname = "#"+placeable[i];

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          if (twilight_self.countries[countryname].place == 1) {
            twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "us");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          } else {
            // twilight_self.displayModal("you cannot place there...: " + j + " influence left");
            twilight_self.displayModal("Invalid Influence Placement", `You cannot place there...: ${j} influence left`);
          }
        });
      }
    }
  }



  playerPlaceBonusInfluence(player, bonus) {

    let twilight_self = this;

    if (player == "ussr") {

      twilight_self.addMove("resolve\tplacement_bonus");

      this.updateStatusAndListCards(`You are the USSR. Place</span> ${bonus} <span>additional influence in countries with existing Soviet influence.`);

      let ops_to_place = bonus;

      for (var i in this.game.countries) {
        if (this.game.countries[i].ussr > 0) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let countryname = $(this).attr('id');

            twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "ussr");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          });
        }
      }
    }



    if (player == "us") {

      twilight_self.addMove("resolve\tplacement_bonus");

      this.updateStatusAndListCards(`You are the US. Place</span> ${bonus} <span>additional influence in countries with existing American influence.`);

      let ops_to_place = bonus;

      for (var i in this.game.countries) {
        if (this.game.countries[i].us > 0) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let countryname = $(this).attr('id');

            twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "us");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          });
        }
      }
    }
  }









  /////////////////////
  // PLACE INFLUENCE //
  /////////////////////
  removeCardFromHand(card) {

    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] == card) {
        this.game.deck[0].hand.splice(i, 1);
      }
    }

  }
  removeInfluence(country, inf, player, mycallback=null) {

    if (player == "us") {
      this.countries[country].us = parseInt(this.countries[country].us) - parseInt(inf);
      if (this.countries[country].us < 0) { this.countries[country].us = 0; };
      this.showInfluence(country, "ussr");
    } else {
      this.countries[country].ussr = parseInt(this.countries[country].ussr) - parseInt(inf);
      if (this.countries[country].ussr < 0) { this.countries[country].ussr = 0; };
      this.showInfluence(country, "us");
    }

    this.updateLog(player.toUpperCase() + "</span> <span>removes </span> " + inf + "<span> from</span> <span>" + this.countries[country].name);

    this.showInfluence(country, player, mycallback);

  }

  placeInfluence(country, inf, player, mycallback=null) {

    if (player == "us") {
      this.countries[country].us = parseInt(this.countries[country].us) + parseInt(inf);
    } else {
      this.countries[country].ussr = parseInt(this.countries[country].ussr) + parseInt(inf);
    }

    this.updateLog(player.toUpperCase() + "</span> <span>places</span> " + inf + " <span>in</span> <span>" + this.countries[country].name);

    this.showInfluence(country, player, mycallback);

  }


  showInfluence(country, player, mycallback=null) {

    let obj_us    = "#"+country+ " > .us";
    let obj_ussr = "#"+country+ " > .ussr";

    let us_i   = parseInt(this.countries[country].us);
    let ussr_i = parseInt(this.countries[country].ussr);

    let has_control = 0;

    if (player == "us") {
      let diff = us_i - ussr_i;
      if (diff > 0 && diff >= this.countries[country].control) {
        has_control = 1;
      }
    } else {
      let diff = ussr_i - us_i;
      if (diff > 0 && diff >= this.countries[country].control) {
        has_control = 1;
      }
    }


    //
    // update non-player if control broken
    //
    if (player == "us") {
      if (this.isControlled("ussr", country) == 0) {
        if (this.countries[country].ussr > 0) {
          $(obj_ussr).html('<div class="ussr_uncontrol">'+ussr_i+'</div>');
        }
      } else {
        if (this.isControlled("us", country) == 1) {
          $(obj_us).html('<div class="us_control">'+us_i+'</div>');
        }
      }
    } else {
      if (this.isControlled("us", country) == 0) {
        if (this.countries[country].us > 0) {
          $(obj_us).html('<div class="us_uncontrol">'+us_i+'</div>');
        }
      } else {
        if (this.isControlled("ussr", country) == 1) {
          $(obj_ussr).html('<div class="ussr_control">'+ussr_i+'</div>');
        }
      }
    }


    //
    // update HTML
    //
    if (has_control == 1) {
      if (player == "us") {
        $(obj_us).html('<div class="us_control">'+us_i+'</div>');
      } else {
        $(obj_ussr).html('<div class="ussr_control">'+ussr_i+'</div>');
      }
    } else {
      if (player == "us") {
        if (us_i == 0) {
          $(obj_us).html('');
        } else {
          $(obj_us).html('<div class="us_uncontrol">'+us_i+'</div>');
        }
      } else {
        if (ussr_i == 0) {
          $(obj_ussr).html('');
        } else {
          $(obj_ussr).html('<div class="ussr_uncontrol">'+ussr_i+'</div>');
        }
      }
    }

    $('.us_control').css('height', this.scale(100)+"px");
    $('.us_uncontrol').css('height', this.scale(100)+"px");
    $('.ussr_control').css('height', this.scale(100)+"px");
    $('.ussr_uncontrol').css('height', this.scale(100)+"px");

    $('.us_control').css('font-size', this.scale(100)+"px");
    $('.us_uncontrol').css('font-size', this.scale(100)+"px");
    $('.ussr_control').css('font-size', this.scale(100)+"px");
    $('.ussr_uncontrol').css('font-size', this.scale(100)+"px");

    //
    // adjust screen ratio
    //
    $('.country').css('width', this.scale(202)+"px");
    $('.us').css('width', this.scale(100)+"px");
    $('.ussr').css('width', this.scale(100)+"px");
    $('.us').css('height', this.scale(100)+"px");
    $('.ussr').css('height', this.scale(100)+"px");

    //
    // update game state
    //
    this.game.countries = this.countries;

    if (mycallback != null) { mycallback(country, player); }

  }








  playerRealign(player, card, mycallback=null) {

    // reset off
    this.playerFinishedPlacingInfluence();

    var twilight_self = this;
    var valid_target = 0;

    // all countries can be realigned
    for (var i in this.countries) {

      let countryname = i;

      valid_target = 1;


      //
      // Can Only Realign Countries with Opponent Influence
      //
      if (twilight_self.game.player == 1) {
        if (twilight_self.countries[countryname].us < 1) {
          valid_target = 0;
        }
      } else {
        if (twilight_self.countries[countryname].ussr < 1) {
          valid_target = 0;
        }
      }


      //
      // Region Restrictions
      //
      if (twilight_self.game.state.limit_region.indexOf(twilight_self.countries[countryname].region) > -1) {
        valid_target = 0;
      }

      //
      // DEFCON restrictions
      //
      if (twilight_self.game.state.limit_ignoredefcon == 0) {
        if (twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.defcon < 5) {
          valid_target = 0;
        }
        if (twilight_self.countries[countryname].region == "asia" && twilight_self.game.state.defcon < 4) {
          valid_target = 0;
        }
        if (twilight_self.countries[countryname].region == "seasia" && twilight_self.game.state.defcon < 4) {
          valid_target = 0;
        }
        if (twilight_self.countries[countryname].region == "mideast" && twilight_self.game.state.defcon < 3) {
          valid_target = 0;
        }
      }

      //
      // Junta
      //
      if (card == "junta" && (this.countries[i].region != "camerica" && this.countries[i].region != "samerica")) {
        valid_target = 0;
      }

      let divname      = '#'+i;

      if (valid_target == 1) {

        $(divname).off();
        $(divname).on('click', function() {

          let c = $(this).attr('id');

          //
          // US / Japan Alliance
          //
          if (twilight_self.game.state.events.usjapan == 1 && c == "japan" && this.game.player == 1) {
            // twilight_self.displayModal("US / Japan Alliance prevents realignments in Japan");
            twilight_self.displayModal("Invalid Realignment", `US / Japan Alliance prevents realignments in Japan`);
            valid_target = 0;
          }

          //
          // vietnam revolts and china card bonuses
          //
          if (twilight_self.countries[c].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; }
          if (twilight_self.countries[c].region !== "seasia" && twilight_self.countries[c].region !== "asia") { twilight_self.game.state.events.china_card_eligible = 0; }

          var result = twilight_self.playRealign(c);
          twilight_self.addMove("realign\t"+player+"\t"+c);
          mycallback();
        });

      } else {

        $(divname).off();
        $(divname).on('click', function() {
          // twilight_self.displayModal("Invalid Target");
          twilight_self.displayModal("Invalid Target");
        });

      }
    }
  }

  playerPlaceInfluence(player, mycallback=null) {

    // reset off
    this.playerFinishedPlacingInfluence();

    var twilight_self = this;

    for (var i in this.countries) {

      let countryname  = i;
      let divname      = '#'+i;

      let restricted_country = 0;

      //
      // Chernobyl
      //
      if (this.game.player == 1 && this.game.state.events.chernobyl != "") {
        if (this.countries[i].region == this.game.state.events.chernobyl) { restricted_country = 1;

        }
      }

      if (this.game.state.limit_region.indexOf(this.countries[i].region) > -1) { restricted_country = 1; }

      if (restricted_country == 1) {

  alert("restricted COUNTRY == 1: " + divname);

        $(divname).off();
        $(divname).on('click', function() {
          twilight_self.displayModal("Invalid Target");
        });

      } else {

        if (player == "us") {

          $(divname).off();
          $(divname).on('click', function() {

            let countryname = $(this).attr('id');

            if (twilight_self.countries[countryname].place == 1) {

              //
              // vietnam revolts and china card
              //
              if (twilight_self.countries[countryname].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; }
              if (twilight_self.countries[countryname].region.indexOf("asia") < 0) { twilight_self.game.state.events.china_card_eligible = 0; }

              if (twilight_self.isControlled("ussr", countryname) == 1) { twilight_self.game.break_control = 1; }

              //
              // permit cuban missile crisis removal after placement
              //
              if (twilight_self.game.state.events.cubanmissilecrisis == 2) {
                if (countryname === "turkey" || countryname === "westgermany") {
                  if (twilight_self.countries[countryname].us >= 1) {

                    //
                    // allow player to remove CMC
                    //
                    if (twilight_self.app.BROWSER == 1) {

                      let removeinf = confirm("You are placing 1 influence in "+twilight_self.countries[countryname].name+". Once this is done, do you want to cancel the Cuban Missile Crisis by removing 2 influence in "+twilight_self.countries[countryname].name+"?");
                      if (removeinf) {

                        if (countryname === "turkey") {
                          twilight_self.removeInfluence("turkey", 2, "us");
                          twilight_self.addMove("remove\tus\tus\tturkey\t2");
                          twilight_self.addMove("unlimit\tcmc");
                          twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                        }
                        if (countryname === "westgermany") {
                          twilight_self.removeInfluence("westgermany", 2, "us");
                          twilight_self.addMove("remove\tus\tus\twestgermany\t2");
                          twilight_self.addMove("unlimit\tcmc");
                          twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                        }
                      }
                    }
                  }
                }
              }

              twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "us", mycallback);

            } else {
              twilight_self.displayModal("you cannot place there...");
              return;
            }
          });
        } else {

          $(divname).off();
          $(divname).on('click', function() {

            let countryname = $(this).attr('id');

            if (twilight_self.countries[countryname].place == 1) {

              //
              // vietnam revolts and china card
              //
              if (twilight_self.countries[countryname].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; }
              if (twilight_self.countries[countryname].region.indexOf("asia") < 0) { twilight_self.game.state.events.china_card_eligible = 0; }
              if (twilight_self.isControlled("us", countryname) == 1) { twilight_self.game.break_control = 1; }

              //
              // permit cuban missile crisis removal after placement
              //
              if (twilight_self.game.state.events.cubanmissilecrisis == 1) {
                if (countryname === "cuba") {
                  if (twilight_self.countries[countryname].ussr >= 1) {

                    //
                    // allow player to remove CMC
                    //
                    if (twilight_self.app.BROWSER == 1) {

                      let removeinf = confirm("You are placing 1 influence in "+twilight_self.countries[countryname].name+". Once this is done, do you want to cancel the Cuban Missile Crisis by removing 2 influence in "+twilight_self.countries[countryname].name+"?");
                      if (removeinf) {

                        if (countryname === "cuba") {
                          twilight_self.removeInfluence("cuba", 2, "ussr");
                          twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
                          twilight_self.addMove("unlimit\tcmc");
                          twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
                        }
                      }
                    }
                  }
                }
              }

              twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "ussr", mycallback);
            } else {
              twilight_self.displayModal("Invalid Target");
              return;
            }
          });
        } // NON RESTRICTED COUNTRY
      }
    }

  }


  playerFinishedPlacingInfluence(player, mycallback=null) {

    for (var i in this.countries) {
      let divname      = '#'+i;
      $(divname).off();
    }

    if (mycallback != null) { mycallback(); }

  }


  playerSpaceCard(card, player) {

    if (player == "ussr") {
      this.game.state.space_race_ussr_counter++;
    } else {
      this.game.state.space_race_us_counter++;
    }

    let roll = this.rollDice(6);

    let successful     = 0;
    let next_box       = 1;

    if (player == "ussr") { next_box = this.game.state.space_race_ussr+1; }
    if (player == "us") { next_box = this.game.state.space_race_us+1; }

    if (next_box == 1) { if (roll < 4) { successful = 1; } }
    if (next_box == 2) { if (roll < 5) { successful = 1; } }
    if (next_box == 3) { if (roll < 4) { successful = 1; } }
    if (next_box == 4) { if (roll < 5) { successful = 1; } }
    if (next_box == 5) { if (roll < 4) { successful = 1; } }
    if (next_box == 6) { if (roll < 5) { successful = 1; } }
    if (next_box == 7) { if (roll < 4) { successful = 1; } }
    if (next_box == 8) { if (roll < 2) { successful = 1; } }

    this.updateLog("<span>" + player.toUpperCase() + "</span> <span>attempts space race (rolls</span> " + roll + ")");

    if (successful == 1) {
      this.updateLog("<span>" + player.toUpperCase() + "</span> <span>advances in the Space Race</span>");
      this.advanceSpaceRace(player);
    } else {
      this.updateLog("<span>" + player.toUpperCase() + "</span> <span>fails in the Space Race</span>");
    }

  }




  ///////////
  // COUPS //
  ///////////
  playerCoupCountry(player,  ops, card) {

    var twilight_self = this;

    for (var i in this.countries) {

      let countryname  = i;
      let divname      = '#'+i;

      $(divname).off();
      $(divname).on('click', function() {

        let valid_target = 0;
        let countryname = $(this).attr('id');

        //
        // sanity DEFCON check
        //
        if (twilight_self.game.state.defcon == 2 && twilight_self.game.countries[countryname].bg == 1) {
          if (confirm("Are you sure you wish to coup a Battleground State? (DEFCON is 2)")) {
          } else {
            twilight_self.playOps(player, ops, card);
            return;
          }
        }

        //
        // sanity Cuban Missile Crisis check
        //
        if (twilight_self.game.state.events.cubanmissilecrisis == 2 && player =="us" ||
            twilight_self.game.state.events.cubanmissilecrisis == 1 && player =="ussr"
        ) {
          if (confirm("Are you sure you wish to coup during the Cuban Missile Crisis?")) {
          } else {
            twilight_self.playOps(player, ops, card);
            return;
          }
        }



        if (player == "us") {
          if (twilight_self.countries[countryname].ussr <= 0) { twilight_self.displayModal("Cannot Coup"); } else { valid_target = 1; }
        } else {
          if (twilight_self.countries[countryname].us <= 0)   { twilight_self.displayModal("Cannot Coup"); } else { valid_target = 1; }
        }

        //
        // Coup Restrictions
        //
        if (twilight_self.game.state.events.usjapan == 1 && countryname == "japan") {
          twilight_self.displayModal("US / Japan Alliance prevents coups in Japan");
          valid_target = 0;
        }
        if (twilight_self.game.state.limit_ignoredefcon == 0) {
          if (twilight_self.game.state.limit_region.indexOf(twilight_self.countries[countryname].region) > -1) {
            twilight_self.displayModal("Invalid Region for this Coup");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.defcon < 5) {
            twilight_self.displayModal("DEFCON prevents coups in Europe");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "asia" && twilight_self.game.state.defcon < 4) {
            twilight_self.displayModal("DEFCON prevents coups in Asia");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "seasia" && twilight_self.game.state.defcon < 4) {
            twilight_self.displayModal("DEFCON prevents coups in Asia");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "mideast" && twilight_self.game.state.defcon < 3) {
            twilight_self.displayModal("DEFCON prevents coups in the Middle-East");
            valid_target = 0;
          }
        }
        if (valid_target == 1 && twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.events.nato == 1) {
          if (twilight_self.isControlled("us", countryname) == 1) {
            if ( (countryname == "westgermany" && twilight_self.game.state.events.nato_westgermany == 0) || (countryname == "france" && twilight_self.game.state.events.nato_france == 0) ) {} else {
              twilight_self.displayModal("NATO prevents coups of US-controlled countries in Europe");
              valid_target = 0;
            }
          }
        }

        if (valid_target == 1) {

          //
          // china card regional bonuses
          //
          if (card == "china" && (twilight_self.game.countries[countryname].region == "asia" || twilight_self.game.countries[countryname].region == "seasia")) {
            twilight_self.updateLog("China bonus OP added to Asia coup...");
            ops++;
          }
          if (player == "ussr" && twilight_self.game.state.events.vietnam_revolts == 1 && twilight_self.game.countries[countryname].region == "seasia") {
            twilight_self.updateLog("Vietnam Revolts bonus OP added to Southeast Asia coup...");
            ops++;
          }

          // twilight_self.displayModal("Coup launched in " + twilight_self.game.countries[countryname].name);
          twilight_self.displayModal("Coup Launched", `Coup launched in ${twilight_self.game.countries[countryname].name}`);
          twilight_self.addMove("coup\t"+player+"\t"+countryname+"\t"+ops+"\t"+card);
          twilight_self.endTurn();
        }

      });
    }
  }




  playCoup(player, countryname, ops, mycallback=null) {

    let roll    = this.rollDice(6);

    //
    // Yuri and Samantha
    //
    if (this.game.state.events.yuri == 1) {
      if (player == "us") {
        this.game.state.vp -= 1;
        this.updateVictoryPoints();
        this.updateLog("USSR gains 1 VP from Yuri and Samantha");
      }
    }

    //
    // Salt Negotiations
    //
    if (this.game.state.events.saltnegotiations == 1) {
      this.updateLog("Salt Negotiations -1 modifier on coups");
      roll--;
    }

    //
    // Latin American Death Squads
    //
    if (this.game.state.events.deathsquads != 0) {
      if (this.game.state.events.deathsquads == 1) {
        if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
          if (player == "ussr") {
            this.updateLog("USSR gets +1 coup bonus");
            this.updateLog("Latin American Death Squads trigger");
            roll++;
          }
        }
        if (player == "us")   {
          this.updateLog("US gets -1 coup penalty");
          this.updateLog("Latin American Death Squads trigger");
          roll--;
        }
      }
      if (this.game.state.events.deathsquads == 2) {
        if (player == "ussr") {
          this.updateLog("USSR gets -1 coup penalty");
          this.updateLog("Latin American Death Squads trigger");
          roll--;
        }
        if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
          if (player == "us")   {
            this.updateLog("US gets +1 coup bonus");
            this.updateLog("Latin American Death Squads trigger");
            roll++;
          }
        }
      }
    }

    let control = this.countries[countryname].control;
    let winning = parseInt(roll) + parseInt(ops) - parseInt(control * 2);

    //
    // Cuban Missile Crisis
    //
    if (player == "ussr" && this.game.state.events.cubanmissilecrisis == 1) {
      this.endGame("us","Cuban Missile Crisis");
      return;
    }
    if (player == "us" && this.game.state.events.cubanmissilecrisis == 2) {
      this.endGame("ussr","Cuban Missile Crisis");
      return;
    }


    if (this.countries[countryname].bg == 1) {
      //
      // Nuclear Submarines
      //
      if (player == "us" && this.game.state.events.nuclearsubs == 1) {} else {
        this.lowerDefcon();
      }
    }


    if (winning > 0) {

      if (this.browser_active == 1) {
        this.displayModal(`COUP SUCCEEDED: ${player.toUpperCase()} rolls ${roll} (${this.game.countries[countryname].name})`);
      }

      this.updateLog(player.toUpperCase() + " <span>rolls</span> " + roll);

      while (winning > 0) {

        if (player == "us") {

          if (this.countries[countryname].ussr > 0) {
            this.removeInfluence(countryname, 1, "ussr");
          } else {
            this.placeInfluence(countryname, 1, "us");
          }
        }

        if (player == "ussr") {
          if (this.countries[countryname].us > 0) {
            this.removeInfluence(countryname, 1, "us");
          } else {
            this.placeInfluence(countryname, 1, "ussr");
          }
        }

        winning--;

      }
    } else {

      if (this.browser_active == 1) {
        this.updateLog(player.toUpperCase() + "</span> <span>rolls</span> " + roll + " <span>(no change)");
      }
    }


    //
    // update country
    //
    this.showInfluence(countryname, player);

    if (mycallback != null) {
      mycallback();
    }

    return;
  }



  playRealign(country) {

    let outcome_determined = 0;

    while (outcome_determined == 0) {

      let bonus_us = 0;
      let bonus_ussr = 0;

      if (this.countries[country].us > this.countries[country].ussr) {
        bonus_us++;
      }
      if (this.countries[country].ussr > this.countries[country].us) {
        bonus_ussr++;
      }
      for (let z = 0; z < this.countries[country].neighbours.length; z++) {
        let racn = this.countries[country].neighbours[z];
        if (this.isControlled("us", racn) == 1) {
          bonus_us++;
        }
        if (this.isControlled("ussr", racn) == 1) {
          bonus_ussr++;
        }
      }

      //
      // handle adjacent influence
      //
      if (country === "mexico") { bonus_us++; }
      if (country === "cuba")   { bonus_us++; }
      if (country === "japan")  { bonus_us++; }
      if (country === "canada") { bonus_us++; }
      if (country === "finland") { bonus_ussr++; }
      if (country === "romania") { bonus_ussr++; }
      if (country === "afghanistan") { bonus_ussr++; }
      if (country === "northkorea") { bonus_ussr++; }


      //
      // Iran-Contra Scandal
      //
      if (this.game.state.events.irancontra == 1) {
        this.updateLog("Iran-Contra Scandal -1 modification on US roll");
        bonus_us--;
      }

      let roll_us   = this.rollDice(6);
      let roll_ussr = this.rollDice(6);

      this.updateLog("<span>US bonus</span> " + bonus_us + " <span>vs. USSR bonus</span> " + bonus_ussr);
      this.updateLog("<span>US roll</span> " + roll_us + " <span>vs. USSR roll</span> " + roll_ussr);

      roll_us   = roll_us + bonus_us;
      roll_ussr = roll_ussr + bonus_ussr;

      if (roll_us > roll_ussr) {
        outcome_determined = 1;
        let diff = roll_us - roll_ussr;
        if (this.countries[country].ussr > 0) {
          if (this.countries[country].ussr < diff) {
            diff = this.countries[country].ussr;
          }
          this.removeInfluence(country, diff, "ussr");
        }
      }
      if (roll_us < roll_ussr) {
        outcome_determined = 1;
        let diff = roll_ussr - roll_us;
        if (this.countries[country].us > 0) {
          if (this.countries[country].us < diff) {
            diff = this.countries[country].us;
          }
          this.removeInfluence(country, diff, "us");
        }
      }
      if (roll_us === roll_ussr) {
        outcome_determined = 1;
      }
    }

    this.showInfluence(country, "us");
    this.showInfluence(country, "ussr");

  }








  ///////////////////////
  // Twilight Specific //
  ///////////////////////
  addMove(mv) {
    this.moves.push(mv);
  }

  removeMove() {
    return this.moves.pop();
  }

  endTurn(nextTarget=0) {

    //
    // cancel back button on subsequent cards picks
    //
    this.game.state.back_button_cancelled = 1;

  console.log("\n\n\nHERE WE ARE AT END TURN: " + JSON.stringify(this.game.queue));

    //
    // show active events
    //
    this.updateEventTiles();


    this.updateStatus("Waiting for information from peers....");

    //
    // remove events from board to prevent "Doug Corley" gameplay
    //
    $(".card").off();
    $(".country").off();

    //
    // we will bury you scores first!
    //
    if (this.game.state.events.wwby_triggers == 1) {
      this.addMove("notify\tWe Will Bury You triggers +3 VP for USSR");
      this.addMove("vp\tussr\t3");
      this.game.state.events.wwby_triggers = 0;
    }

    let cards_in_hand = this.game.deck[0].hand.length;
    for (let z = 0; z < this.game.deck[0].hand.length; z++) {
      if (this.game.deck[0].hand[z] == "china") {
        cards_in_hand--;
      }
    }

    let extra = {};
    this.addMove("setvar\topponent_cards_in_hand\t"+cards_in_hand);
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  console.log("MESSAGE SENT: " + this.game.queue);

  }


  undoMove(move_type, num_of_moves) {

    switch(move_type) {
      case 'place':
        // iterate through the queue and remove past moves
        // cycle through past moves to know what to revert
        for (let i = 0; i < num_of_moves; i++) {
          let last_move = this.removeMove();
          last_move = last_move.split('\t');
          let player = last_move[2];
          let country = last_move[3];
          let ops = last_move[4];

    let opponent = "us";
    if (player == "us") { opponent = "ussr"; }
          this.removeInfluence(country, ops, player);

    //
    // if the country is now enemy controlled, it must have taken an extra move
    // for the play to place there....
    //
          if (this.isControlled(opponent, country) == 1) {
      i++;
          }

        }

        // use this to clear the "resolve ops" move
        this.removeMove();
        return 1;
      default:
        break;
        return 0;
    }
  }


  endGame(winner, method) {

    this.game.over = 1;
    if (winner == "us") { this.game.winner = 2; }
    if (winner == "ussr") { this.game.winner = 1; }

    if (this.game.winner == this.game.player) {
      //
      // share wonderful news
      //
      this.game.over = 0;
      this.resignGame();
    }

    if (this.browser_active == 1) {
      this.displayModal("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
      this.updateStatus("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
    }
  }




  endRound() {

    this.game.state.round++;
    this.game.state.turn 		= 0;
    this.game.state.turn_in_round = 0;
    this.game.state.move 		= 0;

    //
    // game over if scoring card is held
    //
    if (this.game.state.round > 1) {
      for (let i = 0 ; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
          let player = "us";
          let winner = "ussr";
          if (this.game.player == 1) { player = "ussr"; winner = "us"; this.game.winner = 2; }
          this.resignGame(player.toUpperCase() + " held scoring card");
          this.endGame(winner, "opponent held scoring card");
        }
      }
    }


    //
    // calculate milops
    //
    if (this.game.state.round > 1) {
      let milops_needed = this.game.state.defcon;
      let ussr_milops_deficit = (this.game.state.defcon-this.game.state.milops_ussr);
      let us_milops_deficit = (this.game.state.defcon-this.game.state.milops_us);

      if (ussr_milops_deficit > 0) {
        this.game.state.vp += ussr_milops_deficit;
        this.updateLog("<span>USSR penalized</span> " + ussr_milops_deficit + " <span>VP (milops)</span>");
      }
      if (us_milops_deficit > 0) {
        this.game.state.vp -= us_milops_deficit;
        this.updateLog("<span>US penalized</span> " + us_milops_deficit + " <span>VP (milops)</span>");
      }
    }

    this.game.state.us_defcon_bonus = 0;

    this.game.state.milops_us = 0;
    this.game.state.milops_ussr = 0;

    this.game.state.space_race_us_counter = 0;
    this.game.state.space_race_ussr_counter = 0;
    this.game.state.eagle_has_landed_bonus_taken = 0;
    this.game.state.space_shuttle_bonus_taken = 0;

    // set to 1 when ironlady events before ops played (by ussr - limits placement to rules)
    this.game.state.ironlady_before_ops = 0;

    this.game.state.events.wwby_triggers = 0;
    this.game.state.events.region_bonus = "";
    this.game.state.events.u2 = 0;
    this.game.state.events.containment = 0;
    this.game.state.events.brezhnev = 0;
    this.game.state.events.redscare_player1 = 0;
    this.game.state.events.redscare_player2 = 0;
    this.game.state.events.vietnam_revolts = 0;
    this.game.state.events.vietnam_revolts_eligible = 0;
    this.game.state.events.deathsquads = 0;
    this.game.state.events.missileenvy = 0;
    this.game.state.events.cubanmissilecrisis = 0;
    this.game.state.events.nuclearsubs = 0;
    this.game.state.events.saltnegotiations = 0;
    this.game.state.events.northseaoil_bonus = 0;
    this.game.state.events.yuri = 0;
    this.game.state.events.irancontra = 0;
    this.game.state.events.chernobyl = "";
    this.game.state.events.aldrich = 0;

    //
    // increase DEFCON by one
    //
    this.game.state.defcon++;
    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
    this.game.state.ussr_milops = 0;
    this.game.state.us_milops = 0;


    this.updateDefcon();
    this.updateActionRound();
    this.updateSpaceRace();
    this.updateVictoryPoints();
    this.updateMilitaryOperations();
    this.updateRound();

    //
    // give me the china card if needed
    //
    let do_i_have_the_china_card = 0;
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] == "china") {
        do_i_have_the_china_card = 1;
      }
    }
    if (do_i_have_the_china_card == 0) {
      if (this.game.player == 1) {
        if (this.game.state.events.china_card == 1) {
          if (!this.game.deck[0].hand.includes("china")) {
            this.game.deck[0].hand.push("china");
          }
        }
      }
      if (this.game.player == 2) {
        if (this.game.state.events.china_card == 2) {
          if (!this.game.deck[0].hand.includes("china")) {
            this.game.deck[0].hand.push("china");
          }
        }
      }
    }
    this.game.state.events.china_card = 0;
    this.game.state.events.china_card_eligible = 0;


  }




  whoHasTheChinaCard() {

    let do_i_have_the_china_card = 0;

    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] == "china") {
        do_i_have_the_china_card = 1;
      }
    }

    if (do_i_have_the_china_card == 0) {
      if (this.game.player == 1) {
        if (this.game.state.events.china_card == 1) {
          if (!this.game.deck[0].hand.includes("china")) {
            return "us";
          } else {
            return "ussr";
          }
        } else {
          if (do_i_have_the_china_card == 1) {
            return "ussr";
          } else {
            return "us";
          }
        }
      }
      if (this.game.player == 2) {
        if (this.game.state.events.china_card == 2) {
          if (!this.game.deck[0].hand.includes("china")) {
            return "ussr";
          } else {
            return "us";
          }
        } else {
          if (do_i_have_the_china_card == 1) {
            return "us";
          } else {
            return "ussr";
          }
        }
      }
    } else {
      if (this.game.player == 1) { return "ussr"; }
      if (this.game.player == 2) { return "us"; }
    }

    //
    // we should never hit this
    //

  }




  ////////////////////
  // Core Game Data //
  ////////////////////
  returnState() {

    var state = {};

    state.dealt = 0;
    state.back_button_cancelled = 0;
    state.defectors_pulled_in_headline = 0;
    state.placement = 0;
    state.headline  = 0;
    state.headline_hash = "";
    state.headline_card = "";
    state.headline_xor = "";
    state.headline_opponent_hash = "";
    state.headline_opponent_card = "";
    state.headline_opponent_xor = "";
    state.round = 0;
    state.turn  = 0;
    state.turn_in_round = 0;
    state.broke_control = 0;
    state.us_efcon_bonus = 0;
    state.opponent_cards_in_hand = 0;
    state.event_before_ops = 0;
    state.event_name = "";
    state.player_to_go = 1; // used in headline to track phasing player (primarily for assigning losses for defcon lowering stunts)

    state.vp_outstanding = 0; // vp not settled yet

    state.space_race_us = 0;
    state.space_race_ussr = 0;

    state.animal_in_space = "";
    state.man_in_earth_orbit = "";
    state.eagle_has_landed = "";
    state.eagle_has_landed_bonus_taken = 0;
    state.space_shuttle = "";
    state.space_shuttle_bonus_taken = 0;

    state.space_race_us_counter = 0;
    state.space_race_ussr_counter = 0;

    state.limit_coups = 0;
    state.limit_realignments = 0;
    state.limit_placement = 0;
    state.limit_spacerace = 0;
    state.limit_region = "";
    state.limit_ignoredefcon = 0;

    // track as US (+) and USSR (-)
    state.vp    = 0;

    state.ar_ps         = [];

    // relative --> top: 38px
    state.ar_ps[0]      = { top : 208 , left : 920 };
    state.ar_ps[1]      = { top : 208 , left : 1040 };
    state.ar_ps[2]      = { top : 208 , left : 1155 };
    state.ar_ps[3]      = { top : 208 , left : 1270 };
    state.ar_ps[4]      = { top : 208 , left : 1390 };
    state.ar_ps[5]      = { top : 208 , left : 1505 };
    state.ar_ps[6]      = { top : 208 , left : 1625 };
    state.ar_ps[7]      = { top : 208 , left : 1740 };

    state.vp_ps     = [];
    state.vp_ps[0]  = { top : 2460, left : 3040 };
    state.vp_ps[1]  = { top : 2460, left : 3300 };
    state.vp_ps[2]  = { top : 2460, left : 3435 };
    state.vp_ps[3]  = { top : 2460, left : 3570 };
    state.vp_ps[4]  = { top : 2460, left : 3705 };
    state.vp_ps[5]  = { top : 2460, left : 3840 };
    state.vp_ps[6]  = { top : 2460, left : 3975 };
    state.vp_ps[7]  = { top : 2460, left : 4110 };

    state.vp_ps[8]  = { top : 2600, left : 3035 };
    state.vp_ps[9]  = { top : 2600, left : 3170 };
    state.vp_ps[10]  = { top : 2600, left : 3305 };
    state.vp_ps[11]  = { top : 2600, left : 3435 };
    state.vp_ps[12]  = { top : 2600, left : 3570 };
    state.vp_ps[13]  = { top : 2600, left : 3705 };
    state.vp_ps[14]  = { top : 2600, left : 3840 };
    state.vp_ps[15]  = { top : 2600, left : 3975 };
    state.vp_ps[16]  = { top : 2600, left : 4110 };

    state.vp_ps[17]  = { top : 2740, left : 3035 };
    state.vp_ps[18]  = { top : 2740, left : 3170 };
    state.vp_ps[19]  = { top : 2740, left : 3305 };
    state.vp_ps[20]  = { top : 2740, left : 3570 };
    state.vp_ps[21]  = { top : 2740, left : 3840 };
    state.vp_ps[22]  = { top : 2740, left : 3975 };
    state.vp_ps[23]  = { top : 2740, left : 4110 };

    state.vp_ps[24]  = { top : 2880, left : 3035 };
    state.vp_ps[25]  = { top : 2880, left : 3170 };
    state.vp_ps[26]  = { top : 2880, left : 3305 };
    state.vp_ps[27]  = { top : 2880, left : 3435 };
    state.vp_ps[28]  = { top : 2880, left : 3570 };
    state.vp_ps[29]  = { top : 2880, left : 3705 };
    state.vp_ps[30]  = { top : 2880, left : 3840 };
    state.vp_ps[31]  = { top : 2880, left : 3975 };
    state.vp_ps[32]  = { top : 2880, left : 4110 };

    state.vp_ps[33]  = { top : 3025, left : 3035 };
    state.vp_ps[34]  = { top : 3025, left : 3170 };
    state.vp_ps[35]  = { top : 3025, left : 3305 };
    state.vp_ps[36]  = { top : 3025, left : 3435 };
    state.vp_ps[37]  = { top : 3025, left : 3570 };
    state.vp_ps[38]  = { top : 3025, left : 3705 };
    state.vp_ps[39]  = { top : 3025, left : 3840 };
    state.vp_ps[40]  = { top : 3025, left : 3975 };

    state.space_race_ps = [];
    state.space_race_ps[0] = { top : 510 , left : 3465 }
    state.space_race_ps[1] = { top : 510 , left : 3638 }
    state.space_race_ps[2] = { top : 510 , left : 3810 }
    state.space_race_ps[3] = { top : 510 , left : 3980 }
    state.space_race_ps[4] = { top : 510 , left : 4150 }
    state.space_race_ps[5] = { top : 510 , left : 4320 }
    state.space_race_ps[6] = { top : 510 , left : 4490 }
    state.space_race_ps[7] = { top : 510 , left : 4660 }
    state.space_race_ps[8] = { top : 510 , left : 4830 }

    state.milops_us = 0;
    state.milops_ussr = 0;

    state.milops_ps    = [];
    state.milops_ps[0]  = { top : 2940 , left : 1520 };
    state.milops_ps[1]  = { top : 2940 , left : 1675 };
    state.milops_ps[2]  = { top : 2940 , left : 1830 };
    state.milops_ps[3]  = { top : 2940 , left : 1985 };
    state.milops_ps[4]  = { top : 2940 , left : 2150 };
    state.milops_ps[5]  = { top : 2940 , left : 2305 };

    state.defcon = 5;

    state.defcon_ps    = [];
    state.defcon_ps[0] = { top : 2585, left : 1520 };
    state.defcon_ps[1] = { top : 2585, left : 1675 };
    state.defcon_ps[2] = { top : 2585, left : 1830 };
    state.defcon_ps[3] = { top : 2585, left : 1985 };
    state.defcon_ps[4] = { top : 2585, left : 2140 };

    state.round_ps    = [];
    state.round_ps[0] = { top : 150, left : 3473 };
    state.round_ps[1] = { top : 150, left : 3627 };
    state.round_ps[2] = { top : 150, left : 3781 };
    state.round_ps[3] = { top : 150, left : 3935 };
    state.round_ps[4] = { top : 150, left : 4098 };
    state.round_ps[5] = { top : 150, left : 4252 };
    state.round_ps[6] = { top : 150, left : 4405 };
    state.round_ps[7] = { top : 150, left : 4560 };
    state.round_ps[8] = { top : 150, left : 4714 };
    state.round_ps[9] = { top : 150, left : 4868 };

    // events - early war
    state.events = {};
    state.events.optional = {};			// optional cards -- makes easier to search for
    state.events.formosan           = 0;
    state.events.redscare_player1   = 0;
    state.events.redscare_player2   = 0;
    state.events.containment        = 0;
    state.events.degaulle           = 0;
    state.events.nato               = 0;
    state.events.nato_westgermany   = 0;
    state.events.nato_france        = 0;
    state.events.marshall           = 0;
    state.events.warsawpact         = 0;
    state.events.unintervention     = 0;
    state.events.usjapan            = 0;
    state.events.norad              = 0;

    // regional bonus events
    state.events.vietnam_revolts = 0;
    state.events.vietnam_revolts_eligible = 0;
    state.events.china_card         = 0;
    state.events.china_card_in_play = 0;
    state.events.china_card_eligible = 0;

    // events - mid-war
    state.events.northseaoil        = 0;
    state.events.johnpaul           = 0;
    state.events.ourmanintehran     = 0;
    state.events.kitchendebates     = 0;
    state.events.brezhnev           = 0;
    state.events.wwby               = 0;
    state.events.wwby_triggers      = 0;
    state.events.willybrandt        = 0;
    state.events.shuttlediplomacy   = 0;
    state.events.deathsquads        = 0;
    state.events.campdavid          = 0;
    state.events.cubanmissilecrisis = 0;
    state.events.saltnegotiations   = 0;
    state.events.missileenvy        = 0; // tracks whether happening
    state.events.missile_envy       = 0; // to whom
    state.events.flowerpower        = 0;
    state.events.beartrap           = 0;
    state.events.quagmire           = 0;

    // events - late war
    state.events.awacs              = 0;
    state.events.starwars           = 0;
    state.events.teardown           = 0;
    state.events.iranianhostage     = 0;
    state.events.ironlady           = 0;
    state.events.reformer           = 0;
    state.events.northseaoil        = 0;
    state.events.northseaoil_bonus  = 0;
    state.events.evilempire         = 0;
    state.events.yuri               = 0;
    state.events.aldrich            = 0;

    return state;

  }


  returnCountries() {

    var countries = {};

    // EUROPE
    countries['canada'] = { top : 752, left : 842 , us : 2 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'uk' ] , region : "europe" , name : "Canada" };
    countries['uk'] = { top : 572, left : 1690 , us : 5 , ussr : 0 , control : 5 , bg : 0 , neighbours : [ 'canada','norway','benelux','france' ] , region : "europe" , name : "UK" };
    countries['benelux'] = { top : 728, left : 1860 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'uk','westgermany' ] , region : "europe" , name : "Benelux" };
    countries['france'] = { top : 906, left : 1820 , us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'algeria', 'uk','italy','spain','westgermany' ] , region : "europe" , name : "France" };
    countries['italy'] = { top : 1036, left : 2114 , us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'spain','france','greece','austria','yugoslavia' ] , region : "europe" , name : "Italy" };
    countries['westgermany'] = { top : 728, left : 2078 , us : 0 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'austria','france','benelux','denmark','eastgermany' ] , region : "europe" , name : "West Germany" };
    countries['eastgermany'] = { top : 580, left : 2156 , us : 0 , ussr : 3 , control : 3 , bg : 1 , neighbours : [ 'westgermany','poland','austria' ] , region : "europe" , name : "East Germany" };
    countries['poland'] = { top : 580, left : 2386 , us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'eastgermany','czechoslovakia' ] , region : "europe" , name : "Poland" };
    countries['spain'] = { top : 1118, left : 1660 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'morocco', 'france','italy' ] , region : "europe" , name : "Spain" };
    countries['greece'] = { top : 1200, left : 2392 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'italy','turkey','yugoslavia','bulgaria' ] , region : "europe" , name : "Greece" };
    countries['turkey'] = { top : 1056, left : 2788 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'syria', 'greece','romania','bulgaria' ] , region : "europe"  , name : "Turkey"};
    countries['yugoslavia'] = { top : 1038, left : 2342 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'italy','hungary','romania','greece' ] , region : "europe" , name : "Yugoslavia" };
    countries['bulgaria'] = { top : 1038, left : 2570 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'greece','turkey' ] , region : "europe" , name : "Bulgaria" };

    countries['romania'] = { top : 880, left : 2614 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'turkey','hungary','yugoslavia' ] , region : "europe" , name : "Romania" };
    countries['hungary'] = { top : 880, left : 2394 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'austria','czechoslovakia','romania','yugoslavia' ] , region : "europe" , name : "Hungary" };
    countries['austria'] = { top : 880, left : 2172 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'hungary','italy','westgermany','eastgermany' ] , region : "europe" , name : "Austria" };
    countries['czechoslovakia'] = { top : 728, left : 2346 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'hungary','poland','eastgermany' ] , region : "europe" , name : "Czechoslovakia" };
    countries['denmark'] = { top : 432, left : 1982 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'sweden','westgermany' ] , region : "europe" , name : "Denmark" };
    countries['norway'] = { top : 278, left : 1932 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'uk','sweden' ] , region : "europe" , name : "Norway" };
    countries['finland'] = { top : 286, left : 2522 , us : 0 , ussr : 1 , control : 4 , bg : 0 , neighbours : [ 'sweden' ] , region : "europe" , name : "Finland" };
    countries['sweden'] = { top : 410, left : 2234 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'finland','denmark','norway' ] , region : "europe" , name : "Sweden" };

    // MIDDLE EAST
    countries['libya'] = { top : 1490, left : 2290, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'egypt','tunisia' ] , region : "mideast" , name : "Libya" };
    countries['egypt'] = { top : 1510, left : 2520, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'libya','sudan','israel' ], region : "mideast"  , name : "Egypt"};
    countries['lebanon'] = { top : 1205, left : 2660, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'syria','jordan','israel' ], region : "mideast"  , name : "Lebanon"};
    countries['syria'] = { top : 1205, left : 2870, us : 0 , ussr : 1 , control : 2 , bg : 0 , neighbours : [ 'lebanon','turkey','israel' ], region : "mideast"  , name : "Syria"};
    countries['israel'] = { top : 1350, left : 2620, us : 1 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'egypt','jordan','lebanon','syria' ], region : "mideast" , name : "Israel" };
    countries['iraq'] = { top : 1350, left : 2870, us : 0 , ussr : 1 , control : 3 , bg : 1 , neighbours : [ 'jordan','iran','gulfstates','saudiarabia' ], region : "mideast" , name : "Iraq" };
    countries['iran'] = { top : 1350, left : 3082, us : 1 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'iraq','afghanistan','pakistan' ], region : "mideast" , name : "Iran" };
    countries['jordan'] = { top : 1500, left : 2760, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'israel','lebanon','iraq','saudiarabia' ], region : "mideast" , name : "Jordan" };
    countries['gulfstates'] = { top : 1500, left : 3010, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'iraq','saudiarabia' ], region : "mideast" , name : "Gulf States" };
    countries['saudiarabia'] = { top : 1650, left : 2950, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'jordan','iraq','gulfstates' ], region : "mideast" , name : "Saudi Arabia" };


    // ASIA
    countries['afghanistan'] = { top : 1250, left : 3345, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'iran','pakistan' ], region : "asia" , name : "Afghanistan" };
    countries['pakistan'] = { top : 1450, left : 3345, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'iran','afghanistan','india' ], region : "asia" , name : "Pakistan"}
    countries['india'] = { top : 1552, left : 3585, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'pakistan','burma' ], region : "asia" , name : "India"};
    countries['burma'] = { top : 1580, left : 3855, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'india','laos' ], region : "seasia" , name : "Burma"};
    countries['laos'] = { top : 1600, left : 4070, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'burma','thailand','vietnam' ], region : "seasia" , name : "Laos"};
    countries['thailand'] = { top : 1769, left : 3980, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'laos','vietnam','malaysia' ], region : "seasia" , name : "Thailand"};
    countries['vietnam'] = { top : 1760, left : 4200, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'laos','thailand' ], region : "seasia" , name : "Vietnam"};
    countries['malaysia'] = { top : 1990, left : 4080, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'thailand','australia','indonesia' ], region : "seasia" , name : "Malaysia"};
    countries['australia'] = { top : 2442, left : 4450, us : 4 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'malaysia' ], region : "seasia" , name : "Australia" };
    countries['indonesia'] = { top : 2176, left : 4450, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'malaysia','philippines' ], region : "seasia" , name : "Indonesia"};
    countries['philippines'] = { top : 1755, left : 4530, us : 1 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'indonesia','japan' ], region : "seasia" , name : "Philippines"};
    countries['taiwan'] = { top : 1525, left : 4435, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'japan','southkorea' ], region : "asia" , name : "Taiwan"};
    countries['japan'] = { top : 1348, left : 4705, us : 1 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'philippines','taiwan','southkorea' ], region : "asia" , name : "Japan"};
    countries['southkorea'] = { top : 1200, left : 4530, us : 1 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'japan','taiwan','northkorea' ], region : "asia" , name : "South Korea"};
    countries['northkorea'] = { top : 1050, left : 4480, us : 0 , ussr : 3 , control : 3 , bg : 1 , neighbours : [ 'southkorea' ], region : "asia" , name : "North Korea"};



    // CENTRAL AMERICA
    countries['mexico'] = { top : 1370, left : 175, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'guatemala' ], region : "camerica" , name : "Mexico"};
    countries['guatemala'] = { top : 1526, left : 360, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'mexico','elsalvador','honduras' ], region : "camerica" , name : "Guatemala"};
    countries['elsalvador'] = { top : 1690, left : 295, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'honduras','guatemala' ], region : "camerica" , name : "El Salvador"};
    countries['honduras'] = { top : 1675, left : 515, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'nicaragua','costarica','guatemala','elsalvador' ], region : "camerica" , name : "Honduras"};
    countries['nicaragua'] = { top : 1675, left : 735, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'costarica','honduras','cuba' ], region : "camerica" , name : "Nicaragua"};
    countries['costarica'] = { top : 1830, left : 495, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'honduras', 'panama','nicaragua' ], region : "camerica" , name : "Costa Rica"};
    countries['panama'] = { top : 1830, left : 738, us : 1 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'colombia','costarica' ], region : "camerica" , name : "Panama"};
    countries['cuba'] = { top : 1480, left : 750, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'haiti','nicaragua' ], region : "camerica" , name : "Cuba"};
    countries['haiti'] = { top : 1620, left : 970, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'cuba','dominicanrepublic' ], region : "camerica" , name : "Haiti"};
    countries['dominicanrepublic'] = { top : 1620, left : 1180, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'haiti' ], region : "camerica" , name : "Dominican Republic"};

    // SOUTH AMERICA
    countries['venezuela'] = { top : 1850, left : 1000, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'colombia','brazil' ], region : "samerica" , name : "Venezuela"};
    countries['colombia'] = { top : 2010, left : 878, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'panama','venezuela','ecuador' ], region : "samerica" , name : "Colombia"};
    countries['ecuador'] = { top : 2075, left : 650, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'peru','colombia' ], region : "samerica" , name : "Ecuador"};
    countries['peru'] = { top : 2244, left : 780, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ecuador','chile','bolivia' ], region : "samerica" , name : "Peru"};
    countries['chile'] = { top : 2570, left : 885, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'peru','argentina' ], region : "samerica" , name : "Chile"};
    countries['bolivia'] = { top : 2385, left : 1005, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'paraguay','peru' ], region : "samerica" , name : "Bolivia"};
    countries['argentina'] = { top : 2860, left : 955, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'chile','uruguay','paraguay' ], region : "samerica" , name : "Argentina"};
    countries['paraguay'] = { top : 2550, left : 1130, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'uruguay','argentina','bolivia' ], region : "samerica" , name : "Paraguay"};
    countries['uruguay'] = { top : 2740, left : 1200, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'argentina','paraguay','brazil' ], region : "samerica" , name : "Uruguay"};
    countries['brazil'] = { top : 2230, left : 1385, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'uruguay','venezuela' ], region : "samerica" , name : "Brazil"};

    // AFRICA
    countries['morocco'] = { top : 1400, left : 1710, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'westafricanstates','algeria','spain' ], region : "africa" , name : "Morocco"};
    countries['algeria'] = { top : 1330, left : 1935, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'tunisia','morocco','france','saharanstates' ], region : "africa" , name : "Algeria"};
    countries['tunisia'] = { top : 1310, left : 2160, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'libya','algeria' ], region : "africa" , name : "Tunisia"};
    countries['westafricanstates'] = { top : 1595, left : 1690, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ivorycoast','morocco' ], region : "africa" , name : "West African States"};
    countries['saharanstates'] = { top : 1650, left : 2025, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'algeria','nigeria' ], region : "africa" , name : "Saharan States"};
    countries['sudan'] = { top : 1690, left : 2550, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'egypt','ethiopia' ], region : "africa" , name : "Sudan"};
    countries['ivorycoast'] = { top : 1885, left : 1835, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'nigeria','westafricanstates' ], region : "africa" , name : "Ivory Coast"};
    countries['nigeria'] = { top : 1859, left : 2110, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'ivorycoast','cameroon','saharanstates' ], region : "africa" , name : "Nigeria"};
    countries['ethiopia'] = { top : 1845, left : 2710, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'sudan','somalia' ], region : "africa" , name : "Ethiopia"};
    countries['somalia'] = { top : 1910, left : 2955, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ethiopia','kenya' ], region : "africa" , name : "Somalia"};
    countries['cameroon'] = { top : 2035, left : 2210, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'zaire','nigeria' ], region : "africa" , name : "Cameroon"};
    countries['zaire'] = { top : 2110, left : 2470, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'angola','zimbabwe','cameroon' ], region : "africa" , name : "Zaire"};
    countries['kenya'] = { top : 2045, left : 2735, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'seafricanstates','somalia' ], region : "africa" , name : "Kenya"};
    countries['angola'] = { top : 2290, left : 2280, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'southafrica','botswana','zaire' ], region : "africa" , name : "Angola"};
    countries['seafricanstates'] = { top : 2250, left : 2760, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'zimbabwe','kenya' ], region : "africa" , name : "Southeast African States"};
    countries['zimbabwe'] = { top : 2365, left : 2545, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'seafricanstates','botswana','zaire' ], region : "africa" , name : "Zimbabwe"};
    countries['botswana'] = { top : 2520, left : 2475, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'southafrica','angola','zimbabwe' ], region : "africa" , name : "Botswana"};
    countries['southafrica'] = { top : 2690, left : 2370, us : 1 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'angola','botswana' ], region : "africa" , name : "South Africa"};

    for (var i in countries) { countries[i].place = 0; }

    return countries;

  }



  returnChinaCard() {
    return { img : "TNRnTS-06" , name : "China" , scoring : 0 , bg : 0 , player : "both" , recurring : 1 , ops : 4 };
  }



  returnEarlyWarCards() {

    var deck = {};

    // EARLY WAR
    deck['asia']            = { img : "TNRnTS-01" , name : "Asia Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['europe']          = { img : "TNRnTS-02" , name : "Europe Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['mideast']         = { img : "TNRnTS-03" , name : "Middle-East Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['duckandcover']    = { img : "TNRnTS-04" , name : "Duck and Cover", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 };
    deck['fiveyearplan']    = { img : "TNRnTS-05" , name : "Five Year Plan", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 };
    deck['socgov']          = { img : "TNRnTS-07" , name : "Socialist Governments", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 };
    deck['fidel']           = { img : "TNRnTS-08" , name : "Fidel", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['vietnamrevolts']  = { img : "TNRnTS-09" , name : "Vietnam Revolts", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['blockade']        = { img : "TNRnTS-10" , name : "Blockade", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['koreanwar']       = { img : "TNRnTS-11" , name : "Korean War", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['romanianab']      = { img : "TNRnTS-12" , name : "Romanian Abdication", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['arabisraeli']     = { img : "TNRnTS-13" , name : "Arab-Israeli War", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['comecon']         = { img : "TNRnTS-14" , name : "Comecon", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['nasser']          = { img : "TNRnTS-15" , name : "Nasser", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['warsawpact']      = { img : "TNRnTS-16" , name : "Warsaw Pact", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['degaulle']        = { img : "TNRnTS-17" , name : "De Gaulle Leads France", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['naziscientist']   = { img : "TNRnTS-18" , name : "Nazi Scientist", scoring : 0 , player : "both" , recurring : 0 , ops : 1 };
    deck['truman']          = { img : "TNRnTS-19" , name : "Truman", scoring : 0 , player : "us"   , recurring : 0 , ops : 1 };
    deck['olympic']         = { img : "TNRnTS-20" , name : "Olympic Games", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['nato']            = { img : "TNRnTS-21" , name : "NATO", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 };
    deck['indreds']         = { img : "TNRnTS-22" , name : "Independent Reds", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 };
    deck['marshall']        = { img : "TNRnTS-23" , name : "Marshall Plan", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 };
    deck['indopaki']        = { img : "TNRnTS-24" , name : "Indo-Pakistani War", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['containment']     = { img : "TNRnTS-25" , name : "Containment", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 };
    deck['cia']             = { img : "TNRnTS-26" , name : "CIA Created", scoring : 0 , player : "us"   , recurring : 0 , ops : 1 };
    deck['usjapan']         = { img : "TNRnTS-27" , name : "US/Japan Defense Pact", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 };
    deck['suezcrisis']      = { img : "TNRnTS-28" , name : "Suez Crisis", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['easteuropean']    = { img : "TNRnTS-29" , name : "East European Unrest", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 };
    deck['decolonization']  = { img : "TNRnTS-30" , name : "Decolonization", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['redscare']        = { img : "TNRnTS-31" , name : "Red Scare", scoring : 0 , player : "both" , recurring : 1 , ops : 4 };
    deck['unintervention']  = { img : "TNRnTS-32" , name : "UN Intervention", scoring : 0 , player : "both" , recurring : 1 , ops : 1 };
    deck['destalinization'] = { img : "TNRnTS-33" , name : "Destalinization", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['nucleartestban']  = { img : "TNRnTS-34" , name : "Nuclear Test Ban Treaty", scoring : 0 , player : "both" , recurring : 1 , ops : 4 };
    deck['formosan']        = { img : "TNRnTS-35" , name : "Formosan Resolution", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 };

    //
    // OPTIONS - we default to the expanded deck
    //
    if (this.game.options.deck != "original" ) {
      deck['defectors']       = { img : "TNRnTS-103" ,name : "Defectors", scoring : 0 , player : "us"   , recurring : 1 , ops : 2 };
      deck['cambridge']       = { img : "TNRnTS-104" ,name : "The Cambridge Five", scoring : 0 , player : "ussr"   , recurring : 1 , ops : 2 };
      deck['specialrelation'] = { img : "TNRnTS-105" ,name : "Special Relationship", scoring : 0 , player : "us"   , recurring : 1 , ops : 2 };
      deck['norad']           = { img : "TNRnTS-106" ,name : "NORAD", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 };
    }


    //
    // remove any cards specified
    //
    if (this.game.options != undefined) {
      for (var key in this.game.options) {

        if (deck[key] != undefined) { delete deck[key]; }

        //
        // optional midwar cards
        //
        if (key === "culturaldiplomacy") { deck['culturaldiplomacy'] = { img : "TNRnTS-202png" , name : "Cultural Diplomacy", scoring : 0 , player : "both" , recurring : 1 , ops : 2 }; }
        if (key === "gouzenkoaffair") { deck['gouzenkoaffair'] = { img : "TNRnTS-204png" , name : "Gouzenko Affair", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 }; }
      }
    }


    //
    // specify early-war period
    //
    for (var key in deck) { deck[key].p = 0; }

    return deck;

  }



  returnMidWarCards() {

    var deck = {};

    deck['brushwar']          = { img : "TNRnTS-36" , name : "Brush War", scoring : 0 , player : "both" , recurring : 1 , ops : 3 };
    deck['centralamerica']    = { img : "TNRnTS-37" , name : "Central America Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['seasia']            = { img : "TNRnTS-38" , name : "Southeast Asia Scoring", scoring : 1 , player : "both" , recurring : 0 , ops : 0 };
    deck['armsrace']          = { img : "TNRnTS-39" , name : "Arms Race", scoring : 0 , player : "both" , recurring : 1 , ops : 3 };
    deck['cubanmissile']      = { img : "TNRnTS-40" , name : "Cuban Missile Crisis", scoring : 0 , player : "both" , recurring : 0 , ops : 3 };
    deck['nuclearsubs']       = { img : "TNRnTS-41" , name : "Nuclear Subs", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['quagmire']          = { img : "TNRnTS-42" , name : "Quagmire", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['saltnegotiations']  = { img : "TNRnTS-43" , name : "Salt Negotiations", scoring : 0 , player : "both" , recurring : 0 , ops : 3 };
    deck['beartrap']          = { img : "TNRnTS-44" , name : "Bear Trap", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['summit']            = { img : "TNRnTS-45" , name : "Summit", scoring : 0 , player : "both" , recurring : 1 , ops : 1 };
    deck['howilearned']       = { img : "TNRnTS-46" , name : "How I Learned to Stop Worrying", scoring : 0 , player : "both" , recurring : 0 , ops : 2 };
    deck['junta']             = { img : "TNRnTS-47" , name : "Junta", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['kitchendebates']    = { img : "TNRnTS-48" , name : "Kitchen Debates", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['missileenvy']       = { img : "TNRnTS-49" , name : "Missile Envy", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['wwby']              = { img : "TNRnTS-50" , name : "We Will Bury You", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 };
    deck['brezhnev']          = { img : "TNRnTS-51" , name : "Brezhnev Doctrine", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['portuguese']        = { img : "TNRnTS-52" , name : "Portuguese Empire Crumbles", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['southafrican']      = { img : "TNRnTS-53" , name : "South African Unrest", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['allende']           = { img : "TNRnTS-54" , name : "Allende", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['willybrandt']       = { img : "TNRnTS-55" , name : "Willy Brandt", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['muslimrevolution']  = { img : "TNRnTS-56" , name : "Muslim Revolution", scoring : 0 , player : "ussr" , recurring : 1 , ops : 4 };
    deck['abmtreaty']         = { img : "TNRnTS-57" , name : "ABM Treaty", scoring : 0 , player : "both" , recurring : 1 , ops : 4 };
    deck['culturalrev']       = { img : "TNRnTS-58" , name : "Cultural Revolution", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['flowerpower']       = { img : "TNRnTS-59" , name : "Flower Power", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 };
    deck['u2']                = { img : "TNRnTS-60" , name : "U2 Incident", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['opec']              = { img : "TNRnTS-61" , name : "OPEC", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 };
    deck['lonegunman']        = { img : "TNRnTS-62" , name : "Lone Gunman", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['colonial']          = { img : "TNRnTS-63" , name : "Colonial Rear Guards", scoring : 0 , player : "us" , recurring : 1 , ops : 2 };
    deck['panamacanal']       = { img : "TNRnTS-64" , name : "Panama Canal Returned", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['campdavid']         = { img : "TNRnTS-65" , name : "Camp David Accords", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['puppet']            = { img : "TNRnTS-66" , name : "Puppet Governments", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['grainsales']        = { img : "TNRnTS-67" , name : "Grain Sales to Soviets", scoring : 0 , player : "us" , recurring : 1 , ops : 2 };
    deck['johnpaul']          = { img : "TNRnTS-68" , name : "John Paul II Elected Pope", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['deathsquads']       = { img : "TNRnTS-69" , name : "Latin American Death Squads", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['oas']               = { img : "TNRnTS-70" , name : "OAS Founded", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['nixon']             = { img : "TNRnTS-71" , name : "Nixon Plays the China Card", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['sadat']             = { img : "TNRnTS-72" , name : "Sadat Expels Soviets", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['shuttle']           = { img : "TNRnTS-73" , name : "Shuttle Diplomacy", scoring : 0 , player : "us" , recurring : 1 , ops : 3 };
    deck['voiceofamerica']    = { img : "TNRnTS-74" , name : "Voice of America", scoring : 0 , player : "us" , recurring : 1 , ops : 2 };
    deck['liberation']        = { img : "TNRnTS-75" , name : "Liberation Theology", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['ussuri']            = { img : "TNRnTS-76" , name : "Ussuri River Skirmish", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['asknot']            = { img : "TNRnTS-77" , name : "Ask Not What Your Country...", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['alliance']          = { img : "TNRnTS-78" , name : "Alliance for Progress", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['africa']            = { img : "TNRnTS-79" , name : "Africa Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['onesmallstep']      = { img : "TNRnTS-80" , name : "One Small Step", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['southamerica']      = { img : "TNRnTS-81" , name : "South America Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };

    //
    // OPTIONS - we default to the expanded deck
    //
    if (this.game.options.deck != "original" ) {
      deck['che']               = { img : "TNRnTS-107" , name : "Che", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 };
      deck['tehran']            = { img : "TNRnTS-108" , name : "Our Man in Tehran", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    }

    //
    // remove any cards specified
    //
    if (this.game.options != undefined) {
      for (var key in this.game.options) {

        if (deck[key] != undefined) { delete deck[key]; }

        //
        // optional midwar cards
        //
        if (key === "handshake") { deck['handshake'] = { img : "TNRnTS-201png" , name : "Handshake in Space", scoring : 0 , player : "both" , recurring : 1 , ops : 1 }; }
        if (key === "berlinagreement") { deck['berlinagreement'] = { img : "TNRnTS-205png" , name : "Berlin Agreement", scoring : 0 , player : "both" , recurring : 0 , ops : 2 }; }

      }
    }

    //
    // specify early-war period
    //
    for (var key in deck) { deck[key].p = 1; }


    return deck;

  }


  returnLateWarCards() {

    var deck = {};

    deck['iranianhostage']    = { img : "TNRnTS-82" , name : "Iranian Hostage Crisis", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['ironlady']          = { img : "TNRnTS-83" , name : "The Iron Lady", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['reagan']            = { img : "TNRnTS-84" , name : "Reagan Bombs Libya", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['starwars']          = { img : "TNRnTS-85" , name : "Star Wars", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['northseaoil']       = { img : "TNRnTS-86" , name : "North Sea Oil", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['reformer']          = { img : "TNRnTS-87" , name : "The Reformer", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['marine']            = { img : "TNRnTS-88" , name : "Marine Barracks Bombing", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['KAL007']            = { img : "TNRnTS-89" , name : "Soviets Shoot Down KAL-007", scoring : 0 , player : "us" , recurring : 0 , ops : 4 };
    deck['glasnost']          = { img : "TNRnTS-90" , name : "Glasnost", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 };
    deck['ortega']            = { img : "TNRnTS-91" , name : "Ortega Elected in Nicaragua", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['terrorism']         = { img : "TNRnTS-92" , name : "Terrorism", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['irancontra']        = { img : "TNRnTS-93" , name : "Iran Contra Scandal", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['chernobyl']         = { img : "TNRnTS-94" , name : "Chernobyl", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['debtcrisis']        = { img : "TNRnTS-95" , name : "Latin American Debt Crisis", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['teardown']          = { img : "TNRnTS-96" , name : "Tear Down this Wall", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['evilempire']        = { img : "TNRnTS-97" , name : "An Evil Empire", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['aldrichames']       = { img : "TNRnTS-98" , name : "Aldrich Ames Remix", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['pershing']          = { img : "TNRnTS-99" , name : "Pershing II Deployed", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['wargames']          = { img : "TNRnTS-100" , name : "Wargames", scoring : 0 , player : "both" , recurring : 0 , ops : 4 };
    deck['solidarity']        = { img : "TNRnTS-101" , name : "Solidarity", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };

    //
    // OPTIONS - we default to the expanded deck
    //
    if (this.game.options.deck != "original" ) {
      deck['iraniraq']          = { img : "TNRnTS-102" , name : "Iran-Iraq War", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
      deck['yuri']              = { img : "TNRnTS-109" , name : "Yuri and Samantha", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
      deck['awacs']             = { img : "TNRnTS-110" , name : "AWACS Sale to Saudis", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    }

    //
    // remove any cards specified
    //
    if (this.game.options != undefined) {
      for (var key in this.game.options) {

        if (deck[key] != undefined) { delete deck[key]; }

        //
        // optional latewar cards
        //
        if (key === "rustinredsquare") { deck['rustinredsquare'] = { img : "TNRnTS-203png" , name : "Rust Lands in Red Square", scoring : 0 , player : "us" , recurring : 0 , ops : 1 }; }


      }
    }


    //
    // specify early-war period
    //
    for (var key in deck) { deck[key].p = 2; }

    return deck;

  }


  returnDiscardedCards() {

    var discarded = {};

    for (var i in this.game.deck[0].discards) {
      discarded[i] = this.game.deck[0].cards[i];
      delete this.game.deck[0].cards[i];
    }

    this.game.deck[0].discards = {};

    return discarded;

  }

  /////////////////
  // Play Events //
  /////////////////
  //
  // the point of this function is either to execute events directly
  // or permit the relevant player to translate them into actions
  // that can be directly executed by UPDATE BOARD.
  //
  // this function returns 1 if we can continue, or 0 if we cannot
  // in the handleGame loop managing the events / turns that are
  // queued up to go.
  //
  playEvent(player, card) {

    if (this.game.deck[0].cards[card] != undefined) {
      this.updateStatus("<span>Playing event:</span> <span>" + this.game.deck[0].cards[card].name + "</span>");
    } else {
      //
      // event already run - sync loading error
      //
      console.log("sync loading error -- playEvent");
      return 1;
    }


    ///////////////
    // EARLY WAR //
    ///////////////
    //
    // scoring
    //
    if (card == "asia") {
      this.scoreRegion("asia");
      return 1;
    }
    if (card == "europe") {
      this.scoreRegion("europe");
      return 1;
    }
    if (card == "mideast") {
      this.scoreRegion("mideast");
      return 1;
    }


    //
    // Defectors
    //
    if (card == "defectors") {

      if (this.game.state.headline == 0) {
        if (this.game.state.turn == 0) {
          this.game.state.vp += 1;
          this.updateLog("US gains 1 VP from Defectors");
          this.updateDefcon();
        }
        return 1;
      }

      //
      // Defectors can be PULLED in the headline phase by 5 Year Plan or Grain Sales, in which
      // case it can only cancel the USSR headline if the USSR headline has not already gone.
      // what an insanely great but complicated game dynamic at play here....
      //
      if (this.game.state.headline == 1) {
        this.game.state.defectors_pulled_in_headline = 1;
      }

      return 1;
    }

    //
    // Special Relationship
    //
    if (card == "specialrelation") {

      if (this.isControlled("us", "uk") == 1) {

        if (this.game.player == 1) {
          this.updateStatus("US is playing Special Relationship");
          return 0;
        }

        this.updateStatus("US is playing Special Relationship");

        let twilight_self = this;
        let ops_to_place = 1;
        let placeable = [];

        if (this.game.state.events.nato == 1) {
          ops_to_place = 2;
          placeable.push("canada");
          placeable.push("uk");
          placeable.push("italy");
          placeable.push("france");
          placeable.push("spain");
          placeable.push("greece");
          placeable.push("turkey");
          placeable.push("austria");
          placeable.push("benelux");
          placeable.push("westgermany");
          placeable.push("denmark");
          placeable.push("norway");
          placeable.push("sweden");
          placeable.push("finland");

          this.updateStatus("US is playing Special Relationship. Place 2 OPS anywhere in Western Europe.");

        } else {

          this.updateStatus("US is playing Special Relationship. Place 1 OP adjacent to the UK.");

          placeable.push("canada");
          placeable.push("france");
          placeable.push("norway");
          placeable.push("benelux");
        }

        for (let i = 0; i < placeable.length; i++) {

          this.game.countries[placeable[i]].place = 1;

          let divname = "#"+placeable[i];


          $(divname).off();
          $(divname).on('click', function() {

            twilight_self.addMove("resolve\tspecialrelation");
            if (twilight_self.game.state.events.nato == 1) {
                twilight_self.addMove("vp\tus\t2");
            }

            let c = $(this).attr('id');

            if (twilight_self.countries[c].place != 1) {
              twilight_self.displayModal("Invalid Placement");
            } else {
              twilight_self.placeInfluence(c, ops_to_place, "us", function() {
                twilight_self.addMove("place\tus\tus\t"+c+"\t"+ops_to_place);
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.endTurn();
              });
            }
          });
        }
        return 0;
      }
      return 1;
    }

    //
    // Cambridge Five
    //
    if (card == "cambridge") {

      if (this.game.state.round > 7) {
        this.updateLog("<span>The Cambridge Five cannot be played as an event in Late Wa</span>");
        this.updateStatus("<span>The Cambridge Five cannot be played as an event in Late War</span>");
        return 1;
      }

      if (this.game.player == 1) {
        this.updateStatus("<span>USSR is playing The Cambridge Five (fetching scoring cards in US hand)</span>");
        return 0;
      }

      if (this.game.player == 2) {

        this.addMove("resolve\tcambridge");
        this.updateStatus("USSR is playing The Cambridge Five");

        let scoring_cards = "";
        let scoring_alert  = "cambridge\t";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
              if (scoring_cards.length > 0) { scoring_cards += ", "; scoring_alert += "\t"; }
              scoring_cards += '<span>' + this.game.deck[0].hand[i] + '</span>';
              scoring_alert += this.game.deck[0].hand[i];
            }
          }
        }

        if (scoring_cards.length == 0) {

          this.addMove("notify\tUS does not have any scoring cards");
          this.endTurn();

        } else {

          this.addMove(scoring_alert);
          this.addMove("notify\tUS has scoring cards for: " + scoring_cards);
          this.endTurn();

        }
      }

      return 0;
    }



    //
    // Norad
    //
    if (card == "norad") {
      this.game.state.events.norad = 1;
      return 1;
    }



    //
    // NASSER
    //
    if (card == "nasser") {

      let original_us = parseInt(this.countries["egypt"].us);
      let influence_to_remove = 0;

      while (original_us > 0) {
        influence_to_remove++;
        original_us -= 2;
      }

      this.removeInfluence("egypt", influence_to_remove, "us");
      this.placeInfluence("egypt", 2, "ussr");
      this.updateStatus("Nasser - Soviets add two influence in Egypt. US loses half (rounded-up) of all influence in Egypt.");
      return 1;

    }



    //
    // Nazi Scientist
    //
    if (card == "naziscientist") {
      this.advanceSpaceRace(player);
      return 1;
    }



    //
    // INDEPENDENT REDS
    //
    if (card == "indreds") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing Independent Reds");
        return 0;
      }

      let yugo_ussr = this.countries['yugoslavia'].ussr;
      let romania_ussr = this.countries['romania'].ussr;
      let bulgaria_ussr = this.countries['bulgaria'].ussr;
      let hungary_ussr = this.countries['hungary'].ussr;
      let czechoslovakia_ussr = this.countries['czechoslovakia'].ussr;

      let yugo_us = this.countries['yugoslavia'].us;
      let romania_us = this.countries['romania'].us;
      let bulgaria_us = this.countries['bulgaria'].us;
      let hungary_us = this.countries['hungary'].us;
      let czechoslovakia_us = this.countries['czechoslovakia'].us;

      let yugo_diff = yugo_ussr - yugo_us;
      let romania_diff = romania_ussr - romania_us;
      let bulgaria_diff = bulgaria_ussr - bulgaria_us;
      let hungary_diff = hungary_ussr - hungary_us;
      let czechoslovakia_diff = czechoslovakia_ussr - czechoslovakia_us;


      this.addMove("resolve\tindreds");
      if (hungary_us >= hungary_ussr && yugo_us >= yugo_ussr && romania_us >= romania_ussr && bulgaria_us >= bulgaria_ussr && czechoslovakia_us >= czechoslovakia_ussr) {
        this.endTurn();
        return 0;
      } else {


        let userhtml = "<span>Match USSR influence in which country?</span><p></p><ul>";

        if (yugo_diff > 0) {
          userhtml += '<li class="card" id="yugoslavia">Yugoslavia</li>';
        }
        if (romania_diff > 0) {
          userhtml += '<li class="card" id="romania">Romania</li>';
        }
        if (bulgaria_diff > 0) {
          userhtml += '<li class="card" id="bulgaria">Bulgaria</li>';
        }
        if (hungary_diff > 0) {
          userhtml += '<li class="card" id="hungary">Hungary</li>';
        }
        if (czechoslovakia_diff > 0) {
          userhtml += '<li class="card" id="czechoslovakia">Czechoslovakia</li>';
        }
        userhtml += '</ul>';

        this.updateStatus(userhtml);
        let twilight_self = this;

        $('.card').off();
        $('.card').on('click', function() {

          let myselect = $(this).attr("id");

          if (myselect == "romania") {
            twilight_self.placeInfluence(myselect, romania_diff, "us");
            twilight_self.addMove("place\tus\tus\tromania\t"+romania_diff);
            twilight_self.endTurn();
          }
          if (myselect == "yugoslavia") {
            twilight_self.placeInfluence(myselect, yugo_diff, "us");
            twilight_self.addMove("place\tus\tus\tyugoslavia\t"+yugo_diff);
            twilight_self.endTurn();
          }
          if (myselect == "bulgaria") {
            twilight_self.placeInfluence(myselect, bulgaria_diff, "us");
            twilight_self.addMove("place\tus\tus\tbulgaria\t"+bulgaria_diff);
            twilight_self.endTurn();
          }
          if (myselect == "hungary") {
            twilight_self.placeInfluence(myselect, hungary_diff, "us");
            twilight_self.addMove("place\tus\tus\thungary\t"+hungary_diff);
            twilight_self.endTurn();
          }
          if (myselect == "czechoslovakia") {
            twilight_self.placeInfluence(myselect, czechoslovakia_diff, "us");
            twilight_self.addMove("place\tus\tus\tczechoslovakia\t"+czechoslovakia_diff);
            twilight_self.endTurn();
          }
          return 0;

        });

        return 0;
      }
      return 1;
    }



    ///////////////////
    // MARSHALL PLAN //
    ///////////////////
    if (card == "marshall") {

      this.game.state.events.marshall = 1;

      if (this.game.player == 1) {
        this.updateStatus("US is playing Marshall Plan");
        return 0;
      }
      if (this.game.player == 2) {

        this.updateStatus("Place 1 influence in each of 7 non USSR-controlled countries in Western Europe");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 7;
        twilight_self.addMove("resolve\tmarshall");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          if (i == "canada" || i == "uk" || i == "sweden" || i == "france" || i == "benelux" || i == "westgermany" || i == "spain" ||  i == "italy" || i == "greece" || i == "turkey" || i == "denmark" || i == "norway" || i == "sweden" ||  i == "finland" || i == "austria") {
            if (twilight_self.isControlled("ussr", countryname) != 1) {
              twilight_self.countries[countryname].place = 1;
              $(divname).off();
              $(divname).on('click', function() {
                let countryname = $(this).attr('id');
                if (twilight_self.countries[countryname].place == 1) {
                  twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                  twilight_self.placeInfluence(countryname, 1, "us", function() {
                    twilight_self.countries[countryname].place = 0;
                    ops_to_place--;
                    if (ops_to_place == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                    }
                  });
                } else {
                  twilight_self.displayModal("you cannot place there...");
                }
              });
            }
          }
        }
        return 0;
      }
    }


    ////////////////////
    // Decolonization //
    ////////////////////
    if (card == "decolonization") {

      if (this.game.player == 2) {
        this.updateStatus("USSR is playing Decolonization");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 4;
        twilight_self.addMove("resolve\tdecolonization");

        this.updateStatus("Place four influence in Africa or Southeast Asia (1 per country)");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "morocco" || i == "algeria" || i == "tunisia" || i == "westafricanstates" || i == "saharanstates" || i == "sudan" || i == "ivorycoast" || i == "nigeria" || i == "ethiopia" || i == "somalia" || i == "cameroon" || i == "zaire" || i == "kenya" || i == "angola" || i == "seafricanstates" || i == "zimbabwe" || i == "botswana" || i == "southafrica" || i == "philippines" || i == "indonesia" || i == "malaysia" || i == "vietnam" || i == "thailand" || i == "laos" || i == "burma") {
            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place <= 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }
        return 0;
      }
    }



    /////////////
    // Comecon //
    /////////////
    if (card == "comecon") {

      if (this.game.player == 2) { return 0; }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.updateStatus("Place four influence in non-US controlled countries in Eastern Europe (1 per country)");

        var ops_to_place = 4;
        twilight_self.addMove("resolve\tcomecon");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "finland" || i == "poland" || i == "eastgermany" || i == "austria" || i == "czechoslovakia" || i == "bulgaria" || i == "hungary" || i == "romania" || i == "yugoslavia") {
            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1 && twilight_self.isControlled("us", countryname) != 1) {
                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }
        return 0;
      }
    }


    /////////////////////
    // UN Intervention //
    /////////////////////
    if (card == "unintervention") {

      this.game.state.events.unintervention = 1;

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player != me) {
        return 0;
      } else {

        let twilight_self = this;

        //
        // U2
        //
        if (twilight_self.game.state.events.u2 == 1) {
          twilight_self.addMove("notify\tU2 activates and triggers +1 VP for USSR");
          twilight_self.addMove("vp\tussr\t1\t1");
        }

        //
        // let player pick another turn
        //
        this.addMove("resolve\tunintervention");
        this.addMove("play\t"+this.game.player);
        this.playerTurn();
        return 0;
      }

    }


    ////////////////////////
    // Indo-Pakistani War //
    ////////////////////////
    if (card == "indopaki") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (me != player) {
        let burned = this.rollDice(6);
        return 0;
      }
      if (me == player) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tindopaki");
        twilight_self.updateStatus('Indo-Pakistani War. Choose Target:<p></p><ul><li class="card" id="invadepakistan">Pakistan</li><li class="card" id="invadeindia">India</li></ul>');

        let target = 4;

        $('.card').off();
        $('.card').on('click', function() {

          let invaded = $(this).attr("id");

          if (invaded == "invadepakistan") {

            if (twilight_self.isControlled(opponent, "india") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "iran") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "afghanistan") == 1) { target++; }

            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tpakistan\t"+twilight_self.countries['pakistan'].ussr);
                twilight_self.addMove("remove\tus\tussr\tpakistan\t"+twilight_self.countries['pakistan'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("pakistan", twilight_self.countries['pakistan'].ussr, "us");
                twilight_self.removeInfluence("pakistan", twilight_self.countries['pakistan'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("pakistan", "ussr");
              } else {
                twilight_self.addMove("place\tussr\tussr\tpakistan\t"+twilight_self.countries['pakistan'].us);
                twilight_self.addMove("remove\tussr\tus\tpakistan\t"+twilight_self.countries['pakistan'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("pakistan", twilight_self.countries['pakistan'].us, "ussr");
                twilight_self.removeInfluence("pakistan", twilight_self.countries['pakistan'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("pakistan", "ussr");
              }
            } else {

              if (player == "us") {
                twilight_self.addMove("milops\tus\t2");
                twilight_self.endTurn();
              } else {
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.endTurn();
              }
            }
          }
          if (invaded == "invadeindia") {

            if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "burma") == 1) { target++; }

            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tindia\t"+twilight_self.countries['india'].ussr);
                twilight_self.addMove("remove\tus\tussr\tindia\t"+twilight_self.countries['india'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("india", twilight_self.countries['india'].ussr, "us");
                twilight_self.removeInfluence("india", twilight_self.countries['india'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("india", "ussr");
              } else {
                twilight_self.addMove("place\tussr\tussr\tindia\t"+twilight_self.countries['india'].us);
                twilight_self.addMove("remove\tussr\tus\tindia\t"+twilight_self.countries['india'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("india", twilight_self.countries['india'].us, "ussr");
                twilight_self.removeInfluence("india", twilight_self.countries['india'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("india", "ussr");
              }
            } else {

              if (player == "us") {
                twilight_self.addMove("milops\tus\t2");
                twilight_self.endTurn();
              } else {
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.endTurn();
              }
            }
          }
        });
      }
      return 0;
    }




    //////////////////////
    // Arab Israeli War //
    //////////////////////
    if (card == "arabisraeli") {

      if (this.game.state.events.campdavid == 1) {
        this.updateLog("Arab-Israeli conflict cancelled by Camp David Accords");
        return 1;
      }

      let target = 4;

      if (this.isControlled("us", "israel") == 1) { target++; }
      if (this.isControlled("us", "egypt") == 1) { target++; }
      if (this.isControlled("us", "jordan") == 1) { target++; }
      if (this.isControlled("us", "lebanon") == 1) { target++; }
      if (this.isControlled("us", "syria") == 1) { target++; }

      let roll = this.rollDice(6);
      this.updateLog("<span>" + player.toUpperCase()+"</span> <span>rolls</span> "+roll);

      if (roll >= target) {
        this.updateLog("USSR wins the Arab-Israeli War");
        this.placeInfluence("israel", this.countries['israel'].us, "ussr");
        this.removeInfluence("israel", this.countries['israel'].us, "us");
        this.game.state.vp -= 2;
        this.game.state.milops_ussr += 2;
        this.updateVictoryPoints();
        this.updateMilitaryOperations();
      } else {
        this.updateLog("US wins the Arab-Israeli War");
        this.game.state.milops_ussr += 2;
        this.updateMilitaryOperations();
      }

      return 1;
    }








    ////////////////
    // Korean War //
    ////////////////
    if (card == "koreanwar") {

      let target = 4;

      if (this.isControlled("us", "japan") == 1) { target++; }
      if (this.isControlled("us", "taiwan") == 1) { target++; }

      let roll = this.rollDice(6);

      this.updateLog("<span>Korean War happens (roll:</span> " + roll + ")");

      if (roll >= target) {
        this.updateLog("North Korea wins the Korean War");
        this.placeInfluence("southkorea", this.countries['southkorea'].us, "ussr");
        this.removeInfluence("southkorea", this.countries['southkorea'].us, "us");
        this.game.state.vp -= 2;
        this.game.state.milops_ussr += 2;
        this.updateMilitaryOperations();
        this.updateVictoryPoints();
      } else {
        this.updateLog("South Korea wins the Korean War");
        this.game.state.milops_ussr += 2;
        this.updateMilitaryOperations();
      }
      return 1;

    }


    /////////////////////
    // Vietnam Revolts //
    /////////////////////
    if (card == "vietnamrevolts") {
      this.game.state.events.vietnam_revolts = 1;
      this.placeInfluence("vietnam", 2, "ussr");
      return 1;
    }



    //////////
    // NATO //
    //////////
    if (card == "nato") {
      if (this.game.state.events.marshall == 1 || this.game.state.events.warsawpact == 1) {
        this.game.state.events.nato = 1;
        this.game.state.events.nato_westgermany = 1;
        this.game.state.events.nato_france = 1;
      } else {
        this.updateLog("NATO cannot trigger before Warsaw Pact of Marshall Plan. Moving to discard pile.");
      }
      return 1;
    }



    ////////////////
    // China Card //
    ////////////////
    if (card == "china") {
      this.game.state.events.formosan = 0;
      if (player == "ussr") {
        this.game.state.events.china_card = 2;
      } else {
        this.game.state.events.china_card = 1;
      }
      return 1;
    }



    //////////////
    // Formosan //
    //////////////
    if (card == "formosan") {
      this.game.state.events.formosan = 1;
      $('.formosan_resolution').show();
      return 1;
    }


    ///////////
    // Fidel //
    ///////////
    if (card == "fidel") {
      let usinf = parseInt(this.countries['cuba'].us);
      let ussrinf = parseInt(this.countries['cuba'].ussr);
      this.removeInfluence("cuba", usinf, "us");
      if (ussrinf < 3) {
        this.placeInfluence("cuba", (3-ussrinf), "ussr");
      }
      return 1;
    }


    /////////////////
    // Containment //
    /////////////////
    if (card == "containment") {
      this.game.state.events.containment = 1;
      return 1;
    }


    ////////////
    // Truman //
    ////////////
    if (card == "truman") {

      if (this.game.player == 1) {
        this.updateStatus("US is selecting target for Truman");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\ttruman");

        var options_purge = [];

        if (twilight_self.countries['canada'].ussr > 0 && twilight_self.isControlled('ussr', 'canada') != 1 && twilight_self.isControlled('us', 'canada') != 1) { options_purge.push('canada'); }
        if (twilight_self.countries['uk'].ussr > 0 && twilight_self.isControlled('ussr', 'uk') != 1 && twilight_self.isControlled('us', 'uk') != 1) { options_purge.push('uk'); }
        if (twilight_self.countries['france'].ussr > 0 && twilight_self.isControlled('ussr', 'france') != 1 && twilight_self.isControlled('us', 'france') != 1) { options_purge.push('france'); }
        if (twilight_self.countries['spain'].ussr > 0 && twilight_self.isControlled('ussr', 'spain') != 1 && twilight_self.isControlled('us', 'spain') != 1) { options_purge.push('spain'); }
        if (twilight_self.countries['greece'].ussr > 0 && twilight_self.isControlled('ussr', 'greece') != 1 && twilight_self.isControlled('us', 'greece') != 1) { options_purge.push('greece'); }
        if (twilight_self.countries['turkey'].ussr > 0 && twilight_self.isControlled('ussr', 'turkey') != 1 && twilight_self.isControlled('us', 'turkey') != 1) { options_purge.push('turkey'); }
        if (twilight_self.countries['italy'].ussr > 0 && twilight_self.isControlled('ussr', 'italy') != 1 && twilight_self.isControlled('us', 'italy') != 1) { options_purge.push('italy'); }
        if (twilight_self.countries['westgermany'].ussr > 0 && twilight_self.isControlled('ussr', 'westgermany') != 1 && twilight_self.isControlled('us', 'westgermany') != 1) { options_purge.push('westgermany'); }
        if (twilight_self.countries['eastgermany'].ussr > 0 && twilight_self.isControlled('ussr', 'eastgermany') != 1 && twilight_self.isControlled('us', 'eastgermany') != 1) { options_purge.push('eastgermany'); }
        if (twilight_self.countries['poland'].ussr > 0 && twilight_self.isControlled('ussr', 'poland') != 1 && twilight_self.isControlled('us', 'poland') != 1) { options_purge.push('poland'); }
        if (twilight_self.countries['benelux'].ussr > 0 && twilight_self.isControlled('ussr', 'benelux') != 1 && twilight_self.isControlled('us', 'benelux') != 1) { options_purge.push('benelux'); }
        if (twilight_self.countries['denmark'].ussr > 0 && twilight_self.isControlled('ussr', 'denmark') != 1 && twilight_self.isControlled('us', 'denmark') != 1) { options_purge.push('denmark'); }
        if (twilight_self.countries['norway'].ussr > 0 && twilight_self.isControlled('ussr', 'norway') != 1 && twilight_self.isControlled('us', 'norway') != 1) { options_purge.push('norway'); }
        if (twilight_self.countries['finland'].ussr > 0 && twilight_self.isControlled('ussr', 'finland') != 1 && twilight_self.isControlled('us', 'finland') != 1) { options_purge.push('finland'); }
        if (twilight_self.countries['sweden'].ussr > 0 && twilight_self.isControlled('ussr', 'sweden') != 1 && twilight_self.isControlled('us', 'sweden') != 1) { options_purge.push('sweden'); }
        if (twilight_self.countries['yugoslavia'].ussr > 0 && twilight_self.isControlled('ussr', 'yugoslavia') != 1 && twilight_self.isControlled('us', 'yugoslavia') != 1) { options_purge.push('yugoslavia'); }
        if (twilight_self.countries['czechoslovakia'].ussr > 0 && twilight_self.isControlled('ussr', 'czechoslovakia') != 1 && twilight_self.isControlled('us', 'czechoslovakia') != 1) { options_purge.push('czechoslovakia'); }
        if (twilight_self.countries['bulgaria'].ussr > 0 && twilight_self.isControlled('ussr', 'bulgaria') != 1 && twilight_self.isControlled('us', 'bulgaria') != 1) { options_purge.push('bulgaria'); }
        if (twilight_self.countries['hungary'].ussr > 0 && twilight_self.isControlled('ussr', 'hungary') != 1 && twilight_self.isControlled('us', 'hungary') != 1) { options_purge.push('hungary'); }
        if (twilight_self.countries['romania'].ussr > 0 && twilight_self.isControlled('ussr', 'romania') != 1 && twilight_self.isControlled('us', 'romania') != 1) { options_purge.push('romania'); }
        if (twilight_self.countries['austria'].ussr > 0 && twilight_self.isControlled('ussr', 'austria') != 1 && twilight_self.isControlled('us', 'austria') != 1) { options_purge.push('austria'); }

        if (options_purge.length == 0) {
          twilight_self.addMove("notify\tUSSR has no influence that can be removed");
          twilight_self.endTurn();
    return 0;
        }

        twilight_self.updateStatus("Select a non-controlled country in Europe to remove all USSR influence: ");

        for (let i = 0; i < options_purge.length; i++) {

          let countryname  = options_purge[i];
          let divname      = '#'+countryname;

          twilight_self.countries[countryname].place = 1;

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');
            let ussrpur = twilight_self.countries[c].ussr;

            twilight_self.removeInfluence(c, ussrpur, "ussr", function() {
              twilight_self.addMove("notify\tUS removes all USSR influence from "+twilight_self.countries[c].name);
              twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ussrpur);
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
            });
          });
        }
      }

      return 0;
    }



    ///////////////////////////
    // Socialist Governments //
    ///////////////////////////
    if (card == "socgov") {

      if (this.game.state.events.ironlady == 1) {
        this.updateLog("Iron Lady cancels Socialist Governments");
        return 1;
      }

      if (this.game.player == 2) {
        this.updateStatus("Socialist Governments: USSR is removing 3 US influence from Western Europe (max 2 per country)");
        return 0;
      }
      if (this.game.player == 1) {

        this.updateStatus("Remove 3 US influence from Western Europe (max 2 per country)");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tsocgov");

        var ops_to_purge = 3;
        var ops_purged = {};
        var available_targets = 0;

        for (var i in this.countries) {
          if (i == "italy" || i == "turkey" || i == "greece" || i == "spain" || i == "france" || i == "westgermany" || i == "uk" ||  i == "canada" || i == "benelux" || i == "finland" || i == "austria" || i == "denmark" || i == "norway" || i == "sweden") {
            if (twilight_self.countries[i].us == 1) { available_targets += 1; }
            if (twilight_self.countries[i].us > 1) { available_targets += 2; }
    }
        }
        if (available_targets < 3) {
    ops_to_purge = available_targets;
          this.updateStatus("Remove "+ops_to_purge+" US influence from Western Europe (max 2 per country)");
        }


        for (var i in this.countries) {

          let countryname  = i;
          ops_purged[countryname] = 0;
          let divname      = '#'+i;

          if (i == "italy" || i == "turkey" || i == "greece" || i == "spain" || i == "france" || i == "westgermany" || i == "uk" ||  i == "canada" || i == "benelux" || i == "finland" || i == "austria" || i == "denmark" || i == "norway" || i == "sweden") {

            twilight_self.countries[countryname].place = 1;

      if (twilight_self.countries[countryname].us > 0) {

              $(divname).off();
              $(divname).on('click', function() {
                let c = $(this).attr('id');
                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Country");
                } else {
                  ops_purged[c]++;
                  if (ops_purged[c] >= 2) {
                    twilight_self.countries[c].place = 0;
                  }
                  twilight_self.removeInfluence(c, 1, "us", function() {
                    twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                    ops_to_purge--;
                    if (ops_to_purge == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                    }
                  });
                }
              });
      }
          }
        }
        return 0;
      }
    }




    /////////////////
    // Suez Crisis //
    /////////////////
    if (card == "suezcrisis") {

      if (this.game.player == 2) {
        this.updateStatus("USSR is playing Suez Crisis");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;

        twilight_self.addMove("resolve\tsuezcrisis");
        twilight_self.updateStatus("Remove four influence from Israel, UK or France");

        var ops_to_purge = 4;
        var options_purge = [];
        var options_available = 0;
        let options_purged = {};

        var israel_ops = twilight_self.countries['israel'].us;
        var uk_ops = twilight_self.countries['uk'].us;
        var france_ops = twilight_self.countries['france'].us;

        if (israel_ops > 2) { israel_ops = 2; }
        if (uk_ops > 2)     { uk_ops = 2; }
        if (france_ops > 2) { france_ops = 2; }

        options_available = israel_ops + uk_ops + france_ops;

        if (options_available <= 4) {

          this.updateLog("Suez Crisis auto-removed available influence");

          if (israel_ops >= 2) { israel_ops = 2; } else {}
          if (uk_ops >= 2) { uk_ops = 2; } else {}
          if (france_ops >= 2) { france_ops = 2; } else {}

          if (israel_ops > 0) {
            twilight_self.removeInfluence("israel", israel_ops, "us");
              twilight_self.addMove("remove\tussr\tus\tisrael\t"+israel_ops);
          }
          if (france_ops > 0) {
            twilight_self.removeInfluence("france", france_ops, "us");
            twilight_self.addMove("remove\tussr\tus\tfrance\t"+france_ops);
          }
          if (uk_ops > 0) {
            twilight_self.removeInfluence("uk", uk_ops, "us");
            twilight_self.addMove("remove\tussr\tus\tuk\t"+uk_ops);
          }
          twilight_self.endTurn();

        } else {

          if (twilight_self.countries['uk'].us > 0) { options_purge.push('uk'); }
          if (twilight_self.countries['france'].us > 0) { options_purge.push('france'); }
          if (twilight_self.countries['israel'].us > 0) { options_purge.push('israel'); }

          for (let m = 0; m < options_purge.length; m++) {

            let countryname = options_purge[m];
            options_purged[countryname] = 0;
            twilight_self.countries[countryname].place = 1;

            let divname      = '#'+countryname;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Option");
              } else {
                twilight_self.removeInfluence(c, 1, "us");
                twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                options_purged[c]++;
                if (options_purged[c] >= 2) {
                  twilight_self.countries[c].place = 0;
                }
                ops_to_purge--;
                if (ops_to_purge == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.displayModal("All Influence Removed");
                  twilight_self.endTurn();
                }
              }
            });
          }
        }
      }
      return 0;
    }




    /////////////////
    // CIA Created //
    /////////////////
    if (card == "cia") {

      if (this.game.player == 2) {
        this.updateStatus("USSR is playing CIA Created");
        return 0;
      }
      if (this.game.player == 1) {

        this.addMove("resolve\tcia");
        this.updateStatus("US is playing CIA Created");

        if (this.game.deck[0].hand.length < 1) {
          this.addMove("ops\tus\tcia\t1");
          this.addMove("notify\tUSSR has no cards to reveal");
          this.endTurn();
        } else {
          let revealed = "";
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (i > 0) { revealed += ", "; }
            revealed += this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
          }
          this.addMove("ops\tus\tcia\t1");
          this.addMove("notify\tUSSR holds: "+revealed);
          this.endTurn();
        }
      }
      return 0;
    }




    //////////////
    // Blockade //
    //////////////
    if (card == "blockade") {

      if (this.game.state.events.optional.berlinagreement == 1) {
        this.updateLog("Berlin Agreement prevents Blockade.");
        return 1;
      }

      if (this.game.player == 1) {
        this.updateStatus("US is responding to Blockade");
        return 0;
      }
      if (this.game.player == 2) {

        this.addMove("resolve\tblockade");

        let twilight_self = this;
        let available = 0;

        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] != "china") {
            let avops = this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0);
            if (avops >= 3) { available = 1; }
          }
        }

        if (available == 0) {
          this.updateStatus("Blockade played: no cards available to discard.");
          this.addMove("remove\tus\tus\twestgermany\t"+this.countries['westgermany'].us);
          this.addMove("notify\tUS removes all influence from West Germany");
          this.removeInfluence("westgermany", this.countries['westgermany'].us, "us");
          this.endTurn();
          return 0;
        }

        this.updateStatus('<span>Blockade triggers:</span><p></p><ul><li class="card" id="discard">discard 3 OP card</li><li class="card" id="remove">remove all US influence in W. Germany</li></ul>');

        $('.card').off();
        $('.card').on('click', function() {

          let action = $(this).attr("id");

          if (action == "discard") {
            let choicehtml = "<span>Choose a card to discard:</span><p></p><ul>";
            for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
              if (twilight_self.modifyOps(twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].ops, twilight_self.game.deck[0].hand[i], twilight_self.game.player, 0) >= 3 && twilight_self.game.deck[0].hand[i] != "china") {
                choicehtml += '<li class="card showcard" id="'+twilight_self.game.deck[0].hand[i]+'">'+twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].name+'</li>';
              }
            }
            choicehtml += '</ul>';
            twilight_self.updateStatus(choicehtml);


            $('.card').off();
            $('.card').on('click', function() {

              let card = $(this).attr("id");

              if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
                twilight_self.mobileCardSelect(card, player, function() {
                  twilight_self.removeCardFromHand(card);
                  twilight_self.addMove("notify\tus discarded "+card);
                  twilight_self.endTurn();
                }, "discard");
                return 0;
              }

              twilight_self.removeCardFromHand(card);
                twilight_self.addMove("notify\tus discarded "+card);
              twilight_self.endTurn();
              return 0;

            });

          }
          if (action == "remove") {
            twilight_self.updateStatus("Blockade played: no cards available to discard.");
            twilight_self.addMove("remove\tus\tus\twestgermany\t"+twilight_self.countries['westgermany'].us);
            twilight_self.removeInfluence("westgermany", twilight_self.countries['westgermany'].us, "us");
            twilight_self.endTurn();
            return 0;
          }

        });

        return 0;
      }
    }




    ///////////////////
    // Olympic Games //
    ///////////////////
    if (card == "olympic") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player == me) {
        this.updateStatus("Opponent is deciding whether to boycott the Olympics");
        return 0;
      } else {

        let twilight_self = this;

        this.addMove("resolve\tolympic");

        twilight_self.updateStatus('<span>' + opponent.toUpperCase() + ' holds the Olympics:</span><p></p><ul><li class="card" id="boycott">boycott</li><li class="card" id="participate">participate</li></ul>');

        $('.card').off();
        $('.card').on('click', function() {

          let action = $(this).attr("id");

          if (action == "boycott") {
            twilight_self.addMove("ops\t"+opponent+"\tolympic\t4");
            twilight_self.addMove("defcon\tlower");
            twilight_self.addMove("notify\t"+opponent.toUpperCase()+" plays 4 OPS");
            twilight_self.addMove("notify\t"+me.toUpperCase()+" boycotts the Olympics");
            twilight_self.endTurn();
            return;
          }
          if (action == "participate") {

            let winner = 0;

            while (winner == 0) {

                let usroll   = twilight_self.rollDice(6);
              let ussrroll = twilight_self.rollDice(6);

              twilight_self.addMove("dice\tburn\t"+player);
              twilight_self.addMove("dice\tburn\t"+player);

              if (opponent == "us") {
                usroll += 2;
              } else {
                ussrroll += 2;
              }

              if (ussrroll > usroll) {
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.addMove("notify\tUSSR rolls "+ussrroll+" / US rolls "+usroll);
                twilight_self.addMove("notify\t"+me.toUpperCase()+" participates in the Olympics");
                twilight_self.endTurn();
                winner = 1;
              }
              if (usroll > ussrroll) {
                twilight_self.addMove("vp\tus\t2");
                twilight_self.addMove("notify\tUSSR rolls "+ussrroll+" / US rolls "+usroll);
                twilight_self.addMove("notify\t"+me.toUpperCase()+" participates in the Olympics");
                twilight_self.endTurn();
                winner = 2;
              }
            }
          }
        });
      }

      return 0;
    }





    //////////////////////////
    // East European Unrest //
    //////////////////////////
    if (card == "easteuropean") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing East European Unrest");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;

        var ops_to_purge = 1;
        var countries_to_purge = 3;
        var options_purge = [];

        if (this.game.state.round > 7) {
          ops_to_purge = 2;
        }

        twilight_self.addMove("resolve\teasteuropean");

        if (twilight_self.countries['czechoslovakia'].ussr > 0) { options_purge.push('czechoslovakia'); }
        if (twilight_self.countries['austria'].ussr > 0) { options_purge.push('austria'); }
        if (twilight_self.countries['hungary'].ussr > 0) { options_purge.push('hungary'); }
        if (twilight_self.countries['romania'].ussr > 0) { options_purge.push('romania'); }
        if (twilight_self.countries['yugoslavia'].ussr > 0) { options_purge.push('yugoslavia'); }
        if (twilight_self.countries['bulgaria'].ussr > 0) { options_purge.push('bulgaria'); }
        if (twilight_self.countries['eastgermany'].ussr > 0) { options_purge.push('eastgermany'); }
        if (twilight_self.countries['poland'].ussr > 0) { options_purge.push('poland'); }
        if (twilight_self.countries['finland'].ussr > 0) { options_purge.push('finland'); }

        if (options_purge.length <= countries_to_purge) {
          for (let i = 0; i < options_purge.length; i++) {
            twilight_self.addMove("remove\tus\tussr\t"+options_purge[i]+"\t"+ops_to_purge);
            twilight_self.removeInfluence(options_purge[i], ops_to_purge, "ussr");
          }
          twilight_self.endTurn();
        } else {

          twilight_self.updateStatus("Remove "+ops_to_purge+" from 3 countries in Eastern Europe");

          var countries_purged = 0;

          for (var i in twilight_self.countries) {

            let countryname  = i;
            let divname      = '#'+i;

            if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

              if (twilight_self.countries[countryname].ussr > 0) {
                twilight_self.countries[countryname].place = 1;
              }

              $(divname).off();
              $(divname).on('click', function() {

                let c = $(this).attr('id');

                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Option");
                } else {
                  twilight_self.countries[c].place = 0;
                  twilight_self.removeInfluence(c, ops_to_purge, "ussr", function() {
                    twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ops_to_purge);
                    countries_to_purge--;

                    if (countries_to_purge == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                    }
                  });
                }
              });
            }
          }
        }

        return 0;
      }
    }




    /////////////////
    // Warsaw Pact //
    /////////////////
    if (card == "warsawpact") {

      this.game.state.events.warsawpact = 1;

      if (this.game.player == 2) {
        this.updateStatus("Waiting for USSR to play Warsaw Pact");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        let html  = "USSR establishes the Warsaw Pact:<p></p><ul>";
            html += '<li class="card" id="remove">remove all US influence in four countries in Eastern Europe</li>';
            html += '<li class="card" id="add">add five USSR influence in Eastern Europe (max 2 per country)</li>';
            html += '</ul>';
        twilight_self.updateStatus(html);

        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");

          if (action2 == "remove") {

            twilight_self.addMove("resolve\twarsawpact");
            twilight_self.updateStatus('Remove all US influence from four countries in Eastern Europe');

            var countries_to_purge = 4;
            var options_purge = [];

            if (twilight_self.countries['czechoslovakia'].us > 0) { options_purge.push('czechoslovakia'); }
            if (twilight_self.countries['austria'].us > 0) { options_purge.push('austria'); }
            if (twilight_self.countries['hungary'].us > 0) { options_purge.push('hungary'); }
            if (twilight_self.countries['romania'].us > 0) { options_purge.push('romania'); }
            if (twilight_self.countries['yugoslavia'].us > 0) { options_purge.push('yugoslavia'); }
            if (twilight_self.countries['bulgaria'].us > 0) { options_purge.push('bulgaria'); }
            if (twilight_self.countries['eastgermany'].us > 0) { options_purge.push('eastgermany'); }
            if (twilight_self.countries['poland'].us > 0) { options_purge.push('poland'); }
            if (twilight_self.countries['finland'].us > 0) { options_purge.push('finland'); }

            if (options_purge.length <= countries_to_purge) {

              for (let i = 0; i < options_purge.length; i++) {
                twilight_self.addMove("remove\tussr\tus\t"+options_purge[i]+"\t"+twilight_self.countries[options_purge[i]].us);
                twilight_self.removeInfluence(options_purge[i], twilight_self.countries[options_purge[i]].us, "us");
              }

              twilight_self.endTurn();

            } else {

              var countries_purged = 0;

              for (var i in twilight_self.countries) {

                let countryname  = i;
                let divname      = '#'+i;

                if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

                  if (twilight_self.countries[countryname].us > 0) {
                    twilight_self.countries[countryname].place = 1;
                  }

                  $(divname).off();
                  $(divname).on('click', function() {

                    let c = $(this).attr('id');

                    if (twilight_self.countries[c].place != 1) {
                      twilight_self.displayModal("Invalid Option");
                    } else {
                      twilight_self.countries[c].place = 0;
                      let uspur = twilight_self.countries[c].us;
                      twilight_self.removeInfluence(c, uspur, "us", function() {
                        twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+uspur);
                        countries_purged++;
                        if (countries_purged == countries_to_purge) {
                          twilight_self.playerFinishedPlacingInfluence();
                          twilight_self.endTurn();
                        }
                      });
                    }
                  });
                }
              }
            }
          }
          if (action2 == "add") {

            twilight_self.addMove("resolve\twarsawpact");
            twilight_self.updateStatus('Add five influence in Eastern Europe (max 2 per country)');

            var ops_to_place = 5;
            var ops_placed = {};

            for (var i in twilight_self.countries) {

              let countryname  = i;
              ops_placed[countryname] = 0;
              let divname      = '#'+i;

              if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

                twilight_self.countries[countryname].place = 1;

                $(divname).off();
                $(divname).on('click', function() {

                  let c = $(this).attr('id');

                  if (twilight_self.countries[c].place != 1) {
                    twilight_self.displayModal("Invalid Placement");
                  } else {
                    ops_placed[c]++;
                    twilight_self.placeInfluence(c, 1, "ussr", function() {
                      twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                      if (ops_placed[c] >= 2) { twilight_self.countries[c].place = 0; }
                      ops_to_place--;
                      if (ops_to_place == 0) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      }
                    });
                  }
                });
              }
            }
          }
        });
        return 0;
      }

      return 1;
    }




    /////////////////////
    // Destalinization //
    /////////////////////
    if (card == "destalinization") {

      if (this.game.player == 2) {
        this.updateStatus("USSR is playing Destalinization");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tdestalinization");

        twilight_self.updateStatus('Remove four USSR influence from existing countries:');

        let ops_to_purge = 4;

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            if (twilight_self.countries[c].ussr <= 0) {
              twilight_self.displayModal("Invalid Option");
              return;
            } else {
              twilight_self.removeInfluence(c, 1, "ussr");
              twilight_self.addMove("remove\tussr\tussr\t"+c+"\t1");
              ops_to_purge--;
              if (ops_to_purge == 0) {

                twilight_self.updateStatus('Add four USSR influence to any non-US controlled countries');

                twilight_self.playerFinishedPlacingInfluence();

                var ops_to_place = 4;
                var countries_placed = {};

                for (var i in twilight_self.countries) {

                  countries_placed[i] = 0;
                  let countryname  = i;
                  let divname      = '#'+i;

                  $(divname).off();
                  $(divname).on('click', function() {

                    let cn = $(this).attr('id');
                    if (twilight_self.isControlled("us", cn) == 1) {
                      twilight_self.displayModal("Cannot re-allocate to US controlled countries");
                      return;
                    } else {
                      if (countries_placed[cn] == 2) {
                        twilight_self.displayModal("Cannot place more than 2 influence in any one country");
                        return;
                      } else {
                        twilight_self.placeInfluence(cn, 1, "ussr");
                        twilight_self.addMove("place\tussr\tussr\t"+cn+"\t1");
                        ops_to_place--;
                        countries_placed[cn]++;
                        if (ops_to_place == 0) {
                          twilight_self.playerFinishedPlacingInfluence();
                          twilight_self.endTurn();
                        }
                      }
                    }
                  });
                }
              }
            }
          });
        }
      }
      return 0;
    }



    ///////////////
    // Red Scare //
    ///////////////
    if (card == "redscare") {
      if (player == "ussr") { this.game.state.events.redscare_player2 = 1; }
      if (player == "us") { this.game.state.events.redscare_player1 = 1; }
      return 1;
    }


    ///////////
    // Fidel //
    ///////////
    if (card == "fidel") {
      let usinf = parseInt(this.countries['cuba'].us);
      let ussrinf = parseInt(this.countries['cuba'].ussr);
      this.removeInfluence("cuba", usinf, "us");
      if (ussrinf < 3) {
        this.placeInfluence("cuba", (3-ussrinf), "ussr");
      }
      return 1;
    }



    //////////////////////
    // Nuclear Test Ban //
    //////////////////////
    if (card == "nucleartestban") {

      let vpchange = this.game.state.defcon-2;
      if (vpchange < 0) { vpchange = 0; }
      this.game.state.defcon = this.game.state.defcon+2;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }

      if (player == "us") {
        this.game.state.vp = this.game.state.vp+vpchange;
      } else {
        this.game.state.vp = this.game.state.vp-vpchange;
      }
      this.updateVictoryPoints();
      this.updateDefcon();

      return 1;
    }


    ////////////////////
    // Duck and Cover //
    ////////////////////
    if (card == "duckandcover") {

      this.lowerDefcon();
      this.updateDefcon();

      let vpchange = 5-this.game.state.defcon;

      if (this.game.state.defcon <= 1 && this.game.over != 1) {
        if (this.game.state.turn == 0) {
          this.endGame("us", "defcon");
        } else {
          this.endGame("ussr", "defcon");
        }

        return;

      } else {

        this.game.state.vp = this.game.state.vp+vpchange;
        this.updateVictoryPoints();

      }
      return 1;
    }



    ////////////////////
    // Five Year Plan //
    ////////////////////
    if (card == "fiveyearplan") {

      let twilight_self = this;

      //
      // US has to wait for Soviets to execute
      // burn 1 roll
      //
      if (this.game.player == 2) {
        let burnrand = this.rollDice();
        return 0;
      }

      //
      // Soviets self-report - TODO provide proof
      // of randomness
      //
      if (this.game.player == 1) {

        twilight_self.addMove("resolve\tfiveyearplan");

        let size_of_hand_minus_china_card = this.game.deck[0].hand.length;
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand == "china") { size_of_hand_minus_china_card--; }
        }


        if (size_of_hand_minus_china_card < 1) {
          // burn roll anyway as US will burn
          let burnrand = this.rollDice();
          twilight_self.displayModal("No cards left to discard");
            this.addMove("notify\tUSSR has no cards to discard");
          this.endTurn();
          return 0;
        } else {

          let twilight_self = this;

          twilight_self.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
            roll = parseInt(roll)-1;
            let card = twilight_self.game.deck[0].hand[roll];

            if (card == "china") {
              if (roll-1 >= 0) { card = twilight_self.game.deck[0].hand[roll-1]; } else {
                  card = twilight_self.game.deck[0].hand[roll+1];
              }
            }

            twilight_self.removeCardFromHand(card);
            if (twilight_self.game.deck[0].cards[card].player == "us") {
              twilight_self.displayModal("You have rolled: " + card);
              twilight_self.addMove("event\tus\t"+card);
              twilight_self.endTurn();
            } else {
              twilight_self.displayModal("You have rolled: " + card);
                twilight_self.addMove("notify\tUSSR discarded "+card);
              twilight_self.endTurn();
            }
          });

          return 0;
        }
        return 0;
      }
    }



    ///////////////////////////
    // DeGaulle Leads France //
    ///////////////////////////
    if (card == "degaulle") {
      this.game.state.events.degaulle = 1;
      this.removeInfluence("france", 2, "us");
      this.placeInfluence("france", 1, "ussr");
      return 1;
    }

    /////////////////////////
    // Romanian Abdication //
    /////////////////////////
    if (card == "romanianab") {
      let usinf = parseInt(this.countries['romania'].us);
      let ussrinf = parseInt(this.countries['romania'].ussr);
      this.removeInfluence("romania", usinf, "us");
      if (ussrinf < 3) {
        this.placeInfluence("romania", (3-ussrinf), "ussr");
      }
      return 1;
    }



    /////////////////////////
    // US / Japan Alliance //
    /////////////////////////
    if (card == "usjapan") {
      this.game.state.events.usjapan = 1;
      let usinf = parseInt(this.countries['japan'].us);
      let ussrinf = parseInt(this.countries['japan'].ussr);
      let targetinf = ussrinf + 4;
      this.placeInfluence("japan", (targetinf - usinf), "us");
      return 1;
    }





















    /////////////
    // MID WAR //
    /////////////
    //
    // scoring
    //
    if (card == "seasia") {
      this.scoreRegion("seasia");
      return 1;
    }
    if (card == "southamerica") {
      this.scoreRegion("southamerica");
      return 1;
    }
    if (card == "centralamerica") {
      this.scoreRegion("centralamerica");
      return 1;
    }
    if (card == "africa") {
      this.scoreRegion("africa");
      return 1;
    }



    //
    // Willy Brandt
    //
    if (card == "willybrandt") {

      if (this.game.state.events.teardown == 1) {
        this.updateLog("Willy Brandt canceled by Tear Down this Wall");
        return 1;
      }

      this.game.state.vp -= 1;
      this.updateVictoryPoints();

      this.countries["westgermany"].ussr += 1;
      this.showInfluence("westgermany", "ussr");

      this.game.state.events.nato_westgermany = 0;
      this.game.state.events.willybrandt = 1;

      return 1;
    }




    //
    // Muslim Revolution
    //
    if (card == "muslimrevolution") {

      if (this.game.state.events.awacs == 1) { return 1; }

      var countries_to_purge = 2;
      let countries_with_us_influence = 0;
      if (this.countries["sudan"].us > 0) { countries_with_us_influence++; }
      if (this.countries["egypt"].us > 0) { countries_with_us_influence++; }
      if (this.countries["libya"].us > 0) { countries_with_us_influence++; }
      if (this.countries["syria"].us > 0) { countries_with_us_influence++; }
      if (this.countries["iran"].us > 0) { countries_with_us_influence++; }
      if (this.countries["iraq"].us > 0) { countries_with_us_influence++; }
      if (this.countries["jordan"].us > 0) { countries_with_us_influence++; }
      if (this.countries["saudiarabia"].us > 0) { countries_with_us_influence++; }
      if (countries_with_us_influence < countries_to_purge) { countries_to_purge = countries_with_us_influence; }
      if (countries_with_us_influence == 0) {
        this.updateLog("No countries with US influence to remove");
        return 1;
      }

      if (this.game.player == 2) { this.updateStatus("USSR is playing Muslim Revolution"); return 0; }
      if (this.game.player == 1) {

        this.updateStatus("Remove All US influence from 2 countries among: Sudan, Egypt, Iran, Iraq, Libya, Saudi Arabia, Syria, Joran.");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\tmuslimrevolution");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "sudan" || i == "egypt" || i == "iran" || i == "iraq" || i == "libya" || i == "saudiarabia" || i == "syria" || i == "jordan") {

            if (this.countries[i].us > 0) { countries_with_us_influence++; }

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].us <= 0) {
                twilight_self.displayModal("Invalid Country");
              } else {
                let purginf = twilight_self.countries[c].us;
                twilight_self.removeInfluence(c, purginf, "us", function() {
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+purginf);
                  countries_to_purge--;
                  if (countries_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              }
            });
          }
        }
      }
      return 0;
    }







    //
    // Shuttle Diplomacy
    //
    if (card == "shuttle") {
      this.game.state.events.shuttlediplomacy = 1;
      return 1;
    }



    //
    // Latin American Death Squads
    //
    if (card == "deathsquads") {
      if (player == "ussr") { this.game.state.events.deathsquads = 1; }
      if (player == "us") { this.game.state.events.deathsquads = 2; }
      return 1;
    }





    //
    // Grain Sales to Soviets
    //
    if (card == "grainsales") {

      //
      // US has to wait for Soviets to execute
      // burn 1 roll
      //
      if (this.game.player == 2) {
        this.updateStatus("Waiting for random card from USSR");
        let burnrand = this.rollDice();
        return 0;
      }

      //
      // Soviets self-report - TODO provide proof
      // of randomness
      //
      if (this.game.player == 1) {

        this.updateStatus("Sending random card to USSR");
        this.addMove("resolve\tgrainsales");

        if (this.game.deck[0].hand.length < 1) {
          let burnrand = this.rollDice();
          this.addMove("ops\tus\tgrainsales\t2");
          this.addMove("notify\tUSSR has no cards to discard");
          this.endTurn();
          return 0;
        } else {

          let twilight_self = this;

          if (this.game.deck[0].hand.length == 1 && this.game.deck[0].hand[0] == "china") {
            let burnrand = this.rollDice();
            this.addMove("ops\tus\tgrainsales\t2");
            this.addMove("notify\tUSSR has no cards to discard");
            this.endTurn();
            return 0;
          }

          twilight_self.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
            roll = parseInt(roll)-1;
            let card = twilight_self.game.deck[0].hand[roll];

            if (card == "china") {
              if (roll > 0) { roll--; } else { roll++; }
              card = twilight_self.game.deck[0].hand[roll];
            }

            twilight_self.removeCardFromHand(card);
            twilight_self.addMove("grainsales\tussr\t"+card);
            twilight_self.addMove("notify\tUSSR shares "+twilight_self.game.deck[0].cards[card].name);
            twilight_self.endTurn();
          });
        }
      }
      return 0;
    }




    //
    // Missile Envy
    //
    if (card == "missileenvy") {

      let instigator = 1;
      let opponent = "us";
      if (player == "us") { instigator = 2; opponent = "ussr"; }
      this.game.state.events.missileenvy = 1;

      //
      //
      //
      if (this.game.player == instigator) {
        this.updateStatus("Opponent is returning card for Missile Envy");
        return 0;
      }


      //
      // targeted player provided list if multiple options available
      //
      if (this.game.player != instigator) {

        this.addMove("resolve\tmissileenvy");

        let selected_card  = "";
        let selected_ops   = 0;
        let multiple_cards = 0;

        if (this.game.deck[0].hand.length == 0) {
          this.addMove("notify\t"+opponent.toUpperCase()+" hand contains no cards.");
          this.endTurn();
          return 0;
        }


        for (let i = 0; i < this.game.deck[0].hand.length; i++) {

          if (this.game.deck[0].hand[i] == "china") {
            i++;
            if (this.game.deck[0].hand.length < 2) {
              this.addMove("notify\t"+opponent.toUpperCase()+" hand contains only the China card.");
              this.endTurn();
              return 0;
            }
          }

          if (i < this.game.deck[0].hand.length) {

            let card = this.game.deck[0].cards[this.game.deck[0].hand[i]];

            if (card != "china") {
              if (card.ops == selected_ops) {
                multiple_cards++;
              }
              if (card.ops > selected_ops) {
                selected_ops  = card.ops;
                selected_card = this.game.deck[0].hand[i];
                multiple_cards = 0;
              }
            }
          }
        }


        if (multiple_cards == 0) {

          //
          // offer highest card
          //
          this.addMove("missileenvy\t"+this.game.player+"\t"+selected_card);
          this.endTurn();

        } else {

          //
          // select highest card
          //
          let user_message = "<span>Select card to give opponent:</span><p></p><ul>";
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]].ops == selected_ops && this.game.deck[0].hand[i] != "china") {
              user_message += '<li class="card showcard" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
            }
          }
          user_message += '</ul>';
          this.updateStatus(user_message);

          let twilight_self = this;

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            //
            // offer card
            //
            twilight_self.addMove("missileenvy\t"+twilight_self.game.player+"\t"+action2);
            twilight_self.endTurn();

          });
        }
      }
      return 0;
    }






    //
    // Che
    //
    if (card == "che") {

      let twilight_self = this;
      let valid_targets = 0;
      let couppower = 3;

      if (player == "us") { couppower = this.modifyOps(3,"che",2); }
      if (player == "ussr") { couppower = this.modifyOps(3,"che",1); }

      for (var i in this.countries) {
        let countryname = i;
        if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
          valid_targets++;
        }
      }

      if (valid_targets == 0) {
        this.updateLog("No valid targets for Che");
        return 1;
      }

      if (this.game.player == 2) {
        this.updateStatus("Waiting for USSR to play Che");
        return 0;
      }
      if (this.game.player == 1) {

        twilight_self.playerFinishedPlacingInfluence();
        let user_message = "Che takes effect. Pick first target for coup:<p></p><ul>";
            user_message += '<li class="card" id="skipche">or skip coup</li>';
            user_message += '</ul>';
        twilight_self.updateStatus(user_message);

        $('.card').off();
        $('.card').on('click', function() {
          let action2 = $(this).attr("id");
          if (action2 == "skipche") {
            twilight_self.updateStatus("Skipping Che coups...");
            twilight_self.addMove("resolve\tche");
            twilight_self.endTurn();
          }
        });

        for (var i in twilight_self.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              twilight_self.addMove("resolve\tche");
              twilight_self.addMove("checoup\tussr\t"+c+"\t"+couppower);
              twilight_self.addMove("milops\tussr\t"+couppower);
              twilight_self.endTurn();
            });
          } else {

            $(divname).off();
            $(divname).on('click', function() {
              twilight_self.displayModal("Invalid Target");
            });

          }
        }
      }
      return 0;
    }











    //
    // Ask Not What Your Country Can Do For You
    //
    if (card == "asknot") {

      if (this.game.player == 1) {
        this.updateStatus("Waiting for US to play Ask Not What Your Country Can Do For You");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;
        let cards_discarded = 0;

        let cards_to_discard = 0;
        let user_message = "Select cards to discard:<p></p><ul>";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] != "china") {
            user_message += '<li class="card showcard" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
            cards_to_discard++;
          }
        }

        if (cards_to_discard == 0) {
          twilight_self.addMove("notify\tUS has no cards available to discard");
          twilight_self.endTurn();
          return;
        }

        user_message += '</ul><p></p>When you are done discarding <span class="card dashed" id="finished">click here</span>.';

        twilight_self.updateStatus(user_message);
        twilight_self.addMove("resolve\tasknot");

        twilight_self.addShowCardEvents(function(card) {

          let action2 = $(card).attr("id");

          if (action2 == "finished") {

            //
            // if Aldrich Ames is active, US must reveal cards
            //
            if (twilight_self.game.state.events.aldrich == 1) {
              twilight_self.addMove("aldrichreveal\tus");
            }

            twilight_self.addMove("DEAL\t1\t2\t"+cards_discarded);

            //
            // are there enough cards available, if not, reshuffle
            //
            if (cards_discarded > twilight_self.game.deck[0].crypt.length) {

              let discarded_cards = twilight_self.returnDiscardedCards();
              if (Object.keys(discarded_cards).length > 0) {

                //
                // shuffle in discarded cards
                //
                twilight_self.addMove("SHUFFLE\t1");
                twilight_self.addMove("DECKRESTORE\t1");
                twilight_self.addMove("DECKENCRYPT\t1\t2");
                twilight_self.addMove("DECKENCRYPT\t1\t1");
                twilight_self.addMove("DECKXOR\t1\t2");
                twilight_self.addMove("DECKXOR\t1\t1");
                twilight_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
                twilight_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
                twilight_self.addMove("DECKBACKUP\t1");
                twilight_self.updateLog("cards remaining: " + twilight_self.game.deck[0].crypt.length);
                twilight_self.updateLog("Shuffling discarded cards back into the deck...");

              }
            }

            twilight_self.endTurn();

          } else {

                if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
              twilight_self.mobileCardSelect(card, player, function() {
                $(card).hide();
                cards_discarded++;
                twilight_self.removeCardFromHand(action2);
                twilight_self.addMove("discard\tus\t"+action2);
              }, "discard");
            } else {
              $(card).hide();
                cards_discarded++;
              twilight_self.removeCardFromHand(action2);
              twilight_self.addMove("discard\tus\t"+action2);
            }
          }
        });

      }

      return 0;
    }




    //
    // Salt Negotiations
    //
    if (card == "saltnegotiations") {

      // update defcon
      this.game.state.defcon += 2;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
      this.updateDefcon();

      // affect coups
      this.game.state.events.saltnegotiations = 1;

      // otherwise sort through discards
      let discardlength = 0;
      for (var i in this.game.deck[0].discards) { discardlength++; }
      if (discardlength == 0) {
        this.updateLog("No cards in discard pile");
        return 1;
      }

      let my_go = 0;

      if (player === "ussr" && this.game.player == 1) { my_go = 1; }
      if (player === "us" && this.game.player == 2) { my_go = 1; }

      if (my_go == 0) {
        this.updateStatus("Opponent retrieving card from discard pile");
        console.log("HERE: " + my_go + " --- " + this.game.player + " --- " + player);
        return 0;
      }

      // pick discarded card
      var twilight_self = this;

      let user_message = "Pick Card to Reclaim:<p></p><ul>";
      for (var i in this.game.deck[0].discards) {
        if (this.game.deck[0].discards[i].scoring == 0) {
          user_message += '<li class="card showcard" id="'+i+'">'+this.game.deck[0].discards[i].name+'</li>';
        }
      }
      user_message += '<li class="card showcard" id="nocard">do not reclaim card...</li>';
      user_message += "</ul>";
      twilight_self.updateStatus(user_message);

      twilight_self.addMove("resolve\tsaltnegotiations");


      $('.card').off();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
          twilight_self.mobileCardSelect(card, player, function() {

            if (action2 != "nocard") {
              twilight_self.game.deck[0].hand.push(action2);
              twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
            } else {
              twilight_self.addMove("notify\t"+player+" does not retrieve card");
            }
            twilight_self.endTurn();

          }, "retrieve");
        } else {

          if (action2 != "nocard") {
            twilight_self.game.deck[0].hand.push(action2);
            twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
          } else {
            twilight_self.addMove("notify\t"+player+" does not retrieve card");
          }
          twilight_self.endTurn();
        }

      });

      return 0;
    }




    //
    // Our Man in Tehran
    //
    if (card == "tehran") {

      let usc = 0;

      if (this.isControlled("us", "egypt") == 1) { usc = 1; }
      if (this.isControlled("us", "libya") == 1) { usc = 1; }
      if (this.isControlled("us", "israel") == 1) { usc = 1; }
      if (this.isControlled("us", "lebanon") == 1) { usc = 1; }
      if (this.isControlled("us", "syria") == 1) { usc = 1; }
      if (this.isControlled("us", "iraq") == 1) { usc = 1; }
      if (this.isControlled("us", "iran") == 1) { usc = 1; }
      if (this.isControlled("us", "jordan") == 1) { usc = 1; }
      if (this.isControlled("us", "gulfstates") == 1) { usc = 1; }
      if (this.isControlled("us", "saudiarabia") == 1) { usc = 1; }

      if (usc == 0) {
        this.updateLog("US does not control any Middle-East Countries");
        return 1;
      }

      this.game.state.events.ourmanintehran = 1;

      if (this.game.player == 2) {
        this.updateStatus("Waiting for USSR to provide keys to examine deck");
      }
      if (this.game.player == 1) {
        this.addMove("resolve\ttehran");
        let keys_given = 0;
        for (let i = 0; i < this.game.deck[0].crypt.length && i < 5; i++) {
          this.addMove(this.game.deck[0].keys[i]);
          keys_given++;
        }
        this.addMove("tehran\tussr\t"+keys_given);
        this.endTurn();
      }
      return 0;
    }




    //
    // Flower Power
    //
    if (card == "flowerpower") {
      if (this.game.state.events.evilempire == 1) {
        this.updateLog("Flower Power prevented by Evil Empire");
        return 1;
      }
      this.game.state.events.flowerpower = 1;
      return 1;
    }




    //
    // Quagmire
    //
    if (card == "quagmire") {
      this.game.state.events.norad = 0;
      this.game.state.events.quagmire = 1;
      return 1;
    }


    //
    // Bear Trap
    //
    if (card == "beartrap") {
      this.game.state.events.beartrap = 1;
      return 1;
    }




    //
    // Summit
    //
    if (card == "summit") {

      let us_roll = this.rollDice(6);
      let ussr_roll = this.rollDice(6);

      this.updateLog("<span>Summit: US rolls</span> "+us_roll+" <span>and USSR rolls</span> "+ussr_roll);

      if (this.doesPlayerDominateRegion("ussr", "europe") == 1)   { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "mideast") == 1)  { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "asia") == 1)     { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "africa") == 1)   { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "camerica") == 1) { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "samerica") == 1) { ussr_roll++; }

      if (this.doesPlayerDominateRegion("us", "europe") == 1)   { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "mideast") == 1)  { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "asia") == 1)     { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "africa") == 1)   { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "camerica") == 1) { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "samerica") == 1) { us_roll++; }

      let is_winner = 0;

      if (us_roll > ussr_roll) { is_winner = 1; }
      if (ussr_roll > us_roll) { is_winner = 1; }

      if (is_winner == 0) {
        return 1;
      } else {

        //
        // winner
        //
        let my_go = 0;
        if (us_roll > ussr_roll && this.game.player == 2) { my_go = 1; }
        if (ussr_roll > us_roll && this.game.player == 1) { my_go = 1; }

        if (my_go == 1) {

          let twilight_self = this;

          twilight_self.addMove("resolve\tsummit");

          if (us_roll > ussr_roll) {
            twilight_self.addMove("vp\tus\t2");
          } else {
            twilight_self.addMove("vp\tussr\t2");
          }

          let x = 0;
          let y = 0;

          this.updateStatus('<span>You win the Summit:</span><p></p><ul><li class="card" id="raise">raise DEFCON</li><li class="card" id="lower">lower DEFCON</li><li class="card" id="same">do not change</li></ul>');

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 == "raise") {
              twilight_self.updateStatus("broadcasting choice....");
              twilight_self.addMove("resolve\tsummit");
              twilight_self.addMove("defcon\traise");
              twilight_self.endTurn();
            }
            if (action2 == "lower") {
              twilight_self.updateStatus("broadcasting choice....");
              twilight_self.addMove("resolve\tsummit");
              twilight_self.addMove("defcon\tlower");
              twilight_self.endTurn();
            }
            if (action2 == "same") {
              twilight_self.updateStatus("broadcasting choice....");
              twilight_self.addMove("resolve\tsummit");
              twilight_self.addMove("notify\tDEFCON left untouched");
              twilight_self.endTurn();
            }

          });
        }
        return 0;
      }
    }




    //
    // Nuclear Subs
    //
    if (card == "nuclearsubs") {
      this.game.state.events.nuclearsubs = 1;
      return 1;
    }



    //
    // Cuban Missile Crisis
    //
    if (card == "cubanmissile") {
      this.game.state.defcon = 2;
      this.updateDefcon();
      if (player == "ussr") { this.game.state.events.cubanmissilecrisis = 2; }
      if (player == "us") { this.game.state.events.cubanmissilecrisis = 1; }
      return 1;
    }




    //
    // Junta
    //
    if (card == "junta") {

      this.game.state.events.junta = 1;

      let my_go = 0;
      if (player == "ussr" && this.game.player == 1) { my_go = 1; }
      if (player == "us" && this.game.player == 2) { my_go = 1; }

      if (my_go == 0) {
        this.updateStatus(player.toUpperCase() + "</span> <span>playing Junta");
      }
      if (my_go == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.updateStatus(player.toUpperCase() + ' to place 2 Influence in Central or South America');

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          let countries_with_us_influence = 0;

          if (this.countries[i].region === "samerica" || this.countries[i].region === "camerica") {

            let divname = '#'+i;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              twilight_self.placeInfluence(c, 2, player, function() {

          //
          // disable event
          //
          $('.country').off();

                let confirmoptional = '<span>Do you wish to launch a free coup or conduct realignment rolls in Central or South America with the Junta card?</span><p></p><ul><li class="card" id="conduct">coup or realign</li><li class="card" id="skip">skip</li></ul>';
                twilight_self.updateStatus(confirmoptional);

                $('.card').off();
                $('.card').on('click', function() {

                  let action2 = $(this).attr("id");

                  if (action2 == "conduct") {
                    twilight_self.addMove("resolve\tjunta");
                    twilight_self.addMove("unlimit\tplacement");
                    twilight_self.addMove("unlimit\tmilops");
                    twilight_self.addMove("unlimit\tregion");
                    twilight_self.addMove("ops\t"+player+"\tjunta\t2");
                    twilight_self.addMove("limit\tregion\teurope");
                    twilight_self.addMove("limit\tregion\tafrica");
                    twilight_self.addMove("limit\tregion\tmideast");
                    twilight_self.addMove("limit\tregion\tasia");
                    twilight_self.addMove("limit\tmilops");
                    twilight_self.addMove("limit\tplacement");
                    twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t2");
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }

                  if (action2 == "skip") {
                    twilight_self.addMove("resolve\tjunta");
                    twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t2");
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }

                });
              });
            });
          }
        }
      }
      return 0;
    }





    //
    // ABM Treaty
    //
    if (card == "abmtreaty") {

      this.updateStatus(player.toUpperCase() + "</span> <span>plays ABM Treaty");
      this.updateLog("DEFCON increases by 1");

      this.game.state.defcon++;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
      this.updateDefcon();

      let did_i_play_this = 0;

      if (player == "us" && this.game.player == 2)   { did_i_play_this = 1; }
      if (player == "ussr" && this.game.player == 1) { did_i_play_this = 1; }

      if (did_i_play_this == 1) {
        this.addMove("resolve\tabmtreaty");
        this.addMove("ops\t"+player+"\tabmtreaty\t4");
        this.endTurn();
      }

      return 0;
    }










    //
    // Cultural Revolution
    //
    if (card == "culturalrev") {

      if (this.game.state.events.china_card == 1) {

        this.game.state.vp -= 1;
        this.updateLog("USSR gains 1 VP from Cultural Revolution");
        this.updateVictoryPoints();

      } else {

        if (this.game.state.events.china_card == 2) {

          this.updateLog("USSR gains the China Card face up");

          if (this.game.player == 1) {
            this.game.deck[0].hand.push("china");
          }
          this.game.state.events.china_card = 0;

        } else {

          //
          // it is in one of our hands
          //
          if (this.game.player == 1) {

            let do_i_have_cc = 0;

            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                  if (this.game.deck[0].hand[i] == "china") {
                do_i_have_cc = 1;
              }
            }

            if (do_i_have_cc == 1) {
              this.game.state.vp -= 1;
              this.updateVictoryPoints();
            } else {
              if (! this.game.deck[0].hand.includes("china")) {
                this.game.deck[0].hand.push("china");
              }
              this.game.state.events.china_card = 0;
            }

          }
          if (this.game.player == 2) {

              let do_i_have_cc = 0;

            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                  if (this.game.deck[0].hand[i] == "china") {
                do_i_have_cc = 1;
              }
            }

            if (do_i_have_cc == 1) {
              for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
                  this.game.deck[0].hand.splice(i, 1);
                  return 1;
                }
              }
            } else {
              this.game.state.vp -= 1;
              this.updateLog("USSR gains 1 VP from Cultural Revolution");
              this.updateVictoryPoints();
            }
          }
        }
      }
      return 1;
    }






    //
    // Nixon Plays the China Card
    //
    if (card == "nixon") {

      let does_us_get_vp = 0;

      if (this.game.state.events.china_card == 2) {
        does_us_get_vp = 1;
      } else {

        if (this.game.state.events.china_card == 1) {
          this.game.state.events.china_card = 2;
        } else {

          if (this.game.player == 2) {
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                  if (this.game.deck[0].hand[i] == "china") {
                does_us_get_vp = 1;
              }
            }
          }
          if (this.game.player == 1) {
              does_us_get_vp = 1;
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                  if (this.game.deck[0].hand[i] == "china") {
                does_us_get_vp = 0;
              }
            }
          }
        }
      }

      if (does_us_get_vp == 1) {
        this.game.state.vp += 2;
        this.updateVictoryPoints();
        this.updateLog("US gets 2 VP from Nixon");
      } else {
        if (this.game.player == 1) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].hand[i] == "china") {
              this.updateLog("US gets the China Card (face down)");
              this.game.deck[0].hand.splice(i, 1);
            }
          }
        }
        this.game.state.events.china_card = 2;
      }

      return 1;
    }




    //
    // Kitchen Debates
    //
    if (card == "kitchendebates") {

      let us_bg = 0;
      let ussr_bg = 0;

      if (this.isControlled("us", "mexico") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "mexico") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "cuba") == 1)          { us_bg++; }
      if (this.isControlled("ussr", "cuba") == 1)        { ussr_bg++; }
      if (this.isControlled("us", "panama") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "panama") == 1)      { ussr_bg++; }

      if (this.isControlled("us", "venezuela") == 1)     { us_bg++; }
      if (this.isControlled("ussr", "venezuela") == 1)   { ussr_bg++; }
      if (this.isControlled("us", "brazil") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "brazil") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "argentina") == 1)     { us_bg++; }
      if (this.isControlled("ussr", "argentina") == 1)   { ussr_bg++; }
      if (this.isControlled("us", "chile") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "chile") == 1)       { ussr_bg++; }

      if (this.isControlled("us", "southafrica") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "southafrica") == 1) { ussr_bg++; }
      if (this.isControlled("us", "angola") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "angola") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "zaire") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "zaire") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "nigeria") == 1)       { us_bg++; }
      if (this.isControlled("ussr", "nigeria") == 1)     { ussr_bg++; }
      if (this.isControlled("us", "algeria") == 1)       { us_bg++; }
      if (this.isControlled("ussr", "algeria") == 1)     { ussr_bg++; }

      if (this.isControlled("us", "poland") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "poland") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "eastgermany") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "eastgermany") == 1) { ussr_bg++; }
      if (this.isControlled("us", "westgermany") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "westgermany") == 1) { ussr_bg++; }
      if (this.isControlled("us", "france") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "france") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "italy") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "italy") == 1)       { ussr_bg++; }

      if (this.isControlled("us", "libya") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "libya") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "egypt") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "egypt") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "israel") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "israel") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "iraq") == 1)          { us_bg++; }
      if (this.isControlled("ussr", "iraq") == 1)        { ussr_bg++; }
      if (this.isControlled("us", "iran") == 1)          { us_bg++; }
      if (this.isControlled("ussr", "iran") == 1)        { ussr_bg++; }
      if (this.isControlled("us", "saudiarabia") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "saudiarabia") == 1) { ussr_bg++; }

      if (this.isControlled("us", "pakistan") == 1)      { us_bg++; }
      if (this.isControlled("ussr", "pakistan") == 1)    { ussr_bg++; }
      if (this.isControlled("us", "india") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "india") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "thailand") == 1)      { us_bg++; }
      if (this.isControlled("ussr", "thailand") == 1)    { ussr_bg++; }
      if (this.isControlled("us", "japan") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "japan") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "southkorea") == 1)    { us_bg++; }
      if (this.isControlled("ussr", "southkorea") == 1)  { ussr_bg++; }
      if (this.isControlled("us", "northkorea") == 1)    { us_bg++; }
      if (this.isControlled("ussr", "northkorea") == 1)  { ussr_bg++; }

      if (us_bg > ussr_bg) {
        this.game.state.events.kitchendebates = 1;
        this.updateLog("US gains 2 VP and pokes USSR in chest...");
        this.game.state.vp += 2;
        this.updateVictoryPoints();
      } else {
        this.updateLog("US does not have more battleground countries than USSR...");
      }

      return 1;
    }




    //
    // Voice of America
    //
    if (card == "voiceofamerica") {

      var ops_to_purge = 4;
      var ops_removable = 0;

      for (var i in this.countries) { if (this.countries[i].ussr > 0) { ops_removable += this.countries[i].ussr; } }
      if (ops_to_purge > ops_removable) { ops_to_purge = ops_removable; }
      if (ops_to_purge <= 0) {
        return 1;
      }


      if (this.game.player == 1) { return 0; }
      if (this.game.player == 2) {

        this.updateStatus("Remove 4 USSR influence from non-European countries (max 2 per country)");

        var twilight_self = this;
        var ops_purged = {};

        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\tvoiceofamerica");

        for (var i in this.countries) {

          let countryname  = i;
          ops_purged[countryname] = 0;
          let divname      = '#'+i;

          if (this.countries[i].region != "europe") {

            twilight_self.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1 || twilight_self.countries[c].ussr == 0) {
                twilight_self.displayModal("Invalid Country");
              } else {
                ops_purged[c]++;
                if (ops_purged[c] >= 2) {
                  twilight_self.countries[c].place = 0;
                }
                twilight_self.removeInfluence(c, 1, "ussr", function() {
                  twilight_self.addMove("remove\tus\tussr\t"+c+"\t1");
                  ops_to_purge--;
                  if (ops_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              }
            });

          }
        }
      }
      return 0;
    }



    //
    // Puppet Government
    //
    if (card == "puppet") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing Puppet Governments");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 3;
        var available_targets = 0;

        twilight_self.addMove("resolve\tpuppet");

        this.updateStatus("US place three influence in countries without any influence");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (twilight_self.countries[countryname].us == 0 && twilight_self.countries[countryname].ussr == 0) {

            available_targets++;
            twilight_self.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "us", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }

        if (available_targets < ops_to_place) { ops_to_place = available_targets; }
        if (ops_to_place > 0) {
          return 0;
        } else {
          twilight_self.playerFinishedPlacingInfluence();
          return 0;
        }
      }
    }




    //
    // Liberation Theology
    //
    if (card == "liberation") {

      if (this.game.player == 2) {
        this.updateStatus("USSR is playing Liberation Theology");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 3;
        var already_placed = [];

        twilight_self.addMove("resolve\tliberation");

        this.updateStatus("USSR places three influence in Central America");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          if (i == "mexico" || i == "guatemala" || i == "elsalvador" || i == "honduras" || i == "nicaragua" || i == "costarica" || i == "panama" || i == "cuba" || i == "haiti" || i == "dominicanrepublic") {
            twilight_self.countries[countryname].place = 1;

            already_placed[countryname] = 0;

            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                already_placed[countryname]++;
                if (already_placed[countryname] == 2) {
                  twilight_self.countries[countryname].place = 0;
                }
                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }
        return 0;
      }
    }




    //
    // Ussuri River Skirmish
    //
    if (card == "ussuri") {

      let us_cc = 0;

      //
      // does us have cc
      //
      if (this.game.state.events.china_card == 2) {
        us_cc = 1;
      } else {

        //
        // it is in one of our hands
        //
        if (this.game.player == 1) {

          let do_i_have_cc = 0;

          if (this.game.state.events.china_card == 1) { do_i_have_cc = 1; }

          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              do_i_have_cc = 1;
            }
          }

          if (do_i_have_cc == 1) {
          } else {
            us_cc = 1;
          }

        }
        if (this.game.player == 2) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              us_cc = 1;
            }
          }
        }
      }


      //
      //
      //
      if (us_cc == 1) {

        this.updateLog("US places 4 influence in Asia (max 2 per country)");

        //
        // place four in asia
        //
        if (this.game.player == 1) {
          this.updateStatus("US is playing USSURI River Skirmish");
          return 0;
        }
        if (this.game.player == 2) {

          var twilight_self = this;
          twilight_self.playerFinishedPlacingInfluence();

          var ops_to_place = 4;
          twilight_self.addMove("resolve\tussuri");

          this.updateStatus("US place four influence in Asia (2 max per country)");

          for (var i in this.countries) {

            let countryname  = i;
            let divname      = '#'+i;
            let ops_placed   = [];

              if (this.countries[i].region.indexOf("asia") != -1) {

              ops_placed[i] = 0;

              twilight_self.countries[countryname].place = 1;
              $(divname).off();
              $(divname).on('click', function() {
                let countryname = $(this).attr('id');
                if (twilight_self.countries[countryname].place == 1) {
                  ops_placed[countryname]++;
                  twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                  twilight_self.placeInfluence(countryname, 1, "us", function() {
                    if (ops_placed[countryname] >= 2) {
                      twilight_self.countries[countryname].place = 0;
                    }
                    ops_to_place--;
                    if (ops_to_place == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                    }
                  });
                } else {
                  twilight_self.displayModal("you cannot place there...");
                }
              });
            }
          }
          return 0;
        }
      } else {

        this.updateLog("US gets the China Card (face up)");

        //
        // us gets china card face up
        //
        this.game.state.events.china_card = 0;

        if (this.game.player == 1) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].hand[i] == "china") {
              this.game.deck[0].hand.splice(i, 1);
            }
          }
        }
        if (this.game.player == 2) {
          if (! this.game.deck[0].hand.includes("china")) {
            this.game.deck[0].hand.push("china");
          }
        }

        return 1;
      }
    }



    //
    // South African Unrest
    //
    if (card == "southafrican") {

      if (this.game.player == 2) {
        this.updateStatus("USSR is playing South African Unrest");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.updateStatus('USSR chooses:<p></p><ul><li class="card" id="southafrica">2 Influence in South Africa</li><li class="card" id="adjacent">1 Influence in South Africa and 2 Influence in adjacent countries</li></ul>');

        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");

          if (action2 == "southafrica") {

            twilight_self.placeInfluence("southafrica", 2, "ussr", function() {
              twilight_self.addMove("resolve\tsouthafrican");
              twilight_self.addMove("place\tussr\tussr\tsouthafrica\t2");
              twilight_self.endTurn();
            });
            return 0;

          }
          if (action2 == "adjacent") {

            twilight_self.placeInfluence("southafrica", 1, "ussr", function() {
              twilight_self.addMove("resolve\tsouthafrican");
              twilight_self.addMove("place\tussr\tussr\tsouthafrica\t1");

              twilight_self.updateStatus("Place two influence in countries adjacent to South Africa");

              var ops_to_place = 2;

              for (var i in twilight_self.countries) {

                let countryname  = i;
                let divname      = '#'+i;

                if (i == "angola" || i == "botswana") {

                  $(divname).off();
                  $(divname).on('click', function() {

                    let c = $(this).attr('id');
                    twilight_self.placeInfluence(c, 1, "ussr", function() {

                      twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                      ops_to_place--;
                      if (ops_to_place == 0) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      }
                    });
                  });
                };
              }
            });
          }
        });
        return 0;
      }
    }




    //
    // How I Learned to Stop Worrying
    //
    if (card == "howilearned") {

      let twilight_self = this;

      let my_go = 0;

      if (player == "ussr") { this.game.state.milops_ussr = 5; }
      if (player == "us") { this.game.state.milops_us = 5; }

      if (player == "ussr" && this.game.player == 1) { my_go = 1; }
      if (player == "us"   && this.game.player == 2) { my_go = 1; }

      if (my_go == 1) {

        twilight_self.updateStatus('Set DEFCON at level:<p></p><ul><li class="card" id="five">five</li><li class="card" id="four">four</li><li class="card" id="three">three</li><li class="card" id="two">two</li><li class="card" id="one">one</li></ul>');

        $('.card').off();
        $('.card').on('click', function() {

          let defcon_target = 5;

          let action2 = $(this).attr("id");

          twilight_self.addMove("resolve\thowilearned");

          if (action2 == "one")   { defcon_target = 1; }
          if (action2 == "two")   { defcon_target = 2; }
          if (action2 == "three") { defcon_target = 3; }
          if (action2 == "four")  { defcon_target = 4; }
          if (action2 == "five")  { defcon_target = 5; }

          if (defcon_target > twilight_self.game.state.defcon) {
            let defcon_diff = defcon_target-twilight_self.game.state.defcon;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\traise");
            }
          }

          if (defcon_target < twilight_self.game.state.defcon) {
            let defcon_diff = twilight_self.game.state.defcon - defcon_target;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\tlower");
            }
          }

          twilight_self.endTurn();

        });
      }
      return 0;
    }





    //
    // OAS
    //
    if (card == "oas") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing OAS");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 2;

        twilight_self.addMove("resolve\toas");

        this.updateStatus("US places two influence in Central or South America");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          if (i == "venezuela" || i == "colombia" || i == "ecuador" || i == "peru" || i == "chile" || i == "bolivia" || i == "argentina" || i == "paraguay" || i == "uruguay" || i == "brazil" || i == "mexico" || i == "guatemala" || i == "elsalvador" || i == "honduras" || i == "nicaragua" || i == "costarica" || i == "panama" || i == "cuba" || i == "haiti" || i == "dominicanrepublic") {

            twilight_self.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "us", function() {
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }
        return 0;
      }
    }





    //
    // Allende
    //
    if (card == "allende") {
      this.placeInfluence("chile", 2, "ussr");
      return 1;
    }



    //
    // Panama Canal
    //
    if (card == "panamacanal") {
      this.placeInfluence("panama", 1, "us");
      this.placeInfluence("venezuela", 1, "us");
      this.placeInfluence("costarica", 1, "us");
      return 1;
    }



    //
    // Camp David
    //
    if (card == "campdavid") {

      this.game.state.events.campdavid = 1;

      this.updateLog("US gets 1 VP for Camp David Accords");

      this.game.state.vp += 1;
      this.updateVictoryPoints();

      this.placeInfluence("israel", 1, "us");
      this.placeInfluence("egypt", 1, "us");
      this.placeInfluence("jordan", 1, "us");
      return 1;
    }





    //
    // Sadat Expels Soviets
    //
    if (card == "sadat") {
      if (this.countries["egypt"].ussr > 0) {
        this.removeInfluence("egypt", this.countries["egypt"].ussr, "ussr");
      }
      this.placeInfluence("egypt", 1, "us");
      return 1;
    }




    //
    // U2 Incident
    //
    if (card == "u2") {

      this.game.state.events.u2 = 1;
      this.game.state.vp -= 1;
      this.updateVictoryPoints();

      return 1;
    }





    //
    // Portuguese Empire Crumbles
    //
    if (card == "portuguese") {
      this.placeInfluence("seafricanstates", 2, "ussr");
      this.placeInfluence("angola", 2, "ussr");
      return 1;
    }



    //
    // John Paul II
    //
    if (card == "johnpaul") {

      this.game.state.events.johnpaul = 1;

      this.removeInfluence("poland", 2, "ussr");
      this.placeInfluence("poland", 1, "us");
      return 1;
    }



    //
    // Colonial Rear Guards //
    //
    if (card == "colonial") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing Colonial Rear Guards");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 4;
        twilight_self.addMove("resolve\tcolonial");

        this.updateStatus("US place four influence in Africa or Asia (1 per country)");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "morocco" || i == "algeria" || i == "tunisia" || i == "westafricanstates" || i == "saharanstates" || i == "sudan" || i == "ivorycoast" || i == "nigeria" || i == "ethiopia" || i == "somalia" || i == "cameroon" || i == "zaire" || i == "kenya" || i == "angola" || i == "seafricanstates" || i == "zimbabwe" || i == "botswana" || i == "southafrica" || i == "philippines" || i == "indonesia" || i == "malaysia" || i == "vietnam" || i == "thailand" || i == "laos" || i == "burma") {
            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "us", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }
        return 0;
      }
    }


    //
    // Brezhnev Doctrine
    //
    if (card == "brezhnev") {
      this.game.state.events.brezhnev = 1;
      return 1;
    }





    //
    // We Will Bury You
    //
    if (card == "wwby") {

      this.game.state.events.wwby = 1;

      this.lowerDefcon();
      this.updateDefcon();

      if (this.game.state.defcon <= 1 && this.game.over != 1) {
        if (this.game.state.turn == 0) {
          this.endGame("us", "defcon");
        } else {
          this.endGame("ussr", "defcon");
        }
        return 0;
      }
      return 1;
    }







    //
    // One Small Step
    //
    if (card == "onesmallstep") {
      if (player == "us") {
        if (this.game.state.space_race_us < this.game.state.space_race_ussr) {
          this.updateLog("US takes one small step into space...");
          this.game.state.space_race_us += 1;
    if (this.game.state.space_race_us == 2) { this.game.state.animal_in_space = ""; }
    if (this.game.state.space_race_us == 4) { this.game.state.man_in_earth_orbit = ""; }
    if (this.game.state.space_race_us == 6) { this.game.state.eagle_has_landed = ""; }
    if (this.game.state.space_race_us == 8) { this.game.state.space_shuttle = ""; }
          this.advanceSpaceRace("us");
        }
      } else {
        if (this.game.state.space_race_ussr < this.game.state.space_race_us) {
          this.updateLog("USSR takes one small step into space...");
          this.game.state.space_race_ussr += 1;
    if (this.game.state.space_race_ussr == 2) { this.game.state.animal_in_space = ""; }
    if (this.game.state.space_race_ussr == 4) { this.game.state.man_in_earth_orbit = ""; }
    if (this.game.state.space_race_ussr == 6) { this.game.state.eagle_has_landed = ""; }
    if (this.game.state.space_race_ussr == 8) { this.game.state.space_shuttle = ""; }
          this.advanceSpaceRace("ussr");
        }
      }

      return 1;
    }



    //
    // Alliance for Progress
    //
    if (card == "alliance") {

      let us_bonus = 0;

      if (this.isControlled("us", "mexico") == 1)     { us_bonus++; }
      if (this.isControlled("us", "cuba") == 1)       { us_bonus++; }
      if (this.isControlled("us", "panama") == 1)     { us_bonus++; }
      if (this.isControlled("us", "chile") == 1)      { us_bonus++; }
      if (this.isControlled("us", "argentina") == 1)  { us_bonus++; }
      if (this.isControlled("us", "brazil") == 1)     { us_bonus++; }
      if (this.isControlled("us", "venezuela") == 1)  { us_bonus++; }

      this.game.state.vp += us_bonus;
      this.updateVictoryPoints();
      this.updateLog("<span>US VP bonus is:</span> " + us_bonus);

      return 1;

    }




    //
    // Lone Gunman
    //
    if (card == "lonegunman") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing Lone Gunman");
        return 0;
      }
      if (this.game.player == 2) {

        this.addMove("resolve\tlonegunman");
        this.updateStatus("US is playing Lone Gunman");

        if (this.game.deck[0].hand.length < 1) {
          this.addMove("ops\tussr\tlonegunman\t1");
          this.addMove("notify\tUS has no cards to reveal");
          this.endTurn();
        } else {
          let revealed = "";
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (i > 0) { revealed += ", "; }
            revealed += this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
          }
          this.addMove("ops\tussr\tlonegunman\t1");
          this.addMove("notify\tUS holds: "+revealed);
          this.endTurn();
        }
      }
      return 0;
    }



    //
    // OPEC
    //
    if (card == "opec") {

      if (this.game.state.events.northseaoil == 0) {

        let ussr_bonus = 0;

        if (this.isControlled("ussr", "egypt") == 1)       { ussr_bonus++; }
        if (this.isControlled("ussr", "iran") == 1)        { ussr_bonus++; }
        if (this.isControlled("ussr", "libya") == 1)       { ussr_bonus++; }
        if (this.isControlled("ussr", "saudiarabia") == 1) { ussr_bonus++; }
        if (this.isControlled("ussr", "gulfstates") == 1)  { ussr_bonus++; }
        if (this.isControlled("ussr", "iraq") == 1)        { ussr_bonus++; }
        if (this.isControlled("ussr", "venezuela") == 1)   { ussr_bonus++; }

        this.game.state.vp -= ussr_bonus;
        this.updateVictoryPoints();
        this.updateLog("<span>USSR VP bonus is:</span> " + ussr_bonus);

      }

      return 1;

    }




    //
    // Brush War
    //
    if (card == "brushwar") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (me != player) {
        let burned = this.rollDice(6);
        return 0;
      }
      if (me == player) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tbrushwar");
        twilight_self.updateStatus('Pick target for Brush War');



        for (var i in twilight_self.countries) {

          if (twilight_self.countries[i].control <= 2) {

            let play_brush_war = 1;
            let divname = "#" + i;

            if (i === "italy") {
              if (twilight_self.game.state.events.nato == 1) {
                if (twilight_self.isControlled("us", "italy") == 1) {
                  play_brush_war = 0;
                }
              }
            }

            if (play_brush_war == 1) {

              $(divname).off();
              $(divname).on('click', function() {

                let c = $(this).attr('id');

                twilight_self.displayModal("Launching Brush War in "+twilight_self.countries[c].name);

                let dieroll = twilight_self.rollDice(6);
                let modify = 0;

                for (let v = 0; v < twilight_self.countries[c].neighbours.length; v++) {
                  if (twilight_self.isControlled(opponent, v) == 1) {
                    modify++;
                  }
                }

                if (twilight_self.game.player == 1) {
                  if (c == "mexico") { modify++; }
                  if (c == "cuba") { modify++; }
                  if (c == "japan") { modify++; }
                  if (c == "canada") { modify++; }
                }
                if (twilight_self.game.player == 2) {
                  if (c == "finland") { modify++; }
                  if (c == "romania") { modify++; }
                  if (c == "afghanistan") { modify++; }
                  if (c == "northkorea") { modify++; }
                }

                dieroll = dieroll - modify;

                if (dieroll >= 3) {

                  let usinf = twilight_self.countries[c].us;
                  let ussrinf = twilight_self.countries[c].ussr;

                  if (me == "us") {
                    twilight_self.removeInfluence(c, ussrinf, "ussr");
                    twilight_self.placeInfluence(c, ussrinf, "us");
                    twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ussrinf);
                    twilight_self.addMove("place\tus\tus\t"+c+"\t"+ussrinf);
                    twilight_self.addMove("milops\tus\t3");
                    if (twilight_self.game.state.events.flowerpower == 1) {
                      twilight_self.addMove("vp\tus\t1\t1");
                    } else {
                      twilight_self.addMove("vp\tus\t1");
                    }
                    twilight_self.endTurn();
                  } else {
                    twilight_self.removeInfluence(c, usinf, "us");
                    twilight_self.placeInfluence(c, usinf, "ussr");
                    twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+usinf);
                    twilight_self.addMove("place\tussr\tussr\t"+c+"\t"+usinf);
                    twilight_self.addMove("milops\tussr\t3");
                    if (twilight_self.game.state.events.flowerpower == 1) {
                      twilight_self.addMove("vp\tussr\t1\t1");
                    } else {
                      twilight_self.addMove("vp\tussr\t1");
                    }
                  }
                  twilight_self.addMove("notify\tBrush War in "+twilight_self.countries[c].name+" succeeded.");
                  twilight_self.addMove("notify\tBrush War rolls "+dieroll);
                  twilight_self.endTurn();

                } else {
                  if (me == "us") {
                    twilight_self.addMove("milops\tus\t3");
                  } else {
                    twilight_self.addMove("milops\tussr\t3");
                  }
                  twilight_self.addMove("notify\tBrush War in "+twilight_self.countries[c].name+" failed.");
                  twilight_self.addMove("notify\tBrush War rolls "+dieroll);
                  twilight_self.endTurn();
                }
              });
            }
          }
        }
      }
      return 0;
    }




    //
    // Arms Race
    //
    if (card == "armsrace") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player == "us") {
        if (this.game.state.milops_us > this.game.state.milops_ussr) {
          this.updateLog("US gains 1 VP from Arms Race");
          this.game.state.vp += 1;
          if (this.game.state.milops_us >= this.game.state.defcon) {
            this.updateLog("US gains 2 bonus VP rom Arms Race");
            this.game.state.vp += 2;
          }
        }
      } else {
        if (this.game.state.milops_ussr > this.game.state.milops_us) {
          this.updateLog("USSR gains 1 VP from Arms Race");
          this.game.state.vp -= 1;
          if (this.game.state.milops_ussr >= this.game.state.defcon) {
            this.updateLog("USSR gains 2 bonus VP from Arms Race");
            this.game.state.vp -= 2;
          }
        }
      }

      this.updateVictoryPoints();
      return 1;

    }
















    //////////////
    // LATE WAR //
    //////////////


    //
    // Iranian Hostage Crisis
    //
    if (card == "iranianhostage") {
      this.game.state.events.iranianhostage = 1;
      if (this.countries["iran"].us > 0) { this.removeInfluence("iran", this.countries["iran"].us, "us"); }
      this.placeInfluence("iran", 2, "ussr");
      return 1;
    }



    //
    // North Sea Oil
    //
    if (card == "northseaoil") {
      this.game.state.events.northseaoil = 1;
      this.game.state.events.northseaoil_bonus = 1;
      return 1;
    }



    //
    // Marine Barracks Bombing
    //
    if (card == "marine") {

      this.countries["lebanon"].us = 0;
      this.showInfluence("lebanon", "us");
      this.updateLog("All US influence removed from Lebanon");

      let ustroops = 0;
      for (var i in this.countries) {
        if (this.countries[i].region == "mideast") {
          ustroops += this.countries[i].us;
        }
      }

      if (ustroops == 0) {
        this.updateLog("US has no influence in the Middle-East");
        return 1;
      }

      if (this.game.player == 2) {
        return 0;
      }
      if (this.game.player == 1) {

        this.addMove("resolve\tmarine");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_purge = 2;

        var ops_available = 0;
        for (var i in this.countries) {
          if (this.countries[i].region == "mideast") {
            if (this.countries[i].us > 0) {
              ops_available += this.countries[i].us;
            }
          }
        }

        if (ops_available < 2) { ops_to_purge = ops_available; }

        this.updateStatus("Remove</span> <span>"+ops_to_purge+" </span>US influence from the Middle East");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (this.countries[i].region == "mideast") {

            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Country");
              } else {
                twilight_self.removeInfluence(c, 1, "us", function() {
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                  ops_to_purge--;
                  if (ops_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              }
            });
          }
        }
        return 0;
      }
    }





    //
    // Latin American Debt Crisis
    //
    if (card == "debtcrisis") {

      if (this.game.player == 1) {
        this.updateStatus("US playing Latin American Debt Crisis");
        return 0;
      }

      let cards_available = 0;
      let twilight_self = this;

      let user_message = "<span>Choose a card to discard or USSR doubles influence in two countries in South America:</span><p></p><ul>";
      for (i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) > 2 && this.game.deck[0].hand[i] != "china") {
          user_message += '<li class="card showcard" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
          cards_available++;
        }
      }
      user_message += '<li class="card showcard" id="nodiscard">[do not discard]</li>';
      user_message += '</ul>';
      this.updateStatus(user_message);


      if (cards_available == 0) {
        this.addMove("resolve\tdebtcrisis");
        this.addMove("latinamericandebtcrisis");
        this.addMove("notify\tUS has no cards available for Latin American Debt Crisis");
        this.endTurn();
        return 0;
      }


      $('.card').off();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        if (action2 == "nodiscard") {
          twilight_self.addMove("resolve\tdebtcrisis");
          twilight_self.addMove("latinamericandebtcrisis");
          twilight_self.endTurn();
          return 0;
        }

        twilight_self.addMove("resolve\tdebtcrisis");
        twilight_self.addMove("discard\tus\t"+action2);
        twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+action2+"\">"+twilight_self.game.deck[0].cards[action2].name + "</span>");
        twilight_self.removeCardFromHand(action2);
        twilight_self.endTurn();

      });

      return 0;
    }





    //
    // AWACS Sale to Saudis
    //
    if (card == "awacs") {
      this.game.state.events.awacs = 1;
      this.countries["saudiarabia"].us += 2;
      this.showInfluence("saudiarabia", "us");
      return 1;
    }



    //
    // Iran-Iraq War
    //
    if (card == "iraniraq") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (me != player) {
        let burned = this.rollDice(6);
        return 0;
      }
      if (me == player) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tiraniraq");
        twilight_self.updateStatus('Iran-Iraq War. Choose Target:<p></p><ul><li class="card" id="invadeiraq">Iraq</li><li class="card" id="invadeiran">Iran</li></ul>');

        let target = 4;

        $('.card').off();
        $('.card').on('click', function() {

          let invaded = $(this).attr("id");

          if (invaded == "invadeiran") {

            if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "iraq") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "afghanistan") == 1) { target++; }

            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tiran\t"+twilight_self.countries['iran'].ussr);
                twilight_self.addMove("remove\tus\tussr\tiran\t"+twilight_self.countries['iran'].ussr);
                twilight_self.addMove("milops\tus\t2");
                if (twilight_self.game.state.events.flowerpower == 1) {
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("iran", twilight_self.countries['iran'].ussr, "us");
                twilight_self.removeInfluence("iran", twilight_self.countries['iran'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("iran", "ussr");
              } else {
                twilight_self.addMove("place\tussr\tussr\tiran\t"+twilight_self.countries['iran'].us);
                twilight_self.addMove("remove\tussr\tus\tiran\t"+twilight_self.countries['iran'].us);
                twilight_self.addMove("milops\tussr\t2");
                if (twilight_self.game.state.events.flowerpower == 1) {
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("iran", twilight_self.countries['iran'].us, "ussr");
                twilight_self.removeInfluence("iran", twilight_self.countries['iran'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("iran", "ussr");
              }
            } else {

              if (player == "us") {
                twilight_self.addMove("milops\tus\t2");
                if (twilight_self.game.state.events.flowerpower == 1) {
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
                twilight_self.endTurn();
              } else {
                twilight_self.addMove("milops\tussr\t2");
                if (twilight_self.game.state.events.flowerpower == 1) {
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
                twilight_self.endTurn();
              }

            }

          }
          if (invaded == "invadeiraq") {

            if (twilight_self.isControlled(opponent, "iran") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "jordan") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "gulfstates") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "saudiarabia") == 1) { target++; }

            let die = twilight_self.rollDice(6);

            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tiraq\t"+twilight_self.countries['iraq'].ussr);
                twilight_self.addMove("remove\tus\tussr\tiraq\t"+twilight_self.countries['iraq'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("iraq", twilight_self.countries['iraq'].ussr, "us");
                twilight_self.removeInfluence("iraq", twilight_self.countries['iraq'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("iraq", "ussr");
              } else {
                twilight_self.addMove("place\tus\tussr\tiraq\t"+twilight_self.countries['iraq'].us);
                twilight_self.addMove("remove\tus\tus\tiraq\t"+twilight_self.countries['iraq'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("iraq", twilight_self.countries['iraq'].us, "ussr");
                twilight_self.removeInfluence("iraq", twilight_self.countries['iraq'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("iraq", "ussr");
              }
            } else {

              if (player == "us") {
                twilight_self.addMove("milops\tus\t2");
                if (twilight_self.game.state.events.flowerpower == 1) {
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
                twilight_self.endTurn();
              } else {
                twilight_self.addMove("milops\tussr\t2");
                if (twilight_self.game.state.events.flowerpower == 1) {
                  twilight_self.addMove("vp\tussr\t2\t1");
                }
                twilight_self.endTurn();
              }
            }
          }
        });
      }
      return 0;
    }




    //
    // Tear Down This Wall
    //
    if (card === "teardown") {

      this.game.state.events.teardown = 1;
      this.game.state.events.willybrandt = 0;
      if (this.game.state.events.nato == 1) {
        this.game.state.events.nato_westgermany = 1;
      }

      this.countries["eastgermany"].us += 3;
      this.showInfluence("eastgermany", "us");

      if (this.game.player == 2) {
        this.addMove("resolve\tteardown");
        this.addMove("teardownthiswall\tus");
        this.endTurn();
      }

      return 0;
    }




    //
    // Chernobyl
    //
    if (card == "chernobyl") {

      if (this.game.player == 1) {
        this.updateStatus("US is playing Chernobyl");
        return 0;
      }

      let html = "<span>Chernobyl triggered. Designate region to prohibit USSR placement of influence from OPS: </span><p></p><ul>";
          html += '<li class="card" id="asia">Asia</li>';
          html += '<li class="card" id="europe">Europe</li>';
          html += '<li class="card" id="africa">Africa</li>';
          html += '<li class="card" id="camerica">Central America</li>';
          html += '<li class="card" id="samerica">South America</li>';
          html += '<li class="card" id="mideast">Middle-East</li>';
          html += '</ul>';

      this.updateStatus(html);

      let twilight_self = this;

      $('.card').off();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        twilight_self.addMove("resolve\tchernobyl");
        twilight_self.addMove("chernobyl\t"+action2);
        twilight_self.addMove("notify\tUS restricts placement in "+action2);
        twilight_self.endTurn();

      });

      return 0;
    }




    //
    // Aldrich Ames Remix
    //
    if (card == "aldrichames") {

      this.game.state.events.aldrich = 1;

      if (this.game.player == 1) {
        this.updateStatus("US is revealing its cards to USSR");
        return 0;
      }
      if (this.game.player == 2) {

        this.updateStatus("USSR is playing Aldrich Ames");

        this.addMove("resolve\taldrichames");

        let cards_to_reveal = this.game.deck[0].hand.length;
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] === "china") { cards_to_reveal--; }
          else {
            this.addMove(this.game.deck[0].hand[i]);
          }
        }
        this.addMove("aldrich\tus\t"+cards_to_reveal);
        this.endTurn();

      }
      return 0;
    }



    //
    // Solidarity
    //
    if (card == "solidarity") {
      if (this.game.state.events.johnpaul == 1) {
        this.placeInfluence("poland", 3, "us");
      }
      return 1;
    }




    //
    // Star Wars
    //
    if (card == "starwars") {

      if (this.game.state.space_race_us <= this.game.state.space_race_ussr) {
        this.updateLog("US is not ahead of USSR in the space race");
        return 1;
      }

      this.game.state.events.starwars = 1;

      // otherwise sort through discards
      let discardlength = 0;
      for (var i in this.game.deck[0].discards) { discardlength++; }
      if (discardlength == 0) {
        this.updateLog("No cards in discard pile");
        return 1;
      }

      if (this.game.player == 1) {
        this.updateStatus("Opponent retrieving event from discard pile");
        return 0;
      }


      var twilight_self = this;

      this.addMove("resolve\tstarwars");


      let user_message = "Choose card to reclaim: <p></p><ul>";
      for (var i in this.game.deck[0].discards) {
        if (this.game.state.headline == 1 && i == "unintervention") {} else {
          if (this.game.deck[0].cards[i] != undefined) {
            if (this.game.deck[0].cards[i].name != undefined) {
              if (this.game.deck[0].cards[i].scoring != 1) {
                user_message += '<li class="card showcard" id="'+i+'">'+this.game.deck[0].cards[i].name+'</li>';
              }
            }
          }
        }
      }
      user_message += '</li>';
      twilight_self.updateStatus(user_message);

      twilight_self.addShowCardEvents(function(card) {

        let action2 = $(card).attr("id");

        if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
          twilight_self.mobileCardSelect(card, player, function() {
            twilight_self.addMove("event\tus\t"+action2);
            twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
            twilight_self.endTurn();
          }, "play event");
          return 0;
        }

        twilight_self.addMove("event\tus\t"+action2);
        twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
        twilight_self.endTurn();

      });

      return 0;
    }




    //
    // Iran-Contra Scandal
    //
    if (card == "irancontra") {
      this.game.state.events.irancontra = 1;
      return 1;
    }




    //
    // Yuri and Samantha
    //
    if (card == "yuri") {
      this.game.state.events.yuri = 1;
      return 1;
    }





    //
    // Wargames
    //
    if (card == "wargames") {

      if (this.game.state.defcon != 2) {
        this.updateLog("Wargames event cannot trigger as DEFCON is not at 2");
        return 1;
      }

      let twilight_self = this;
      let player_to_go = 1;
      if (player == "us") { player_to_go = 2; }

      let choicehtml = '<span>Wargames triggers. Do you want to give your opponent 6 VP and End the Game? (VP ties will be won by opponents)</span><p></p><ul><li class="card" id="endgame">end the game</li><li class="card" id="cont">continue playing</li></ul>';

      if (player_to_go == this.game.player) {
        this.updateStatus(choicehtml);
      } else {
        this.updateStatus("Opponent deciding whether to trigger Wargames...");
        return 0;
      }

      $('.card').off();
      $('.card').on('click', function() {
        let action2 = $(this).attr("id");
        if (action2 == "endgame") {
          twilight_self.updateStatus("Triggering Wargames...");
          twilight_self.addMove("resolve\twargames");
          twilight_self.addMove("wargames\t"+player+"\t1");
          twilight_self.endTurn();
        }
        if (action2 == "cont") {
          twilight_self.updateStatus("Discarding Wargames...");
          twilight_self.addMove("resolve\twargames");
          twilight_self.addMove("wargames\t"+player+"\t0");
          twilight_self.endTurn();
        }
      });

      return 0;
    }




    //
    // An Evil Empire
    //
    if (card == "evilempire") {

      this.game.state.events.evilempire = 1;
      this.game.state.events.flowerpower = 0;

      this.game.state.vp += 1;
      this.updateVictoryPoints();

      return 1;

    }




    //
    // The Iron Lady
    //
    if (card == "ironlady") {

      this.game.state.vp += 1;
      this.updateVictoryPoints();

      //
      // keep track of whether the USSR has influence in Argentina in order
      // to know whether it can place there or beside Argentina if it plays
      // ops after the event, and uses the US event to get influence into the
      // country..
      //
      this.game.state.ironlady_before_ops = 1;

      this.placeInfluence("argentina", 1, "ussr");
      if (this.countries["uk"].ussr > 0) { this.removeInfluence("uk", this.countries["uk"].ussr, "ussr"); }

      this.game.state.events.ironlady = 1;

      return 1;
    }




    //
    // Reagan Bombs Libya
    //
    if (card == "reagan") {

      let us_vp = 0;
      let x = this.countries["libya"].ussr;

      if (x >= 2) {
        while (x > 1) {
          x -= 2;
          us_vp++;
        }
        this.updateLog("<span>Reagan bombs Libya and US scores</span> "+us_vp+" <span>VP</span>");
        this.game.state.vp += us_vp;
        this.updateVictoryPoints();
      }

      return 1;
    }






    //
    // Soviets Shoot Down KAL-007
    //
    if (card == "KAL007") {

      this.game.state.vp += 2;
      this.updateVictoryPoints();

      this.lowerDefcon();

      if (this.isControlled("us", "southkorea") == 1) {
        this.addMove("resolve\tKAL007");
        this.addMove("unlimit\tcoups");
        this.addMove("ops\tus\tKAL007\t4");
        this.addMove("limit\tcoups");
        this.endTurn();
        return 0;
      } else {
        return 1;
      }

    }




    //
    // Pershing II Deployed
    //
    if (card == "pershing") {

      if (this.game.player == 2) {
        this.updateStatus("USSR playing Pershing II Deployed");
        return 0;
      }
      if (this.game.player == 1) {

        this.updateStatus("Remove 3 US influence from Western Europe (max 1 per country)");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tpershing");
        twilight_self.addMove("vp\tussr\t1");

        let valid_targets = 0;
        for (var i in this.countries) {
          let countryname  = i;
          let divname      = '#'+i;
          if (twilight_self.countries[countryname].us > 0) {
            valid_targets++;
          }
        }

        if (valid_targets == 0) {
          twilight_self.addMove("notify\tUS does not have any targets for Pershing II");
          twilight_self.endTurn();
          return;
        }

        var ops_to_purge = 3;
        if (valid_targets < ops_to_purge) { ops_to_purge = valid_targets; }

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (countryname == "turkey" ||
              countryname == "greece" ||
              countryname == "spain" ||
              countryname == "italy" ||
              countryname == "france" ||
              countryname == "canada" ||
              countryname == "uk" ||
              countryname == "benelux" ||
              countryname == "denmark" ||
              countryname == "austria" ||
              countryname == "norway" ||
              countryname == "sweden" ||
              countryname == "finland" ||
              countryname == "westgermany") {

            if (twilight_self.countries[countryname].us > 0) {

              twilight_self.countries[countryname].place = 1;
              $(divname).off();
              $(divname).on('click', function() {

                  let c = $(this).attr('id');

                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Country");
                } else {
                  twilight_self.countries[c].place = 0;
                  twilight_self.removeInfluence(c, 1, "us", function() {
                    twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                    ops_to_purge--;
                    if (ops_to_purge == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                    }
                  });
                }
              });
            }
          }
        }
      }
      return 0;
    }




    //
    // Terrorism
    //
    if (card == "terrorism") {

      let cards_to_discard = 1;
      let target = "ussr";
      let twilight_self = this;

      if (player == "ussr") { target = "us"; }
      if (target == "us") { if (this.game.state.events.iranianhostage == 1) { cards_to_discard = 2; } }

      this.addMove("resolve\tterrorism");

      if (this.game.player == 2 && target == "us") {

        let available_cards = this.game.deck[0].hand.length;
        for (let z = 0; z < this.game.deck[0].hand.length; z++) {
          if (this.game.deck[0].hand[z] == "china") { available_cards--; }
        }
        if (available_cards < cards_to_discard) { cards_to_discard = available_cards; }

        if (cards_to_discard == 0) { this.addMove("notify\tUS has no cards to discard"); }


        for (let i = 0; i < cards_to_discard; i++) {
          this.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
            roll = parseInt(roll)-1;
            let card = twilight_self.game.deck[0].hand[roll];

            if (card == "china") {
              if (roll-2 >= 0) { card = twilight_self.game.deck[0].hand[roll-2]; } else {
                card = twilight_self.game.deck[0].hand[roll];
              }
            }

            twilight_self.removeCardFromHand(card);
            twilight_self.addMove("dice\tburn\tussr");
            twilight_self.addMove("discard\tus\t"+card);
              twilight_self.addMove("notify\t"+target.toUpperCase()+" discarded "+twilight_self.game.deck[0].cards[card].name);
          });
        }
        twilight_self.endTurn();
      }
      if (this.game.player == 1 && target == "ussr") {

        let available_cards = this.game.deck[0].hand.length;
        for (let z = 0; z < this.game.deck[0].hand.length; z++) {
          if (this.game.deck[0].hand[z] == "china") { available_cards--; }
        }
        if (available_cards < cards_to_discard) { cards_to_discard = available_cards; }

        if (cards_to_discard == 0) { this.addMove("notify\tUSSR has no cards to discard"); this.endTurn(); return 0; }
        this.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
            roll = parseInt(roll)-1;
            let card = twilight_self.game.deck[0].hand[roll];

            if (card == "china") {
              if (roll-2 >= 0) { card = twilight_self.game.deck[0].hand[roll-2]; } else {
                card = twilight_self.game.deck[0].hand[roll];
              }
            }

            twilight_self.removeCardFromHand(card);
            twilight_self.addMove("dice\tburn\tus");
            twilight_self.addMove("discard\tussr\t"+card);
              twilight_self.addMove("notify\t"+target.toUpperCase()+" discarded "+twilight_self.game.deck[0].cards[card].name);
            twilight_self.endTurn();
        });
      }

      return 0;
    }









    //
    // Glasnost
    //
    if (card == "glasnost") {

      let twilight_self = this;

      this.game.state.defcon += 1;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
      this.game.state.vp -= 2;
      this.updateDefcon();
      this.updateVictoryPoints();

      this.updateLog("DEFCON increases by 1 point");
      this.updateLog("USSR gains 2 VP");

      if (this.game.state.events.reformer == 1) {
        this.addMove("resolve\tglasnost");
        this.addMove("unlimit\tcoups");
        this.addMove("ops\tussr\tglasnost\t4");
        this.addMove("limit\tcoups");
        this.addMove("notify\tUSSR plays 4 OPS for influence or realignments");
        this.endTurn();
      } else {
        return 1;
      }

      return 0;
    }




    //
    // The Reformer
    //
    if (card == "reformer") {

      this.game.state.events.reformer = 1;

      if (this.game.player == 2) {
        this.updateStatus("Waiting for USSR to play The Reformer");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        let influence_to_add = 4;
        if (this.game.state.vp < 0) { influence_to_add = 6; }

        this.addMove("resolve\treformer");
        this.updateStatus('Add</span> '+influence_to_add+' <span>influence in Europe (max 2 per country)');

        var ops_to_place = influence_to_add;
        var ops_placed = {};
        for (var i in twilight_self.countries) {

          let countryname  = i;
          ops_placed[countryname] = 0;
          let divname      = '#'+i;

          if (this.countries[countryname].region == "europe") {

            this.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Placement");
              } else {
                ops_placed[c]++;
                twilight_self.placeInfluence(c, 1, "ussr", function() {
                  twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                  if (ops_placed[c] >= 2) { twilight_self.countries[c].place = 0; }
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              }
            });
          }
        }
        return 0;
      }

      return 1;
    }



    //
    // Ortega Elected in Nicaragua
    //
    if (card == "ortega") {

      let twilight_self = this;

      this.countries["nicaragua"].us = 0;
      this.showInfluence("nicaragua", "us");

      let can_coup = 0;

      if (this.countries["cuba"].us > 0) { can_coup = 1; }
      if (this.countries["honduras"].us > 0) { can_coup = 1; }
      if (this.countries["costarica"].us > 0) { can_coup = 1; }

      if (can_coup == 0) {
        this.updateLog("notify\tUSSR does not have valid coup target");
        return 1;
      }

      if (this.game.player == 1) {
        this.updateStatus("Pick a country adjacent to Nicaragua to coup: ");
      } else {
        this.updateStatus("USSR is selecting a country for its free coup");
        return 0;
      }

      for (var i in twilight_self.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (i == "costarica" || i == "cuba" || i == "honduras") {

          if (this.countries[i].us > 0) {

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              twilight_self.addMove("resolve\tortega");
              twilight_self.addMove("unlimit\tmilops");
              twilight_self.addMove("coup\tussr\t"+c+"\t2");
              twilight_self.addMove("limit\tmilops");
              twilight_self.addMove("notify\tUSSR launches coup in "+c);
              twilight_self.endTurn();

            });
          }

        } else {

          $(divname).off();
          $(divname).on('click', function() {
            twilight_self.displayModal("Invalid Target");
          });

        }
      }

      return 0;
    }















    //////////////////////////////
    // OPTIONQL COMMUNITY CARDS //
    //////////////////////////////

    //
    // Cultural Diplomacy
    //
    if (card == "culturaldiplomacy") {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      if ((player == "us" && this.game.player == 2) || (player == "ussr" && this.game.player == 1)) {

        twilight_self.addMove("resolve\tculturaldiplomacy");

        this.updateStatus("Place one influence two hops away from a country in which you have existing influence");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let is_this_two_hops = 0;
            let selected_countryname = $(this).attr('id');

        let neighbours = twilight_self.countries[selected_countryname].neighbours;
      for (let z = 0; z < neighbours.length; z++) {

        let this_country = twilight_self.countries[selected_countryname].neighbours[z];
          let neighbours2  = twilight_self.countries[this_country].neighbours;

        for (let zz = 0; zz < neighbours2.length; zz++) {
          let two_hopper = neighbours2[zz];
          if (player == "us") { if ( twilight_self.countries[two_hopper].us > 0) { is_this_two_hops = 1; } }
          if (player == "ussr") { if ( twilight_self.countries[two_hopper].ussr > 0) { is_this_two_hops = 1; } }
          if (is_this_two_hops == 1) { z = 100; zz = 100; }
        }
      }

      if (is_this_two_hops == 1) {
              twilight_self.addMove("place\t"+player+"\t"+player+"\t"+selected_countryname+"\t1");
              twilight_self.placeInfluence(selected_countryname, 1, player, function() {
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.endTurn();
              });
            } else {
        // alert("invalid target");
        twilight_self.displayModal("Invalid Target");
      }
          });
        }
      } else {
        this.updateLog("Opponent is launching a soft-power tour");
      }

      return 0;
    }


    //
    // Handshake in Space
    //
    if (card == "handshake") {
      if (player == "us") {
        this.updateLog("USSR advances in the Space Race...");
        this.game.state.space_race_ussr += 1;
        this.updateSpaceRace();
      } else {
        this.updateLog("US advances in the Space Race...");
        this.game.state.space_race_us += 1;
        this.updateSpaceRace();
      }
      return 1;
    }



    //
    // Rust Lands in Red Square -- credit https://www.reddit.com/user/paul_thomas84/
    //
    if (card == "rustinredsquare") {
      this.updateLog("DEFCON increases by 1");
      this.updateLog("USSR milops reset to 0");
      this.game.state.defcon++;
      this.game.state.milops_ussr = 0;
      this.updateDefcon();
      this.updateMilitaryOperations();
      return 1;
    }



    //
    // Gouzenko Affair -- credit https://www.reddit.com/user/ludichrisness/
    //
    if (card == "gouzenkoaffair") {
      this.updateLog("Canada now permanently adjacent to USSR");
      this.game.countries['canada'].ussr += 2;
      this.game.state.events.optional.gouzenkoaffair = 1;
      this.showInfluence("canada", "ussr");
      return 1;
    }




    //
    // Berlin Agreement -- credit https://www.reddit.com/user/mlhermann/
    //
    if (card == "berlinagreement") {

      this.game.state.events.optional.berlinagreement = 1;

      let twilight_self = this;

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      this.game.countries['eastgermany'].us += 2;
      this.game.countries['westgermany'].ussr += 2;

      this.showInfluence("eastgermany", "us");
      this.showInfluence("westgermany", "ussr");

      let ops_to_place = 1;
      let placeable = [];

      for (var i in twilight_self.countries) {
        let countryname  = i;
        let us_predominates = 0;
        let ussr_predominates = 0;
        if (this.countries[countryname].region == "europe") {
          if (this.countries[countryname].us > this.countries[countryname].ussr) { us_predominates = 1; }
          if (this.countries[countryname].us < this.countries[countryname].ussr) { ussr_predominates = 1; }
    if (player == "us" && us_predominates == 1) { placeable.push(countryname); }
    if (player == "ussr" && ussr_predominates == 1) { placeable.push(countryname); }
        }
      }

      if (placeable.length == 0) {
        this.updateLog(player + " cannot place 1 additional OP");
        return 1;
      } else {

        if (player == opponent) {
    this.updateStatus("Opponent is placing 1 influence in a European country in which they have a predominance of influence");
    return 0;
        }

        this.addMove("resolve\tberlinagreement");
        this.updateStatus("Place 1 influence in a European country in which you have a predominance of influence");

        for (let i = 0; i < placeable.length; i++) {

          let countryname = placeable[i];
          let divname = "#"+placeable[i];

          this.game.countries[placeable[i]].place = 1;

          $(divname).off();
          $(divname).on('click', function() {

            twilight_self.placeInfluence(countryname, 1, player, function() {
              twilight_self.addMove("place\t"+player+"\t"+player+"\t"+countryname+"\t1");
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
            });

    });

        }

      }

      return 0;
    }




    //
    // return 0 so other cards do not trigger infinite loop
    //
    return 0;
  }




  isControlled(player, country) {

    if (this.countries[country] == undefined) { return 0; }

    let country_lead = 0;

    if (player == "ussr") {
      country_lead = parseInt(this.countries[country].ussr) - parseInt(this.countries[country].us);
    }
    if (player == "us") {
      country_lead = parseInt(this.countries[country].us) - parseInt(this.countries[country].ussr);
    }

    if (this.countries[country].control <= country_lead) { return 1; }
    return 0;

  }



  returnOpsOfCard(card="", deck=0) {
    if (this.game.deck[deck].cards[card] != undefined) {
      return this.game.deck[deck].cards[card].ops;
    }
    if (this.game.deck[deck].discards[card] != undefined) {
      return this.game.deck[deck].discards[card].ops;
    }
    if (this.game.deck[deck].removed[card] != undefined) {
      return this.game.deck[deck].removed[card].ops;
    }
    if (card == "china") { return 4; }
    return 1;
  }



  returnArrayOfRegionBonuses(card="") {

    let regions = [];

    //
    // Vietnam Revolts
    //
    if (this.game.state.events.vietnam_revolts == 1 && this.game.state.events.vietnam_revolts_eligible == 1 && this.game.player == 1) {

      //
      // Vietnam Revolts does not give bonus to 1 OP card in SEA if USSR Red Purged
      // https://boardgamegeek.com/thread/1136951/red-scarepurge-and-vietnam-revolts
      let pushme = 1;
      if (card != "") {
        if (this.game.state.events.redscare_player1 == 1) {
          if (this.returnOpsOfCard(card) == 1) { pushme = 0; }
        }
      }
      if (pushme == 1) {
        regions.push("seasia");
      }
    }

    //
    // The China Card
    //
    if (this.game.state.events.china_card_in_play == 1 && this.game.state.events.china_card_eligible == 1) {
      regions.push("asia");
    }

    return regions;

  }



  isRegionBonus(card="") {

    //
    // Vietnam Revolts
    //
    if (this.game.state.events.vietnam_revolts == 1 && this.game.state.events.vietnam_revolts_eligible == 1 && this.game.player == 1) {

      //
      // Vietnam Revolts does not give bonus to 1 OP card in SEA if USSR Red Purged
      // https://boardgamegeek.com/thread/1136951/red-scarepurge-and-vietnam-revolts
      if (card != "") { if (this.returnOpsOfCard(card) == 1 && this.game.state.events.redscare_player1 == 1) { return 0; } }

      this.updateStatus("Extra 1 OP Available for Southeast Asia");
      this.game.state.events.region_bonus = "seasia";
      return 1;
    }

    //
    // The China Card
    //
    if (this.game.state.events.china_card_in_play == 1 && this.game.state.events.china_card_eligible == 1) {

      this.updateStatus("Extra 1 OP Available for Asia");
      this.game.state.events.region_bonus = "asia";
      return 1;
    }
    return 0;
  }




  endRegionBonus() {
    if (this.game.state.events.vietnam_revolts_eligible == 1 && this.game.state.events.vietnam_revolts == 1) {
      this.game.state.events.vietnam_revolts_eligible = 0;
      return;
    }
    if (this.game.state.events.china_card_eligible == 1) {
      this.game.state.events.china_card_eligible = 0;
      return;
    }
  }


  limitToRegionBonus() {
    for (var i in this.countries) {
      if (this.countries[i].region.indexOf(this.game.state.events.region_bonus) == -1) {
        let divname = '#'+i;
        $(divname).off();
      } else {

    let extra_bonus_available = 0;
    if (this.game.state.events.region_bonus == "seasia" && this.game.state.events.china_card_eligible == 1) {
      extra_bonus_available = 1;
    }

    if (extra_bonus_available == 0) {
            if (this.game.player == 1) {

              // prevent breaking control
              if (this.isControlled("us", i) == 1) {
                let divname = '#'+i;
                $(divname).off();
        }
            } else {

              // prevent breaking control
              if (this.isControlled("ussr", i) == 1) {
                let divname = '#'+i;
                $(divname).off();
        }
      }
    }
        }

    }
    return;
  }



  modifyOps(ops,card="",playernum=0, updatelog=1) {

    if (playernum == 0) { playernum = this.game.player; }

    if (card == "olympic" && ops == 4) {} else {
      if (card != "") { ops = this.returnOpsOfCard(card); }
    }

    if (this.game.state.events.brezhnev == 1 && playernum == 1) {
      if (updatelog == 1) {
        this.updateLog("USSR gets Brezhnev bonus +1");
      }
      ops++;
    }
    if (this.game.state.events.containment == 1 && playernum == 2) {
      if (updatelog == 1) {
        this.updateLog("US gets Containment bonus +1");
      }
      ops++;
    }
    if (this.game.state.events.redscare_player1 == 1 && playernum == 1) {
      if (updatelog == 1) {
        this.updateLog("USSR is affected by Red Purge");
      }
      ops--;
    }
    if (this.game.state.events.redscare_player2 == 1 && playernum == 2) {
      if (updatelog == 1) {
        this.updateLog("US is affected by Red Scare");
      }
      ops--;
    }
    if (ops <= 0) { return 1; }
    if (ops >= 4) { return 4; }
    return ops;
  }



  finalScoring() {

    //
    // disable shuttle diplomacy
    //
    this.game.state.events.shuttlediplomacy = 0;

    //
    //
    //
    if (this.whoHasTheChinaCard() == "ussr") {
      this.game.state.vp--;
      this.updateLog("USSR receives 1 VP for the China Card");
      if (this.game.state.vp <= -20) {
        this.endGame("ussr", "victory points");
        return;
      }
    } else {
      this.game.state.vp++;
      this.updateLog("US receives 1 VP for the China Card");
      if (this.game.state.vp >= 20) {
        this.endGame("us", "victory points");
        return;
      }
    }



    this.scoreRegion("europe");
    this.scoreRegion("asia");
    this.scoreRegion("mideast");
    this.scoreRegion("africa");
    this.scoreRegion("southamerica");
    this.scoreRegion("centralamerica");

    this.updateVictoryPoints();

    if (this.game.state.vp < 0) {
      this.endGame("ussr", "final scoring");
    } else {
      this.endGame("us", "final scoring");
    }

    return 1;
  }



  calculateControlledBattlegroundCountries(scoring, bg_countries) {
    for (var [player, side] of Object.entries(scoring)) {
      for (var country of bg_countries) {
        if (this.isControlled(player, country) == 1) { side.bg++; }
      }
    }
    return scoring;
  }

  calculateControlledCountries(scoring, countries) {
    for (var [player, side] of Object.entries(scoring)) {
      for (var country of countries) {
        if (this.isControlled(player, country) == 1) { side.total++ };
      }
    }
    return scoring;
  }

  determineRegionVictor(scoring, region_scoring_range, max_bg_num) {
    if (scoring.us.bg == max_bg_num && scoring.us.total > scoring.ussr.total) { scoring.us.vp = region_scoring_range.control; }
    else if (scoring.us.bg > scoring.ussr.bg && scoring.us.total > scoring.us.bg && scoring.us.total > scoring.ussr.total) { scoring.us.vp = region_scoring_range.domination; }
    else if (scoring.us.total > 0) { scoring.us.vp = region_scoring_range.presence; }

    if (scoring.ussr.bg == max_bg_num && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = region_scoring_range.control; }
    else if (scoring.ussr.bg > scoring.us.bg && scoring.ussr.total > scoring.ussr.bg && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = region_scoring_range.domination; }
    else if (scoring.ussr.total > 0) { scoring.ussr.vp = region_scoring_range.presence; }

    scoring.us.vp = scoring.us.vp + scoring.us.bg;
    scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;

    return scoring;
  }

  calculateScoring(region) {

    var scoring = {
      us: {total: 0, bg: 0, vp: 0},
      ussr: {total: 0, bg: 0, vp: 0},
    }

    switch (region) {

      ////////////
      // EUROPE //
      ////////////
      case "europe":
        let eu_bg_countries = ["italy", "france", "westgermany", "eastgermany", "poland"];
        let eu_countries = [
          "spain",
          "greece",
          "turkey",
          "yugoslavia",
          "bulgaria",
          "austria",
          "romania",
          "hungary",
          "czechoslovakia",
          "benelux",
          "uk",
          "canada",
          "norway",
          "denmark",
          "sweden",
          "finland",
        ];
        let eu_scoring_range = {presence: 3, domination: 7, control: 10000 };

        scoring = this.calculateControlledBattlegroundCountries(scoring, eu_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, eu_countries);
        scoring = this.determineRegionVictor(scoring, eu_scoring_range, eu_bg_countries.length);

        //
        // neighbouring countries
        //
        if (this.isControlled("us", "finland") == 1) { scoring.us.vp++; }
        if (this.isControlled("us", "romania") == 1) { scoring.us.vp++; }
        if (this.isControlled("us", "poland") == 1) { scoring.us.vp++; }
        if (this.isControlled("ussr", "canada") == 1) { scoring.ussr.vp++; }
        break;


      /////////////
      // MIDEAST //
      /////////////
      case "mideast":
        let me_bg_countries = [
          "libya",
          "egypt",
          "israel",
          "iraq",
          "iran",
          "saudiarabia"
        ];

        let me_countries = [
          "lebanon",
          "syria",
          "jordan",
          "gulfstates",
        ];
        let me_scoring_range = { presence: 3, domination: 5, control: 7 };

        // pseudo function to calculate control
        scoring = this.calculateControlledBattlegroundCountries(scoring, me_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, me_countries);

        //
        // Shuttle Diplomacy
        //
        if (this.game.state.events.shuttlediplomacy == 1) {
          if (scoring.ussr.bg > 0) {
            scoring.ussr.bg--;
            scoring.ussr.total--;
          }
          this.game.state.events.shuttlediplomacy = 0;
        }

        scoring = this.determineRegionVictor(scoring, me_scoring_range, me_bg_countries.length);

        // scoring transform
        break;


      /////////////
      // SE ASIA //
      /////////////
      case "seasia":
        let seasia_countries = [
          "burma",
          "laos",
          "vietnam",
          "malaysia",
          "philippines",
          "indonesia",
          "thailand",
        ];

        for (var [player, side] of Object.entries(scoring)) {
          for (country of seasia_countries) {
            if (this.isControlled(player, country) == 1) { country == "thailand" ? side.bg+=2 : side.bg++; }
          }
        }

        scoring.us.vp = scoring.us.vp + scoring.us.bg;
        scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;
        break;
      case "africa":
        let af_bg_countries = [
          "algeria",
          "nigeria",
          "zaire",
          "angola",
          "southafrica",
        ];

        let af_countries = [
          "morocco",
          "tunisia",
          "westafricanstates",
          "saharanstates",
          "sudan",
          "ivorycoast",
          "ethiopia",
          "somalia",
          "cameroon",
          "kenya",
          "seafricanstates",
          "zimbabwe",
          "botswana",
        ];
        let af_scoring_range = {presence: 1, domination: 4, control: 6 };

        scoring = this.calculateControlledBattlegroundCountries(scoring, af_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, af_countries);
        scoring = this.determineRegionVictor(scoring, af_scoring_range, af_bg_countries.length);

        break;

      /////////////////////
      // CENTRAL AMERICA //
      /////////////////////
      case "centralamerica":
        let ca_bg_countries = [
          "mexico",
          "cuba",
          "panama",
        ];

        let ca_countries = [
          "guatemala",
          "elsalvador",
          "honduras",
          "costarica",
          "nicaragua",
          "haiti",
          "dominicanrepublic",
        ];
        let ca_scoring_range = {presence: 1, domination: 3, control: 5};

        scoring = this.calculateControlledBattlegroundCountries(scoring, ca_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, ca_countries);
        scoring = this.determineRegionVictor(scoring, ca_scoring_range, ca_bg_countries.length);

        //
        // neighbouring countries
        //
        if (this.isControlled("ussr", "mexico") == 1) { scoring.ussr.vp++; }
        if (this.isControlled("ussr", "cuba") == 1) { scoring.ussr.vp++; }

        break;

      ///////////////////
      // SOUTH AMERICA //
      ///////////////////
      case "southamerica":
        let sa_bg_countries = [
          "venezuela",
          "brazil",
          "argentina",
          "chile",
        ];

        let sa_countries = [
          "colombia",
          "ecuador",
          "peru",
          "bolivia",
          "paraguay",
          "uruguay",
        ];
        let sa_scoring_range = {presence: 2, domination: 5, control: 6};

        scoring = this.calculateControlledBattlegroundCountries(scoring, sa_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, sa_countries);
        scoring = this.determineRegionVictor(scoring, sa_scoring_range, sa_bg_countries.length);

        break;


      //////////
      // ASIA //
      //////////
      case "asia":
        let as_bg_countries = [
          "northkorea",
          "southkorea",
          "japan",
          "thailand",
          "india",
          "pakistan",
        ];

        let as_countries = [
          "afghanistan",
          "burma",
          "laos",
          "vietnam",
          "malaysia",
          "australia",
          "indonesia",
          "philippines",
        ];
        let as_scoring_range = {presence: 3, domination: 7, control: 9};

        scoring = this.calculateControlledBattlegroundCountries(scoring, as_bg_countries);


        if (this.game.state.events.formosan == 1) {
          if (this.isControlled("us", "taiwan") == 1) { scoring.us.bg++; }
        }

        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;

        scoring = this.calculateControlledCountries(scoring, as_countries);


        if (this.game.state.events.formosan == 0) {
          if (this.isControlled("us", "taiwan") == 1) { scoring.us.total++; }
          if (this.isControlled("ussr", "taiwan") == 1) { scoring.ussr.total++; }
        }

        //
        // Shuttle Diplomacy
        //
        if (this.game.state.events.shuttlediplomacy == 1) {
          if (scoring.ussr.bg > 0) {
            scoring.ussr.bg--;
            scoring.ussr.total--;
          }
          this.game.state.events.shuttlediplomacy = 0;
        }

        if (this.game.state.events.formosan == 1) {
          if (scoring.us.bg == 7 && scoring.us.total > scoring.ussr.total) { scoring.us.vp = 9; }
          if (scoring.us.bg == 6 && scoring.us.total > scoring.ussr.total && this.isControlled("us", "taiwan") == 0) { scoring.us.vp = 9; }
          if (scoring.ussr.bg == 6 && scoring.ussr.total > scoring.us.total) { vp_ussr = 9; }
        } else {
          if (scoring.us.bg == 6 && scoring.us.total > scoring.ussr.total) { scoring.us.vp = 9; }
          if (scoring.ussr.bg == 6 && scoring.ussr.total > scoring.us.total) { vp_ussr = 9; }
        }


        if (scoring.us.vp >= 9 && scoring.us.total > scoring.ussr.total) {}
        else if (scoring.us.bg > scoring.ussr.bg && scoring.us.total > scoring.us.bg && scoring.us.total > scoring.ussr.total) { scoring.us.vp = as_scoring_range.domination; }
        else if (scoring.us.total > 0) { scoring.us.vp = as_scoring_range.presence; }

        if (scoring.ussr.bg == 6 && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = 9; }
        else if (scoring.ussr.bg > scoring.us.bg && scoring.ussr.total > scoring.ussr.bg && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = as_scoring_range.domination; }
        else if (scoring.ussr.total > 0) { scoring.ussr.vp = as_scoring_range.presence; }

        scoring.us.vp = scoring.us.vp + scoring.us.bg;
        scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;

        //
        // neighbouring countries
        //
        if (this.isControlled("us", "afghanistan") == 1) { scoring.us.vp++; }
        if (this.isControlled("us", "northkorea") == 1) { scoring.us.vp++; }
        if (this.isControlled("ussr", "japan") == 1) { scoring.ussr.vp++; }

        break;
      }
    return scoring;
  }


  scoreRegion(card) {

    let total_us = 0;
    let total_ussr = 0;
    let bg_us = 0;
    let bg_ussr = 0;
    let vp_us = 0;
    let vp_ussr = 0;

    ////////////
    // EUROPE //
    ////////////
    if (card == "europe") {

      if (this.isControlled("us", "italy") == 1) { bg_us++; }
      if (this.isControlled("ussr", "italy") == 1) { bg_ussr++; }
      if (this.isControlled("us", "france") == 1) { bg_us++; }
      if (this.isControlled("ussr", "france") == 1) { bg_ussr++; }
      if (this.isControlled("us", "westgermany") == 1) { bg_us++; }
      if (this.isControlled("ussr", "westgermany") == 1) { bg_ussr++; }
      if (this.isControlled("us", "eastgermany") == 1) { bg_us++; }
      if (this.isControlled("ussr", "eastgermany") == 1) { bg_ussr++; }
      if (this.isControlled("us", "poland") == 1) { bg_us++; }
      if (this.isControlled("ussr", "poland") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "spain") == 1) { total_us++; }
      if (this.isControlled("ussr", "spain") == 1) { total_ussr++; }
      if (this.isControlled("us", "greece") == 1) { total_us++; }
      if (this.isControlled("ussr", "greece") == 1) { total_ussr++; }
      if (this.isControlled("us", "turkey") == 1) { total_us++; }
      if (this.isControlled("ussr", "turkey") == 1) { total_ussr++; }
      if (this.isControlled("us", "yugoslavia") == 1) { total_us++; }
      if (this.isControlled("ussr", "yugoslavia") == 1) { total_ussr++; }
      if (this.isControlled("us", "bulgaria") == 1) { total_us++; }
      if (this.isControlled("ussr", "bulgaria") == 1) { total_ussr++; }
      if (this.isControlled("us", "austria") == 1) { total_us++; }
      if (this.isControlled("ussr", "austria") == 1) { total_ussr++; }
      if (this.isControlled("us", "romania") == 1) { total_us++; }
      if (this.isControlled("ussr", "romania") == 1) { total_ussr++; }
      if (this.isControlled("us", "hungary") == 1) { total_us++; }
      if (this.isControlled("ussr", "hungary") == 1) { total_ussr++; }
      if (this.isControlled("us", "czechoslovakia") == 1) { total_us++; }
      if (this.isControlled("ussr", "czechoslovakia") == 1) { total_ussr++; }
      if (this.isControlled("us", "benelux") == 1) { total_us++; }
      if (this.isControlled("ussr", "benelux") == 1) { total_ussr++; }
      if (this.isControlled("us", "uk") == 1) { total_us++; }
      if (this.isControlled("ussr", "uk") == 1) { total_ussr++; }
      if (this.isControlled("us", "canada") == 1) { total_us++; }
      if (this.isControlled("ussr", "canada") == 1) { total_ussr++; }
      if (this.isControlled("us", "norway") == 1) { total_us++; }
      if (this.isControlled("ussr", "norway") == 1) { total_ussr++; }
      if (this.isControlled("us", "denmark") == 1) { total_us++; }
      if (this.isControlled("ussr", "denmark") == 1) { total_ussr++; }
      if (this.isControlled("us", "sweden") == 1) { total_us++; }
      if (this.isControlled("ussr", "sweden") == 1) { total_ussr++; }
      if (this.isControlled("us", "finland") == 1) { total_us++; }
      if (this.isControlled("ussr", "finland") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; }

      if (bg_us == 5 && total_us > total_ussr) { vp_us = 10000; }
      if (bg_ussr == 5 && total_ussr > total_us) { vp_ussr = 10000; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      //
      // neighbouring countries
      //
      if (this.isControlled("us", "finland") == 1) { vp_us++; }
      if (this.isControlled("us", "romania") == 1) { vp_us++; }
      if (this.isControlled("us", "poland") == 1) { vp_us++; }
      if (this.isControlled("ussr", "canada") == 1) { vp_ussr++; }

      //
      // GOUZENKO AFFAIR -- early war optional
      //
      if (this.game.state.events.optional.gouzenkoaffair == 1) {
        if (this.isControlled("us", "canada") == 1) { vp_us++; }
      }


      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      if (vp_adjustment > 9000 || vp_adjustment < -9000) { vp_adjustment = 'WIN' }
      this.updateLog("<span>Europe: </span> " + vp_adjustment + " <span>VP</span>");

    }



    /////////////////
    // MIDDLE EAST //
    /////////////////
    if (card == "mideast") {

      if (this.isControlled("us", "libya") == 1) { bg_us++; }
      if (this.isControlled("ussr", "libya") == 1) { bg_ussr++; }
      if (this.isControlled("us", "egypt") == 1) { bg_us++; }
      if (this.isControlled("ussr", "egypt") == 1) { bg_ussr++; }
      if (this.isControlled("us", "israel") == 1) { bg_us++; }
      if (this.isControlled("ussr", "israel") == 1) { bg_ussr++; }
      if (this.isControlled("us", "iraq") == 1) { bg_us++; }
      if (this.isControlled("ussr", "iraq") == 1) { bg_ussr++; }
      if (this.isControlled("us", "iran") == 1) { bg_us++; }
      if (this.isControlled("ussr", "iran") == 1) { bg_ussr++; }
      if (this.isControlled("us", "saudiarabia") == 1) { bg_us++; }
      if (this.isControlled("ussr", "saudiarabia") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "lebanon") == 1) { total_us++; }
      if (this.isControlled("ussr", "lebanon") == 1) { total_ussr++; }
      if (this.isControlled("us", "syria") == 1) { total_us++; }
      if (this.isControlled("ussr", "syria") == 1) { total_ussr++; }
      if (this.isControlled("us", "jordan") == 1) { total_us++; }
      if (this.isControlled("ussr", "jordan") == 1) { total_ussr++; }
      if (this.isControlled("us", "gulfstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "gulfstates") == 1) { total_ussr++; }

      //
      // Shuttle Diplomacy
      //
      if (this.game.state.events.shuttlediplomacy == 1) {
        if (bg_ussr > 0) {
          bg_ussr--;
          total_ussr--;
        }
        this.game.state.events.shuttlediplomacy = 0;
      }


      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; }

      if (bg_us == 6 && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr == 6 && total_ussr > total_us) { vp_ussr = 7; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Middle-East:</span> " + vp_adjustment + " <span>VP</span>");

    }



    ////////////////////
    // SOUTHEAST ASIA //
    ////////////////////
    if (card == "seasia") {

      vp_us = 0;
      vp_ussr = 0;

      if (this.isControlled("us", "burma") == 1) { vp_us++; }
      if (this.isControlled("ussr", "burma") == 1) { vp_ussr++; }
      if (this.isControlled("us", "laos") == 1) { vp_us++; }
      if (this.isControlled("ussr", "laos") == 1) { vp_ussr++; }
      if (this.isControlled("us", "vietnam") == 1) { vp_us++; }
      if (this.isControlled("ussr", "vietnam") == 1) { vp_ussr++; }
      if (this.isControlled("us", "malaysia") == 1) { vp_us++; }
      if (this.isControlled("ussr", "malaysia") == 1) { vp_ussr++; }
      if (this.isControlled("us", "philippines") == 1) { vp_us++; }
      if (this.isControlled("ussr", "philippines") == 1) { vp_ussr++; }
      if (this.isControlled("us", "indonesia") == 1) { vp_us++; }
      if (this.isControlled("ussr", "indonesia") == 1) { vp_ussr++; }
      if (this.isControlled("us", "thailand") == 1) { vp_us+=2; }
      if (this.isControlled("ussr", "thailand") == 1) { vp_ussr+=2; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Southeast Asia:</span> " + vp_adjustment + " <span>VP</span>");

    }




    ////////////
    // AFRICA //
    ////////////
    if (card == "africa") {

      if (this.isControlled("us", "algeria") == 1) { bg_us++; }
      if (this.isControlled("ussr", "algeria") == 1) { bg_ussr++; }
      if (this.isControlled("us", "nigeria") == 1) { bg_us++; }
      if (this.isControlled("ussr", "nigeria") == 1) { bg_ussr++; }
      if (this.isControlled("us", "zaire") == 1) { bg_us++; }
      if (this.isControlled("ussr", "zaire") == 1) { bg_ussr++; }
      if (this.isControlled("us", "angola") == 1) { bg_us++; }
      if (this.isControlled("ussr", "angola") == 1) { bg_ussr++; }
      if (this.isControlled("us", "southafrica") == 1) { bg_us++; }
      if (this.isControlled("ussr", "southafrica") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "morocco") == 1) { total_us++; }
      if (this.isControlled("ussr", "morocco") == 1) { total_ussr++; }
      if (this.isControlled("us", "tunisia") == 1) { total_us++; }
      if (this.isControlled("ussr", "tunisia") == 1) { total_ussr++; }
      if (this.isControlled("us", "westafricanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "westafricanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "saharanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "saharanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "sudan") == 1) { total_us++; }
      if (this.isControlled("ussr", "sudan") == 1) { total_ussr++; }
      if (this.isControlled("us", "ivorycoast") == 1) { total_us++; }
      if (this.isControlled("ussr", "ivorycoast") == 1) { total_ussr++; }
      if (this.isControlled("us", "ethiopia") == 1) { total_us++; }
      if (this.isControlled("ussr", "ethiopia") == 1) { total_ussr++; }
      if (this.isControlled("us", "somalia") == 1) { total_us++; }
      if (this.isControlled("ussr", "somalia") == 1) { total_ussr++; }
      if (this.isControlled("us", "cameroon") == 1) { total_us++; }
      if (this.isControlled("ussr", "cameroon") == 1) { total_ussr++; }
      if (this.isControlled("us", "kenya") == 1) { total_us++; }
      if (this.isControlled("ussr", "kenya") == 1) { total_ussr++; }
      if (this.isControlled("us", "seafricanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "seafricanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "zimbabwe") == 1) { total_us++; }
      if (this.isControlled("ussr", "zimbabwe") == 1) { total_ussr++; }
      if (this.isControlled("us", "botswana") == 1) { total_us++; }
      if (this.isControlled("ussr", "botswana") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 1; }
      if (total_ussr> 0) { vp_ussr = 1; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 4; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 4; }

      if (bg_us == 5 && total_us > total_ussr) { vp_us = 6; }
      if (bg_ussr == 5 && total_ussr > total_us) { vp_ussr = 6; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Africa:</span> " + vp_adjustment + " <span>VP</span>");

    }



    /////////////////////
    // CENTRAL AMERICA //
    /////////////////////
    if (card == "centralamerica") {

      if (this.isControlled("us", "mexico") == 1) { bg_us++; }
      if (this.isControlled("ussr", "mexico") == 1) { bg_ussr++; }
      if (this.isControlled("us", "cuba") == 1) { bg_us++; }
      if (this.isControlled("ussr", "cuba") == 1) { bg_ussr++; }
      if (this.isControlled("us", "panama") == 1) { bg_us++; }
      if (this.isControlled("ussr", "panama") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "guatemala") == 1) { total_us++; }
      if (this.isControlled("ussr", "guatemala") == 1) { total_ussr++; }
      if (this.isControlled("us", "elsalvador") == 1) { total_us++; }
      if (this.isControlled("ussr", "elsalvador") == 1) { total_ussr++; }
      if (this.isControlled("us", "honduras") == 1) { total_us++; }
      if (this.isControlled("ussr", "honduras") == 1) { total_ussr++; }
      if (this.isControlled("us", "costarica") == 1) { total_us++; }
      if (this.isControlled("ussr", "costarica") == 1) { total_ussr++; }
      if (this.isControlled("us", "nicaragua") == 1) { total_us++; }
      if (this.isControlled("ussr", "nicaragua") == 1) { total_ussr++; }
      if (this.isControlled("us", "haiti") == 1) { total_us++; }
      if (this.isControlled("ussr", "haiti") == 1) { total_ussr++; }
      if (this.isControlled("us", "dominicanrepublic") == 1) { total_us++; }
      if (this.isControlled("ussr", "dominicanrepublic") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 1; }
      if (total_ussr > 0) { vp_ussr = 1; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 3; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 3; }

      if (bg_us == 3 && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr == 3 && total_ussr > total_us) { vp_ussr = 5; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      //
      // neighbouring countries
      //
      if (this.isControlled("ussr", "mexico") == 1) { vp_ussr++; }
      if (this.isControlled("ussr", "cuba") == 1) { vp_ussr++; }

      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Central America:</span> " + vp_adjustment + " <span>VP</span>");

    }



    ///////////////////
    // SOUTH AMERICA //
    ///////////////////
    if (card == "southamerica") {

      if (this.isControlled("us", "venezuela") == 1) { bg_us++; }
      if (this.isControlled("ussr", "venezuela") == 1) { bg_ussr++; }
      if (this.isControlled("us", "brazil") == 1) { bg_us++; }
      if (this.isControlled("ussr", "brazil") == 1) { bg_ussr++; }
      if (this.isControlled("us", "argentina") == 1) { bg_us++; }
      if (this.isControlled("ussr", "argentina") == 1) { bg_ussr++; }
      if (this.isControlled("us", "chile") == 1) { bg_us++; }
      if (this.isControlled("ussr", "chile") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "colombia") == 1) { total_us++; }
      if (this.isControlled("ussr", "colombia") == 1) { total_ussr++; }
      if (this.isControlled("us", "ecuador") == 1) { total_us++; }
      if (this.isControlled("ussr", "ecuador") == 1) { total_ussr++; }
      if (this.isControlled("us", "peru") == 1) { total_us++; }
      if (this.isControlled("ussr", "peru") == 1) { total_ussr++; }
      if (this.isControlled("us", "bolivia") == 1) { total_us++; }
      if (this.isControlled("ussr", "bolivia") == 1) { total_ussr++; }
      if (this.isControlled("us", "paraguay") == 1) { total_us++; }
      if (this.isControlled("ussr", "paraguay") == 1) { total_ussr++; }
      if (this.isControlled("us", "uruguay") == 1) { total_us++; }
      if (this.isControlled("ussr", "uruguay") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 2; }
      if (total_ussr> 0) { vp_ussr = 2; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; }

      if (bg_us == 4 && total_us > total_ussr) { vp_us = 6; }
      if (bg_ussr == 4 && total_ussr > total_us) { vp_ussr = 6; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;


      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>South America:</span> " + vp_adjustment + " <span>VP</span>");


    }




    //////////
    // ASIA //
    //////////
    if (card == "asia") {

      if (this.isControlled("us", "northkorea") == 1) { bg_us++; }
      if (this.isControlled("ussr", "northkorea") == 1) { bg_ussr++; }
      if (this.isControlled("us", "southkorea") == 1) { bg_us++; }
      if (this.isControlled("ussr", "southkorea") == 1) { bg_ussr++; }
      if (this.isControlled("us", "japan") == 1) { bg_us++; }
      if (this.isControlled("ussr", "japan") == 1) { bg_ussr++; }
      if (this.isControlled("us", "thailand") == 1) { bg_us++; }
      if (this.isControlled("ussr", "thailand") == 1) { bg_ussr++; }
      if (this.isControlled("us", "india") == 1) { bg_us++; }
      if (this.isControlled("ussr", "india") == 1) { bg_ussr++; }
      if (this.isControlled("us", "pakistan") == 1) { bg_us++; }
      if (this.isControlled("ussr", "pakistan") == 1) { bg_ussr++; }
      if (this.game.state.events.formosan == 1) {
        if (this.isControlled("us", "taiwan") == 1) { bg_us++; }
      }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "afghanistan") == 1) { total_us++; }
      if (this.isControlled("ussr", "afghanistan") == 1) { total_ussr++; }
      if (this.isControlled("us", "burma") == 1) { total_us++; }
      if (this.isControlled("ussr", "burma") == 1) { total_ussr++; }
      if (this.isControlled("us", "laos") == 1) { total_us++; }
      if (this.isControlled("ussr", "laos") == 1) { total_ussr++; }
      if (this.isControlled("us", "vietnam") == 1) { total_us++; }
      if (this.isControlled("ussr", "vietnam") == 1) { total_ussr++; }
      if (this.isControlled("us", "malaysia") == 1) { total_us++; }
      if (this.isControlled("ussr", "malaysia") == 1) { total_ussr++; }
      if (this.isControlled("us", "australia") == 1) { total_us++; }
      if (this.isControlled("ussr", "australia") == 1) { total_ussr++; }
      if (this.isControlled("us", "indonesia") == 1) { total_us++; }
      if (this.isControlled("ussr", "indonesia") == 1) { total_ussr++; }
      if (this.isControlled("us", "philippines") == 1) { total_us++; }
      if (this.isControlled("ussr", "philippines") == 1) { total_ussr++; }
      if (this.game.state.events.formosan == 0) {
        if (this.isControlled("us", "taiwan") == 1) { total_us++; }
        if (this.isControlled("ussr", "taiwan") == 1) { total_ussr++; }
      }

      //
      // Shuttle Diplomacy
      //
      if (this.game.state.events.shuttlediplomacy == 1) {
        if (bg_ussr > 0) {
          bg_ussr--;
          total_ussr--;
        }
        this.game.state.events.shuttlediplomacy = 0;
      }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; }

      if (this.game.state.events.formosan == 1) {
        if (bg_us == 7 && total_us > total_ussr) { vp_us = 9; }
        if (bg_us == 6 && total_us > total_ussr && this.isControlled("taiwan", "us") == 0) { vp_us = 9; }
        if (bg_ussr == 6 && total_ussr > total_us) { vp_ussr = 9; }
      } else {
        if (bg_us == 6 && total_us > total_ussr) { vp_us = 9; }
        if (bg_ussr == 6 && total_ussr > total_us) { vp_ussr = 9; }
      }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      //
      // neighbouring countries
      //
      if (this.isControlled("us", "afghanistan") == 1) { vp_us++; }
      if (this.isControlled("us", "northkorea") == 1) { vp_us++; }
      if (this.isControlled("ussr", "japan") == 1) { vp_ussr++; }

      //
      // Report Adjustment
      //
      let vp_adjustment = vp_us - vp_ussr;
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Asia:</span> " + vp_adjustment + " <span>VP</span>");

    }

    this.updateVictoryPoints();

  }



  doesPlayerDominateRegion(player, region) {

    let total_us = 0;
    let total_ussr = 0;
    let bg_us = 0;
    let bg_ussr = 0;
    let vp_us = 0;
    let vp_ussr = 0;


    ////////////
    // EUROPE //
    ////////////
    if (region == "europe") {

      if (this.isControlled("us", "italy") == 1) { bg_us++; }
      if (this.isControlled("ussr", "italy") == 1) { bg_ussr++; }
      if (this.isControlled("us", "france") == 1) { bg_us++; }
      if (this.isControlled("ussr", "france") == 1) { bg_ussr++; }
      if (this.isControlled("us", "westgermany") == 1) { bg_us++; }
      if (this.isControlled("ussr", "westgermany") == 1) { bg_ussr++; }
      if (this.isControlled("us", "eastgermany") == 1) { bg_us++; }
      if (this.isControlled("ussr", "eastgermany") == 1) { bg_ussr++; }
      if (this.isControlled("us", "poland") == 1) { bg_us++; }
      if (this.isControlled("ussr", "poland") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "spain") == 1) { total_us++; }
      if (this.isControlled("ussr", "spain") == 1) { total_ussr++; }
      if (this.isControlled("us", "greece") == 1) { total_us++; }
      if (this.isControlled("ussr", "greece") == 1) { total_ussr++; }
      if (this.isControlled("us", "turkey") == 1) { total_us++; }
      if (this.isControlled("ussr", "turkey") == 1) { total_ussr++; }
      if (this.isControlled("us", "yugoslavia") == 1) { total_us++; }
      if (this.isControlled("ussr", "yugoslavia") == 1) { total_ussr++; }
      if (this.isControlled("us", "bulgaria") == 1) { total_us++; }
      if (this.isControlled("ussr", "bulgaria") == 1) { total_ussr++; }
      if (this.isControlled("us", "austria") == 1) { total_us++; }
      if (this.isControlled("ussr", "austria") == 1) { total_ussr++; }
      if (this.isControlled("us", "romania") == 1) { total_us++; }
      if (this.isControlled("ussr", "romania") == 1) { total_ussr++; }
      if (this.isControlled("us", "hungary") == 1) { total_us++; }
      if (this.isControlled("ussr", "hungary") == 1) { total_ussr++; }
      if (this.isControlled("us", "czechoslovakia") == 1) { total_us++; }
      if (this.isControlled("ussr", "czechoslovakia") == 1) { total_ussr++; }
      if (this.isControlled("us", "benelux") == 1) { total_us++; }
      if (this.isControlled("ussr", "benelux") == 1) { total_ussr++; }
      if (this.isControlled("us", "uk") == 1) { total_us++; }
      if (this.isControlled("ussr", "uk") == 1) { total_ussr++; }
      if (this.isControlled("us", "canada") == 1) { total_us++; }
      if (this.isControlled("ussr", "canada") == 1) { total_ussr++; }
      if (this.isControlled("us", "norway") == 1) { total_us++; }
      if (this.isControlled("ussr", "norway") == 1) { total_ussr++; }
      if (this.isControlled("us", "denmark") == 1) { total_us++; }
      if (this.isControlled("ussr", "denmark") == 1) { total_ussr++; }
      if (this.isControlled("us", "sweden") == 1) { total_us++; }
      if (this.isControlled("ussr", "sweden") == 1) { total_ussr++; }
      if (this.isControlled("us", "finland") == 1) { total_us++; }
      if (this.isControlled("ussr", "finland") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; }

      if (total_us == 6 && total_us > total_ussr) { vp_us = 10000; }
      if (total_ussr == 6 && total_us > total_ussr) { vp_ussr = 10000; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if (vp_us >= vp_ussr+2) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if (vp_ussr >= vp_us+2) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    /////////////////
    // MIDDLE EAST //
    /////////////////
    if (region == "mideast") {

      if (this.isControlled("us", "libya") == 1) { bg_us++; }
      if (this.isControlled("ussr", "libya") == 1) { bg_ussr++; }
      if (this.isControlled("us", "egypt") == 1) { bg_us++; }
      if (this.isControlled("ussr", "egypt") == 1) { bg_ussr++; }
      if (this.isControlled("us", "israel") == 1) { bg_us++; }
      if (this.isControlled("ussr", "israel") == 1) { bg_ussr++; }
      if (this.isControlled("us", "iraq") == 1) { bg_us++; }
      if (this.isControlled("ussr", "iraq") == 1) { bg_ussr++; }
      if (this.isControlled("us", "iran") == 1) { bg_us++; }
      if (this.isControlled("ussr", "iran") == 1) { bg_ussr++; }
      if (this.isControlled("us", "saudiarabia") == 1) { bg_us++; }
      if (this.isControlled("ussr", "saudiarabia") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "lebanon") == 1) { total_us++; }
      if (this.isControlled("ussr", "lebanon") == 1) { total_ussr++; }
      if (this.isControlled("us", "syria") == 1) { total_us++; }
      if (this.isControlled("ussr", "syria") == 1) { total_ussr++; }
      if (this.isControlled("us", "jordan") == 1) { total_us++; }
      if (this.isControlled("ussr", "jordan") == 1) { total_ussr++; }
      if (this.isControlled("us", "gulfstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "gulfstates") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 7; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 7; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if (vp_us >= vp_ussr+2) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if (vp_ussr >= vp_us+2) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    ////////////
    // AFRICA //
    ////////////
    if (region == "africa") {

      if (this.isControlled("us", "algeria") == 1) { bg_us++; }
      if (this.isControlled("ussr", "algeria") == 1) { bg_ussr++; }
      if (this.isControlled("us", "nigeria") == 1) { bg_us++; }
      if (this.isControlled("ussr", "nigeria") == 1) { bg_ussr++; }
      if (this.isControlled("us", "zaire") == 1) { bg_us++; }
      if (this.isControlled("ussr", "zaire") == 1) { bg_ussr++; }
      if (this.isControlled("us", "angola") == 1) { bg_us++; }
      if (this.isControlled("ussr", "angola") == 1) { bg_ussr++; }
      if (this.isControlled("us", "southafrica") == 1) { bg_us++; }
      if (this.isControlled("ussr", "southafrica") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "morocco") == 1) { total_us++; }
      if (this.isControlled("ussr", "morocco") == 1) { total_ussr++; }
      if (this.isControlled("us", "tunisia") == 1) { total_us++; }
      if (this.isControlled("ussr", "tunisia") == 1) { total_ussr++; }
      if (this.isControlled("us", "westafricanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "westafricanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "saharanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "saharanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "sudan") == 1) { total_us++; }
      if (this.isControlled("ussr", "sudan") == 1) { total_ussr++; }
      if (this.isControlled("us", "ivorycoast") == 1) { total_us++; }
      if (this.isControlled("ussr", "ivorycoast") == 1) { total_ussr++; }
      if (this.isControlled("us", "ethiopia") == 1) { total_us++; }
      if (this.isControlled("ussr", "ethiopia") == 1) { total_ussr++; }
      if (this.isControlled("us", "somalia") == 1) { total_us++; }
      if (this.isControlled("ussr", "somalia") == 1) { total_ussr++; }
      if (this.isControlled("us", "cameroon") == 1) { total_us++; }
      if (this.isControlled("ussr", "cameroon") == 1) { total_ussr++; }
      if (this.isControlled("us", "kenya") == 1) { total_us++; }
      if (this.isControlled("ussr", "kenya") == 1) { total_ussr++; }
      if (this.isControlled("us", "seafricanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "seafricanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "zimbabwe") == 1) { total_us++; }
      if (this.isControlled("ussr", "zimbabwe") == 1) { total_ussr++; }
      if (this.isControlled("us", "botswana") == 1) { total_us++; }
      if (this.isControlled("ussr", "botswana") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 1; }
      if (total_ussr> 0) { vp_ussr = 1; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 4; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 4; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 6; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 6; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if (vp_us >= vp_ussr+2) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if (vp_ussr >= vp_us+2) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    /////////////////////
    // CENTRAL AMERICA //
    /////////////////////
    if (region == "centralamerica") {

      if (this.isControlled("us", "mexico") == 1) { bg_us++; }
      if (this.isControlled("ussr", "mexico") == 1) { bg_ussr++; }
      if (this.isControlled("us", "cuba") == 1) { bg_us++; }
      if (this.isControlled("ussr", "cuba") == 1) { bg_ussr++; }
      if (this.isControlled("us", "panama") == 1) { bg_us++; }
      if (this.isControlled("ussr", "panama") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "guatemala") == 1) { total_us++; }
      if (this.isControlled("ussr", "guatemala") == 1) { total_ussr++; }
      if (this.isControlled("us", "elsalvador") == 1) { total_us++; }
      if (this.isControlled("ussr", "elsalvador") == 1) { total_ussr++; }
      if (this.isControlled("us", "honduras") == 1) { total_us++; }
      if (this.isControlled("ussr", "honduras") == 1) { total_ussr++; }
      if (this.isControlled("us", "costarica") == 1) { total_us++; }
      if (this.isControlled("ussr", "costarica") == 1) { total_ussr++; }
      if (this.isControlled("us", "nicaragua") == 1) { total_us++; }
      if (this.isControlled("ussr", "nicaragua") == 1) { total_ussr++; }
      if (this.isControlled("us", "haiti") == 1) { total_us++; }
      if (this.isControlled("ussr", "haiti") == 1) { total_ussr++; }
      if (this.isControlled("us", "dominicanrepublic") == 1) { total_us++; }
      if (this.isControlled("ussr", "dominicanrepublic") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 1; }
      if (total_ussr> 0) { vp_ussr = 1; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 3; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 3; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 5; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 5; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if (vp_us >= vp_ussr+2) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if (vp_ussr >= vp_us+2) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    ///////////////////
    // SOUTH AMERICA //
    ///////////////////
    if (region == "southamerica") {

      if (this.isControlled("us", "venezuela") == 1) { bg_us++; }
      if (this.isControlled("ussr", "venezuela") == 1) { bg_ussr++; }
      if (this.isControlled("us", "brazil") == 1) { bg_us++; }
      if (this.isControlled("ussr", "brazil") == 1) { bg_ussr++; }
      if (this.isControlled("us", "argentina") == 1) { bg_us++; }
      if (this.isControlled("ussr", "argentina") == 1) { bg_ussr++; }
      if (this.isControlled("us", "chile") == 1) { bg_us++; }
      if (this.isControlled("ussr", "chile") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "colombia") == 1) { total_us++; }
      if (this.isControlled("ussr", "colombia") == 1) { total_ussr++; }
      if (this.isControlled("us", "ecuador") == 1) { total_us++; }
      if (this.isControlled("ussr", "ecuador") == 1) { total_ussr++; }
      if (this.isControlled("us", "peru") == 1) { total_us++; }
      if (this.isControlled("ussr", "peru") == 1) { total_ussr++; }
      if (this.isControlled("us", "bolivia") == 1) { total_us++; }
      if (this.isControlled("ussr", "bolivia") == 1) { total_ussr++; }
      if (this.isControlled("us", "paraguay") == 1) { total_us++; }
      if (this.isControlled("ussr", "paraguay") == 1) { total_ussr++; }
      if (this.isControlled("us", "uruguay") == 1) { total_us++; }
      if (this.isControlled("ussr", "uruguay") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 2; }
      if (total_ussr> 0) { vp_ussr = 2; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 6; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 6; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if (vp_us >= vp_ussr+2) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if (vp_ussr >= vp_us+2) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }

    }




    //////////
    // ASIA //
    //////////
    if (region == "asia") {

      if (this.isControlled("us", "northkorea") == 1) { bg_us++; }
      if (this.isControlled("ussr", "northkorea") == 1) { bg_ussr++; }
      if (this.isControlled("us", "southkorea") == 1) { bg_us++; }
      if (this.isControlled("ussr", "southkorea") == 1) { bg_ussr++; }
      if (this.isControlled("us", "japan") == 1) { bg_us++; }
      if (this.isControlled("ussr", "japan") == 1) { bg_ussr++; }
      if (this.isControlled("us", "thailand") == 1) { bg_us++; }
      if (this.isControlled("ussr", "thailand") == 1) { bg_ussr++; }
      if (this.isControlled("us", "india") == 1) { bg_us++; }
      if (this.isControlled("ussr", "india") == 1) { bg_ussr++; }
      if (this.isControlled("us", "pakistan") == 1) { bg_us++; }
      if (this.isControlled("ussr", "pakistan") == 1) { bg_ussr++; }
      if (this.game.state.events.formosan == 1) {
        if (this.isControlled("us", "taiwan") == 1) { bg_us++; }
      }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "afghanistan") == 1) { total_us++; }
      if (this.isControlled("ussr", "afghanistan") == 1) { total_ussr++; }
      if (this.isControlled("us", "burma") == 1) { total_us++; }
      if (this.isControlled("ussr", "burma") == 1) { total_ussr++; }
      if (this.isControlled("us", "laos") == 1) { total_us++; }
      if (this.isControlled("ussr", "laos") == 1) { total_ussr++; }
      if (this.isControlled("us", "vietnam") == 1) { total_us++; }
      if (this.isControlled("ussr", "vietnam") == 1) { total_ussr++; }
      if (this.isControlled("us", "malaysia") == 1) { total_us++; }
      if (this.isControlled("ussr", "malaysia") == 1) { total_ussr++; }
      if (this.isControlled("us", "australia") == 1) { total_us++; }
      if (this.isControlled("ussr", "australia") == 1) { total_ussr++; }
      if (this.isControlled("us", "indonesia") == 1) { total_us++; }
      if (this.isControlled("ussr", "indonesia") == 1) { total_ussr++; }
      if (this.isControlled("us", "philippines") == 1) { total_us++; }
      if (this.isControlled("ussr", "philippines") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; }

      if (this.game.state.events.formosan == 1) {
        if (total_us == 7 && total_us > total_ussr) { vp_us = 9; }
        if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 9; }
      } else {
        if (total_us == 6 && total_us > total_ussr) { vp_us = 9; }
        if (total_ussr == 6 && total_us > total_ussr) { vp_ussr = 9; }
      }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if (vp_us >= vp_ussr+2) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if (vp_ussr >= vp_us+2) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }

    return 0;

  }




  returnCardItem(card) {

    if (this.interface == 1) {
      if (this.game.deck[0].cards[card] == undefined) {
        return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}</div>`;
      }
      return `<div id="${card.replace(/ /g,'')}" class="card showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}</div>`;
    } else {
      if (this.game.deck[0].cards[card] == undefined) {
        return '<li class="card" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';
      }
      return '<li class="card" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';
    }

  }





  returnCardList(cardarray=[]) {

    let hand = this.game.deck[0].hand;

    let html = "";


    if (this.interface == 1) {
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i]);
      }
      html = `
        <div class="display-cards display-cards-status">
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



  updateStatusAndListCards(message, cards=null) {

    if (cards == null) {
      cards = this.game.deck[0].hand;
    }

    html = `
      <div class="cardbox-status-container">
        <div>${message}</div>
        ${this.returnCardList(cards)}
      </div>
    `

    this.updateStatus(html);
    this.addShowCardEvents();
  }

  updateStatus(status_html) {
    this.hud.updateStatus(status_html, this.addShowCardEvents.bind(this));
  }

  updateRound() {

    let dt = 0;
    let dl = 0;

    if (this.game.state.round == 0) {
      dt = this.game.state.round_ps[0].top;
      dl = this.game.state.round_ps[0].left;
    }
    if (this.game.state.round == 1) {
      dt = this.game.state.round_ps[0].top;
      dl = this.game.state.round_ps[0].left;
    }
    if (this.game.state.round == 2) {
      dt = this.game.state.round_ps[1].top;
      dl = this.game.state.round_ps[1].left;
    }
    if (this.game.state.round == 3) {
      dt = this.game.state.round_ps[2].top;
      dl = this.game.state.round_ps[2].left;
    }
    if (this.game.state.round == 4) {
      dt = this.game.state.round_ps[3].top;
      dl = this.game.state.round_ps[3].left;
    }
    if (this.game.state.round == 5) {
      dt = this.game.state.round_ps[4].top;
      dl = this.game.state.round_ps[4].left;
    }
    if (this.game.state.round == 6) {
      dt = this.game.state.round_ps[5].top;
      dl = this.game.state.round_ps[5].left;
    }
    if (this.game.state.round == 7) {
      dt = this.game.state.round_ps[6].top;
      dl = this.game.state.round_ps[6].left;
    }
    if (this.game.state.round == 8) {
      dt = this.game.state.round_ps[7].top;
      dl = this.game.state.round_ps[7].left;
    }
    if (this.game.state.round == 9) {
      dt = this.game.state.round_ps[8].top;
      dl = this.game.state.round_ps[8].left;
    }
    if (this.game.state.round == 10) {
      dt = this.game.state.round_ps[9].top;
      dl = this.game.state.round_ps[9].left;
    }

    dt = this.scale(dt)+"px";
    dl = this.scale(dl)+"px";

    $('.round').css('width', this.scale(140)+"px");
    $('.round').css('height', this.scale(140)+"px");
    $('.round').css('top', dt);
    $('.round').css('left', dl);

  }


  lowerDefcon() {

    this.game.state.defcon--;

    this.updateLog("<span>DEFCON falls to</span> " + this.game.state.defcon);

    if (this.game.state.defcon == 2) {
      if (this.game.state.events.norad == 1) {
        if (this.game.state.headline != 1) {
          this.game.state.us_defcon_bonus = 1;
        }
      }
    }


  console.log("LOWERING DEFCON: " + this.game.state.defcon + " -- " + this.game.state.headline + " -- " + this.game.state.player_to_go);

    if (this.game.state.defcon == 1) {
      if (this.game.state.headline == 1) {
        //
        // phasing player in headline loses
        //
        if (this.game.state.player_to_go == 1) {
          this.endGame("us", "<span>USSR triggers thermonuclear war</span>");
        }
        if (this.game.state.player_to_go == 2) {
          this.endGame("ussr", "<span>US triggers thermonuclear war</span>");
        }
        return;
      }
      if (this.game.state.turn == 0) {
        this.endGame("us", "<span>USSR triggers thermonuclear war 1</span>");
      } else {
        this.endGame("ussr", "<span>US triggers thermonuclear war 2</span>");
      }
    }

    this.updateDefcon();
  }


  updateDefcon() {

    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }

    let dt = 0;
    let dl = 0;

    if (this.game.state.defcon == 5) {
      dt = this.game.state.defcon_ps[0].top;
      dl = this.game.state.defcon_ps[0].left;
    }
    if (this.game.state.defcon == 4) {
      dt = this.game.state.defcon_ps[1].top;
      dl = this.game.state.defcon_ps[1].left;
    }
    if (this.game.state.defcon == 3) {
      dt = this.game.state.defcon_ps[2].top;
      dl = this.game.state.defcon_ps[2].left;
    }
    if (this.game.state.defcon == 2) {
      dt = this.game.state.defcon_ps[3].top;
      dl = this.game.state.defcon_ps[3].left;
    }
    if (this.game.state.defcon == 1) {
      dt = this.game.state.defcon_ps[4].top;
      dl = this.game.state.defcon_ps[4].left;
    }

    dt = this.scale(dt) + "px";
    dl = this.scale(dl) + "px";

    dt = dt;
    dl = dl;

    $('.defcon').css('width', this.scale(120)+"px");
    $('.defcon').css('height', this.scale(120)+"px");
    $('.defcon').css('top', dt);
    $('.defcon').css('left', dl);

  }



  updateActionRound() {

    let dt = 0;
    let dl = 0;
    let dt_us = 0;
    let dl_us = 0;

    let turn_in_round = this.game.state.turn_in_round;

    if (turn_in_round == 0) {
      dt = this.game.state.ar_ps[0].top;
      dl = this.game.state.ar_ps[0].left;
    }
    if (turn_in_round == 1) {
      dt = this.game.state.ar_ps[0].top;
      dl = this.game.state.ar_ps[0].left;
    }
    if (turn_in_round == 2) {
      dt = this.game.state.ar_ps[1].top;
      dl = this.game.state.ar_ps[1].left;
    }
    if (turn_in_round == 3) {
      dt = this.game.state.ar_ps[2].top;
      dl = this.game.state.ar_ps[2].left;
    }
    if (turn_in_round == 4) {
      dt = this.game.state.ar_ps[3].top;
      dl = this.game.state.ar_ps[3].left;
    }
    if (turn_in_round == 5) {
      dt = this.game.state.ar_ps[4].top;
      dl = this.game.state.ar_ps[4].left;
    }
    if (turn_in_round == 6) {
      dt = this.game.state.ar_ps[5].top;
      dl = this.game.state.ar_ps[5].left;
    }
    if (turn_in_round == 7) {
      dt = this.game.state.ar_ps[6].top;
      dl = this.game.state.ar_ps[6].left;
    }
    if (turn_in_round == 8) {
      dt = this.game.state.ar_ps[7].top;
      dl = this.game.state.ar_ps[7].left;
    }

    dt = this.scale(dt)+"px";
    dl = this.scale(dl)+"px";

    if (this.game.state.turn == 0) {
      $('.action_round_us').hide();
      $('.action_round_ussr').show();
      $('.action_round_ussr').css('width', this.scale(100)+"px");
      $('.action_round_ussr').css('height', this.scale(100)+"px");
      $('.action_round_ussr').css('top', dt);
      $('.action_round_ussr').css('left', dl);
    } else {
      $('.action_round_ussr').hide();
      $('.action_round_us').show();
      $('.action_round_us').css('width', this.scale(100)+"px");
      $('.action_round_us').css('height', this.scale(100)+"px");
      $('.action_round_us').css('top', dt);
      $('.action_round_us').css('left', dl);
    }

    let rounds_this_turn = 6;
    if (this.game.state.round > 3) { rounds_this_turn = 7; }
    if (this.game.state.northseaoil == 1 && this.game.player == 2) { rounds_this_turn++; }
    if (this.game.state.space_station === "us" && this.game.player == 2) { rounds_this_turn++; }
    if (this.game.state.space_station === "ussr" && this.game.player == 1) { rounds_this_turn++; }

    $('.action_round_cover').css('width', this.scale(100)+"px");
    $('.action_round_cover').css('height', this.scale(100)+"px");

    let dt8 = this.scale(this.game.state.ar_ps[7].top) + "px";
    let dl8 = this.scale(this.game.state.ar_ps[7].left) + "px";
    let dt7 = this.scale(this.game.state.ar_ps[6].top) + "px";
    let dl7 = this.scale(this.game.state.ar_ps[6].left) + "px";

    $('.action_round_8_cover').css('top', dt8);
    $('.action_round_8_cover').css('left', dl8);
    $('.action_round_7_cover').css('top', dt7);
    $('.action_round_7_cover').css('left', dl7);

    if (rounds_this_turn < 8) { $('.action_round_8_cover').css('display','all'); } else { $('.action_round_8_cover').css('display','none'); }
    if (rounds_this_turn < 7) { $('.action_round_7_cover').css('display','all'); } else { $('.action_round_7_cover').css('display','none'); }

  }



  advanceSpaceRace(player) {

    this.updateLog("<span>" + player.toUpperCase() + "</span> <span>has advanced in the space race</span>");

    if (player == "us") {

      this.game.state.space_race_us++;

      // Earth Satellite
      if (this.game.state.space_race_us == 1) {
        if (this.game.state.space_race_ussr < 1) {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp += 1;
          this.updateVictoryPoints();
        }
      }

      // Animal in Space
      if (this.game.state.space_race_us == 2) {
        if (this.game.state.space_race_ussr < 2) {
          this.game.state.animal_in_space = "us";
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Space
      if (this.game.state.space_race_us == 3) {
        if (this.game.state.space_race_ussr < 3) {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Earth Orbit
      if (this.game.state.space_race_us == 4) {
        if (this.game.state.space_race_ussr < 4) {
          this.game.state.man_in_earth_orbit = "us";
        } else {
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Lunar Orbit
      if (this.game.state.space_race_us == 5) {
        if (this.game.state.space_race_ussr < 5) {
          this.game.state.vp += 3;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp += 1;
          this.updateVictoryPoints();
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Eagle has Landed
      if (this.game.state.space_race_us == 6) {
        if (this.game.state.space_race_ussr < 6) {
          this.game.state.eagle_has_landed = "us";
        } else {
          this.game.state.eagle_has_landed = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Space Shuttle
      if (this.game.state.space_race_us == 7) {
        if (this.game.state.space_race_ussr < 7) {
          this.game.state.vp += 4;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
          this.game.state.eagle_has_landed = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Space Station
      if (this.game.state.space_race_us == 8) {
        if (this.game.state.space_race_ussr < 8) {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
          this.game.state.space_shuttle = "us";
        } else {
          this.game.state.eagle_has_landed = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
          this.game.state.space_shuttle = "";
        }
      }
    }





    if (player == "ussr") {

      this.game.state.space_race_ussr++;

      // Earth Satellite
      if (this.game.state.space_race_ussr == 1) {
        if (this.game.state.space_race_us < 1) {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp -= 1;
          this.updateVictoryPoints();
        }
      }

      // Animal in Space
      if (this.game.state.space_race_ussr == 2) {
        if (this.game.state.space_race_us < 2) {
          this.game.state.animal_in_space = "ussr";
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Space
      if (this.game.state.space_race_ussr == 3) {
        if (this.game.state.space_race_us < 3) {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Earth Orbit
      if (this.game.state.space_race_ussr == 4) {
        if (this.game.state.space_race_us < 4) {
          this.game.state.man_in_earth_orbit = "ussr";
        } else {
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
        }
      }

      // Lunar Orbit
      if (this.game.state.space_race_ussr == 5) {
        if (this.game.state.space_race_us < 5) {
          this.game.state.vp -= 3;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp -= 1;
          this.updateVictoryPoints();
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
        }
      }

      // Bear has Landed
      if (this.game.state.space_race_ussr == 6) {
        if (this.game.state.space_race_us < 6) {
          this.game.state.eagle_has_landed = "ussr";
        } else {
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.eagle_has_landed = "";
        }
      }

      // Space Shuttle
      if (this.game.state.space_race_ussr == 7) {
        if (this.game.state.space_race_us < 7) {
          this.game.state.vp -= 4;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.eagle_has_landed = "";
        }
      }

      // Space Station
      if (this.game.state.space_race_ussr == 8) {
        if (this.game.state.space_race_us < 8) {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
          this.game.state.space_shuttle = "ussr";
        } else {
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.eagle_has_landed = "";
          this.game.state.space_shuttle = "";
        }
      }
    }

    this.updateSpaceRace();
  }



  updateSpaceRace() {

    let dt_us = 0;
    let dl_us = 0;
    let dt_ussr = 0;
    let dl_ussr = 0;

    if (this.game.state.space_race_us == 0) {
      dt_us = this.game.state.space_race_ps[0].top;
      dl_us = this.game.state.space_race_ps[0].left;
    }
    if (this.game.state.space_race_us == 1) {
      dt_us = this.game.state.space_race_ps[1].top;
      dl_us = this.game.state.space_race_ps[1].left;
    }
    if (this.game.state.space_race_us == 2) {
      dt_us = this.game.state.space_race_ps[2].top;
      dl_us = this.game.state.space_race_ps[2].left;
    }
    if (this.game.state.space_race_us == 3) {
      dt_us = this.game.state.space_race_ps[3].top;
      dl_us = this.game.state.space_race_ps[3].left;
    }
    if (this.game.state.space_race_us == 4) {
      dt_us = this.game.state.space_race_ps[4].top;
      dl_us = this.game.state.space_race_ps[4].left;
    }
    if (this.game.state.space_race_us == 5) {
      dt_us = this.game.state.space_race_ps[5].top;
      dl_us = this.game.state.space_race_ps[5].left;
    }
    if (this.game.state.space_race_us == 6) {
      dt_us = this.game.state.space_race_ps[6].top;
      dl_us = this.game.state.space_race_ps[6].left;
    }
    if (this.game.state.space_race_us == 7) {
      dt_us = this.game.state.space_race_ps[7].top;
      dl_us = this.game.state.space_race_ps[7].left;
    }
    if (this.game.state.space_race_us == 8) {
      dt_us = this.game.state.space_race_ps[8].top;
      dl_us = this.game.state.space_race_ps[8].left;
    }

    if (this.game.state.space_race_ussr == 0) {
      dt_ussr = this.game.state.space_race_ps[0].top;
      dl_ussr = this.game.state.space_race_ps[0].left;
    }
    if (this.game.state.space_race_ussr == 1) {
      dt_ussr = this.game.state.space_race_ps[1].top;
      dl_ussr = this.game.state.space_race_ps[1].left;
    }
    if (this.game.state.space_race_ussr == 2) {
      dt_ussr = this.game.state.space_race_ps[2].top;
      dl_ussr = this.game.state.space_race_ps[2].left;
    }
    if (this.game.state.space_race_ussr == 3) {
      dt_ussr = this.game.state.space_race_ps[3].top;
      dl_ussr = this.game.state.space_race_ps[3].left;
    }
    if (this.game.state.space_race_ussr == 4) {
      dt_ussr = this.game.state.space_race_ps[4].top;
      dl_ussr = this.game.state.space_race_ps[4].left;
    }
    if (this.game.state.space_race_ussr == 5) {
      dt_ussr = this.game.state.space_race_ps[5].top;
      dl_ussr = this.game.state.space_race_ps[5].left;
    }
    if (this.game.state.space_race_ussr == 6) {
      dt_ussr = this.game.state.space_race_ps[6].top;
      dl_ussr = this.game.state.space_race_ps[6].left;
    }
    if (this.game.state.space_race_ussr == 7) {
      dt_ussr = this.game.state.space_race_ps[7].top;
      dl_ussr = this.game.state.space_race_ps[7].left;
    }
    if (this.game.state.space_race_ussr == 8) {
      dt_ussr = this.game.state.space_race_ps[8].top;
      dl_ussr = this.game.state.space_race_ps[8].left;
    }

    dt_us = this.scale(dt_us);
    dl_us = this.scale(dl_us);
    dt_ussr = this.scale(dt_ussr+40)+"px";
    dl_ussr = this.scale(dl_ussr+10)+"px";

    $('.space_race_us').css('width', this.scale(100)+"px");
    $('.space_race_us').css('height', this.scale(100)+"px");
    $('.space_race_us').css('top', dt_us);
    $('.space_race_us').css('left', dl_us);

    $('.space_race_ussr').css('width', this.scale(100)+"px");
    $('.space_race_ussr').css('height', this.scale(100)+"px");
    $('.space_race_ussr').css('top', dt_ussr);
    $('.space_race_ussr').css('left', dl_ussr);

  }



  updateEventTiles() {

    if (this.game.state.events.warsawpact == 0) {
      $('#eventtile_warsaw').css('display','none');
    } else {
      $('#eventtile_warsaw').css('display','block');
    }

    if (this.game.state.events.degaulle == 0) {
      $('#eventtile_degaulle').css('display','none');
    } else {
      $('#eventtile_degaulle').css('display','block');
    }

    if (this.game.state.events.nato == 0) {
      $('#eventtile_nato').css('display','none');
    } else {
      $('#eventtile_nato').css('display','block');
    }

    if (this.game.state.events.marshall == 0) {
      $('#eventtile_marshall').css('display','none');
    } else {
      $('#eventtile_marshall').css('display','block');
    }

    if (this.game.state.events.usjapan == 0) {
      $('#eventtile_usjapan').css('display','none');
    } else {
      $('#eventtile_usjapan').css('display','block');
    }

    if (this.game.state.events.norad == 0) {
      $('#eventtile_norad').css('display','none');
    } else {
      $('#eventtile_norad').css('display','block');
    }

    if (this.game.state.events.quagmire == 0) {
      $('#eventtile_quagmire').css('display','none');
    } else {
      $('#eventtile_quagmire').css('display','block');
    }

    if (this.game.state.events.formosan == 0) {
      $('#eventtile_formosan').css('display','none');
      $('.formosan_resolution').css('display','none');
      $('.formosan_resolution').hide();
    } else {
      if (this.isControlled("ussr", "taiwan") != 1) {
        $('#eventtile_formosan').css('display','block');
        $('.formosan_resolution').css('display','block');
        $('.formosan_resolution').show();
      } else {
        $('.formosan_resolution').css('display','none');
        $('.formosan_resolution').hide();
      }
    }

    if (this.game.state.events.beartrap == 0) {
      $('#eventtile_beartrap').css('display','none');
    } else {
      $('#eventtile_beartrap').css('display','block');
    }

    if (this.game.state.events.willybrandt == 0) {
      $('#eventtile_willybrandt').css('display','none');
    } else {
      $('#eventtile_willybrandt').css('display','block');
    }

    if (this.game.state.events.campdavid == 0) {
      $('#eventtile_campdavid').css('display','none');
    } else {
      $('#eventtile_campdavid').css('display','block');
    }

    if (this.game.state.events.flowerpower == 0) {
      $('#eventtile_flowerpower').css('display','none');
    } else {
      $('#eventtile_flowerpower').css('display','block');
    }

    if (this.game.state.events.johnpaul == 0) {
      $('#eventtile_johnpaul').css('display','none');
    } else {
      $('#eventtile_johnpaul').css('display','block');
    }

    if (this.game.state.events.iranianhostage == 0) {
      $('#eventtile_iranianhostagecrisis').css('display','none');
    } else {
      $('#eventtile_iranianhostagecrisis').css('display','block');
    }

    if (this.game.state.events.shuttlediplomacy == 0) {
      $('#eventtile_shuttlediplomacy').css('display','none');
    } else {
      $('#eventtile_shuttlediplomacy').css('display','block');
    }

    if (this.game.state.events.ironlady == 0) {
      $('#eventtile_ironlady').css('display','none');
    } else {
      $('#eventtile_ironlady').css('display','block');
    }

    if (this.game.state.events.northseaoil == 0) {
      $('#eventtile_northseaoil').css('display','none');
    } else {
      $('#eventtile_northseaoil').css('display','block');
    }

    if (this.game.state.events.reformer == 0) {
      $('#eventtile_reformer').css('display','none');
    } else {
      $('#eventtile_reformer').css('display','block');
    }

    if (this.game.state.events.teardown == 0) {
      $('#eventtile_teardown').css('display','none');
    } else {
      $('#eventtile_teardown').css('display','block');
    }

    if (this.game.state.events.evilempire == 0) {
      $('#eventtile_evilempire').css('display','none');
    } else {
      $('#eventtile_evilempire').css('display','block');
    }

    if (this.game.state.events.awacs == 0) {
      $('#eventtile_awacs').css('display','none');
    } else {
      $('#eventtile_awacs').css('display','block');
    }

  }



  updateMilitaryOperations() {

    let dt_us = 0;
    let dl_us = 0;
    let dt_ussr = 0;
    let dl_ussr = 0;

    if (this.game.state.milops_us == 0) {
      dt_us = this.game.state.milops_ps[0].top;
      dl_us = this.game.state.milops_ps[0].left;
    }
    if (this.game.state.milops_us == 1) {
      dt_us = this.game.state.milops_ps[1].top;
      dl_us = this.game.state.milops_ps[1].left;
    }
    if (this.game.state.milops_us == 2) {
      dt_us = this.game.state.milops_ps[2].top;
      dl_us = this.game.state.milops_ps[2].left;
    }
    if (this.game.state.milops_us == 3) {
      dt_us = this.game.state.milops_ps[3].top;
      dl_us = this.game.state.milops_ps[3].left;
    }
    if (this.game.state.milops_us == 4) {
      dt_us = this.game.state.milops_ps[4].top;
      dl_us = this.game.state.milops_ps[4].left;
    }
    if (this.game.state.milops_us >= 5) {
      dt_us = this.game.state.milops_ps[5].top;
      dl_us = this.game.state.milops_ps[5].left;
    }

    if (this.game.state.milops_ussr == 0) {
      dt_ussr = this.game.state.milops_ps[0].top;
      dl_ussr = this.game.state.milops_ps[0].left;
    }
    if (this.game.state.milops_ussr == 1) {
      dt_ussr = this.game.state.milops_ps[1].top;
      dl_ussr = this.game.state.milops_ps[1].left;
    }
    if (this.game.state.milops_ussr == 2) {
      dt_ussr = this.game.state.milops_ps[2].top;
      dl_ussr = this.game.state.milops_ps[2].left;
    }
    if (this.game.state.milops_ussr == 3) {
      dt_ussr = this.game.state.milops_ps[3].top;
      dl_ussr = this.game.state.milops_ps[3].left;
    }
    if (this.game.state.milops_ussr == 4) {
      dt_ussr = this.game.state.milops_ps[4].top;
      dl_ussr = this.game.state.milops_ps[4].left;
    }
    if (this.game.state.milops_ussr >= 5) {
      dt_ussr = this.game.state.milops_ps[5].top;
      dl_ussr = this.game.state.milops_ps[5].left;
    }

    dt_us = this.scale(dt_us);
    dl_us = this.scale(dl_us);
    dt_ussr = this.scale(dt_ussr+40)+"px";
    dl_ussr = this.scale(dl_ussr+10)+"px";

    $('.milops_us').css('width', this.scale(100)+"px");
    $('.milops_us').css('height', this.scale(100)+"px");
    $('.milops_us').css('top', dt_us);
    $('.milops_us').css('left', dl_us);

    $('.milops_ussr').css('width', this.scale(100)+"px");
    $('.milops_ussr').css('height', this.scale(100)+"px");
    $('.milops_ussr').css('top', dt_ussr);
    $('.milops_ussr').css('left', dl_ussr);

  }



  updateVictoryPoints() {

    //
    // if VP are outstanding, do not update VP and trigger end
    //
    if (this.game.state.vp_outstanding != 0) { return; }

    let dt = 0;
    let dl = 0;

    if (this.game.state.vp <= -20) {
      dt = this.game.state.vp_ps[0].top;
      dl = this.game.state.vp_ps[0].left;
    }
    if (this.game.state.vp == -19) {
      dt = this.game.state.vp_ps[1].top;
      dl = this.game.state.vp_ps[1].left;
    }
    if (this.game.state.vp == -18) {
      dt = this.game.state.vp_ps[2].top;
      dl = this.game.state.vp_ps[2].left;
    }
    if (this.game.state.vp == -17) {
      dt = this.game.state.vp_ps[3].top;
      dl = this.game.state.vp_ps[3].left;
    }
    if (this.game.state.vp == -16) {
      dt = this.game.state.vp_ps[4].top;
      dl = this.game.state.vp_ps[4].left;
    }
    if (this.game.state.vp == -15) {
      dt = this.game.state.vp_ps[5].top;
      dl = this.game.state.vp_ps[5].left;
    }
    if (this.game.state.vp == -14) {
      dt = this.game.state.vp_ps[6].top;
      dl = this.game.state.vp_ps[6].left;
    }
    if (this.game.state.vp == -13) {
      dt = this.game.state.vp_ps[7].top;
      dl = this.game.state.vp_ps[7].left;
    }
    if (this.game.state.vp == -12) {
      dt = this.game.state.vp_ps[8].top;
      dl = this.game.state.vp_ps[8].left;
    }
    if (this.game.state.vp == -11) {
      dt = this.game.state.vp_ps[9].top;
      dl = this.game.state.vp_ps[9].left;
    }
    if (this.game.state.vp == -10) {
      dt = this.game.state.vp_ps[10].top;
      dl = this.game.state.vp_ps[10].left;
    }
    if (this.game.state.vp == -9) {
      dt = this.game.state.vp_ps[11].top;
      dl = this.game.state.vp_ps[11].left;
    }
    if (this.game.state.vp == -8) {
      dt = this.game.state.vp_ps[12].top;
      dl = this.game.state.vp_ps[12].left;
    }
    if (this.game.state.vp == -7) {
      dt = this.game.state.vp_ps[13].top;
      dl = this.game.state.vp_ps[13].left;
    }
    if (this.game.state.vp == -6) {
      dt = this.game.state.vp_ps[14].top;
      dl = this.game.state.vp_ps[14].left;
    }
    if (this.game.state.vp == -5) {
      dt = this.game.state.vp_ps[15].top;
      dl = this.game.state.vp_ps[15].left;
    }
    if (this.game.state.vp == -4) {
      dt = this.game.state.vp_ps[16].top;
      dl = this.game.state.vp_ps[16].left;
    }
    if (this.game.state.vp == -3) {
      dt = this.game.state.vp_ps[17].top;
      dl = this.game.state.vp_ps[17].left;
    }
    if (this.game.state.vp == -2) {
      dt = this.game.state.vp_ps[18].top;
      dl = this.game.state.vp_ps[18].left;
    }
    if (this.game.state.vp == -1) {
      dt = this.game.state.vp_ps[19].top;
      dl = this.game.state.vp_ps[19].left;
    }
    if (this.game.state.vp == 0) {
      dt = this.game.state.vp_ps[20].top;
      dl = this.game.state.vp_ps[20].left;
    }
    if (this.game.state.vp == 1) {
      dt = this.game.state.vp_ps[21].top;
      dl = this.game.state.vp_ps[21].left;
    }
    if (this.game.state.vp == 2) {
      dt = this.game.state.vp_ps[22].top;
      dl = this.game.state.vp_ps[22].left;
    }
    if (this.game.state.vp == 3) {
      dt = this.game.state.vp_ps[23].top;
      dl = this.game.state.vp_ps[23].left;
    }
    if (this.game.state.vp == 4) {
      dt = this.game.state.vp_ps[24].top;
      dl = this.game.state.vp_ps[24].left;
    }
    if (this.game.state.vp == 5) {
      dt = this.game.state.vp_ps[25].top;
      dl = this.game.state.vp_ps[25].left;
    }
    if (this.game.state.vp == 6) {
      dt = this.game.state.vp_ps[26].top;
      dl = this.game.state.vp_ps[26].left;
    }
    if (this.game.state.vp == 7) {
      dt = this.game.state.vp_ps[27].top;
      dl = this.game.state.vp_ps[27].left;
    }
    if (this.game.state.vp == 8) {
      dt = this.game.state.vp_ps[28].top;
      dl = this.game.state.vp_ps[28].left;
    }
    if (this.game.state.vp == 9) {
      dt = this.game.state.vp_ps[29].top;
      dl = this.game.state.vp_ps[29].left;
    }
    if (this.game.state.vp == 10) {
      dt = this.game.state.vp_ps[30].top;
      dl = this.game.state.vp_ps[30].left;
    }
    if (this.game.state.vp == 11) {
      dt = this.game.state.vp_ps[31].top;
      dl = this.game.state.vp_ps[31].left;
    }
    if (this.game.state.vp == 12) {
      dt = this.game.state.vp_ps[32].top;
      dl = this.game.state.vp_ps[32].left;
    }
    if (this.game.state.vp == 13) {
      dt = this.game.state.vp_ps[33].top;
      dl = this.game.state.vp_ps[33].left;
    }
    if (this.game.state.vp == 14) {
      dt = this.game.state.vp_ps[34].top;
      dl = this.game.state.vp_ps[34].left;
    }
    if (this.game.state.vp == 15) {
      dt = this.game.state.vp_ps[35].top;
      dl = this.game.state.vp_ps[35].left;
    }
    if (this.game.state.vp == 16) {
      dt = this.game.state.vp_ps[36].top;
      dl = this.game.state.vp_ps[36].left;
    }
    if (this.game.state.vp == 17) {
      dt = this.game.state.vp_ps[37].top;
      dl = this.game.state.vp_ps[37].left;
    }
    if (this.game.state.vp == 18) {
      dt = this.game.state.vp_ps[38].top;
      dl = this.game.state.vp_ps[38].left;
    }
    if (this.game.state.vp == 19) {
      dt = this.game.state.vp_ps[39].top;
      dl = this.game.state.vp_ps[39].left;
    }
    if (this.game.state.vp >= 20) {
      dt = this.game.state.vp_ps[40].top;
      dl = this.game.state.vp_ps[40].left;
    }


    if (this.app.BROWSER == 1) {

      if (this.game.state.vp > 19) {
        this.endGame("us", "victory point track");
      }
      if (this.game.state.vp < -19) {
        this.endGame("ussr", "victory point track");
      }

      dt = this.scale(dt);
      dl = this.scale(dl);

      dt = dt + "px";
      dl = dl + "px";

      $('.vp').css('width', this.scale(120)+"px");
      $('.vp').css('height', this.scale(120)+"px");
      $('.vp').css('top', dt);
      $('.vp').css('left', dl);
    }
  }







  mobileCardSelect(card, player, mycallback, prompttext="play") {

    let twilight_self = this;

    twilight_self.hideCard();
    twilight_self.showCard(card);

    $('.cardbox_menu_playcard').css('display','block');
    $('.cardbox_menu_playcard').off();
    $('.cardbox_menu_playcard').on('click', function () {
      $('.cardbox_menu').css('display','none');
      twilight_self.hideCard();
      mycallback();
      $(this).hide();
      $('.cardbox-exit').hide();
    });
    // HERE WE ARE
    $('.cardbox-exit').off();
    $('.cardbox-exit').on('click', function () {
      twilight_self.hideCard();
      $('.cardbox_menu_playcard').css('display','none');
      $(this).css('display', 'none');
    });

  }

  returnCardImage(cardname) {

    var c = this.game.deck[0].cards[cardname];
    if (c == undefined) { c = this.game.deck[0].discards[cardname]; }
    if (c == undefined) { c = this.game.deck[0].removed[cardname]; }
    if (c == undefined) {

      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';

    }

    var html = `<img class="cardimg" src="/twilight/img/${this.lang}/${c.img}.svg" />`;

    //
    // cards can be generated with http://www.invadethree.space/tscardgen/
    // as long as they have the string "png" included in the name they will
    // be treated as fully formed (i.e. not SVG files). The convention is to
    // name these cards starting at 201 in order to avoid conflict with other
    // cards that may be released officially.
    //
    if (c.img.indexOf("png") > -1) {
        html = `<img class="cardimg" src="/twilight/img/${this.lang}/${c.img}.png" />`;
    } else {
        if (c.p == 0) { html +='<img class="cardimg" src="/twilight/img/EarlyWar.svg" />'; }
        if (c.p == 1) { html +='<img class="cardimg" src="/twilight/img/MidWar.svg" />'; }
        if (c.p == 2) { html +='<img class="cardimg" src="/twilight/img/LateWar.svg" />'; }

      switch (c.player) {
        case "both":
          html += '<img class="cardimg" src="/twilight/img/BothPlayerCard.svg" />';
          if (c.ops) {
            html += `<img class="cardimg" src="/twilight/img/White${c.ops}.svg" />`;
            html += `<img class="cardimg" src="/twilight/img/Black${c.ops}.svg" />`;
          }
          break;
        case "us":
          html +='<img class="cardimg" src="/twilight/img/AmericanPlayerCard.svg" />';
          if (c.ops) { html += `<img class="cardimg" src="/twilight/img/Black${c.ops}.svg" />`; }
          break;
        case "ussr":
          html +='<img class="cardimg" src="/twilight/img/SovietPlayerCard.svg" />';
          if (c.ops) { html += `<img class="cardimg" src="/twilight/img/White${c.ops}.svg" />`; }
          break;
        default:
          break;
      }
    }

    if (c.scoring == 1) {
      html +='<img class="cardimg" src="/twilight/img/MayNotBeHeld.svg" />';
    } else if (c.recurring == 0) {
      html +='<img class="cardimg" src="/twilight/img/RemoveFromPlay.svg" />';
    }

    return html
  }

  showCard(cardname) {

    let url = this.returnCardImage(cardname);

    //
    // mobile needs recentering
    //
    if (this.app.browser.isMobileBrowser(navigator.userAgent)) {
      // add additional html
      url += `
      <div id="cardbox-exit-background">
      <div class="cardbox-exit" id="cardbox-exit">×</div>
      </div>
      <div class="cardbox_menu_playcard cardbox_menu_btn" id="cardbox_menu_playcard">PLAY</div>`
      $('.cardbox-exit').show();
    }

    $('#cardbox').html(url);
    $('#cardbox').show();
  }

  hideCard() {
    $('#cardbox').hide();
    //$('.cardbox_event_blocker').css('height','0px');
    //$('.cardbox_event_blocker').css('width','0px');
    //$('.cardbox_event_blocker').css('display','none');
  }



  //
  // OVERWRITES GAME.JS MODULE TO ADD CARD HOVERING
  //
  updateLog(str, length = 150) {
    this.hud.updateLog(str, this.addLogCardEvents.bind(this));
  }





  returnGameOptionsHTML() {

    return `
          <h3>Twilight Struggle: </h3>

          <form id="options" class="options">

            <label for="player1">Play as:</label>
            <select name="player1">
              <option value="random">random</option>
              <option value="ussr" default>USSR</option>
              <option value="us">US</option>
            </select>

            <label for="deck">Deck:</label>
            <select name="deck" id="deckselect" onchange='
  if ($("#deckselect").val() == "saito") { $(".saito_edition").prop("checked",true); } else { $(".saito_edition").prop("checked", false); if ($("#deckselect").val() == "optional") { $(".optional_edition").prop("checked", false); } else { $(".optional_edition").prop("checked", true); } }  '>
            <option value="original">original</option>
              <option value="optional">optional</option>
              <option value="saito" selected>saito edition</option>
            </select>

            <label for="usbonus">US bonus: </label>
            <select name="usbonus">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>


            <div onclick='$(".remove_cards_box").show();$(this).html(" ");' style="font-size:0.80em;cursor:pointer;">&gt; advanced...</div>
            <div id="remove_cards_box" class="remove_cards_box" style="display:none">
              <div style="font-size:0.85em;font-weight:bold">remove cards from play: </div>
              <ul id="removecards" class="removecards">
              <li><input class="remove_card" type="checkbox" name="asia" /> Asia Scoring</li>
              <li><input class="remove_card" type="checkbox" name="europe" /> Europe Scoring</li>
              <li><input class="remove_card" type="checkbox" name="mideast" /> Middle-East Scoring</li>
              <li><input class="remove_card" type="checkbox" name="duckandcover" /> Duck and Cover</li>
              <li><input class="remove_card" type="checkbox" name="fiveyearplan" /> Five Year Plan</li>
              <li><input class="remove_card" type="checkbox" name="socgov" /> Socialist Governments</li>
              <li><input class="remove_card" type="checkbox" name="fidel" /> Fidel</li>
              <li><input class="remove_card" type="checkbox" name="vietnamrevolts" /> Vietnam Revolts</li>
              <li><input class="remove_card" type="checkbox" name="blockade" /> Blockade</li>
              <li><input class="remove_card" type="checkbox" name="koreanwar" /> Korean War</li>
              <li><input class="remove_card" type="checkbox" name="romanianab" /> Romanian Abdication</li>
              <li><input class="remove_card" type="checkbox" name="arabisraeli" /> Arab Israeli War</li>
              <li><input class="remove_card" type="checkbox" name="comecon" /> Comecon</li>
              <li><input class="remove_card" type="checkbox" name="nasser" /> Nasser</li>
              <li><input class="remove_card" type="checkbox" name="warsawpact" /> Warsaw Pact</li>
              <li><input class="remove_card" type="checkbox" name="degualle" /> De Gualle Leads France</li>
              <li><input class="remove_card" type="checkbox" name="naziscientist" /> Nazi Scientists Captured</li>
              <li><input class="remove_card" type="checkbox" name="truman" /> Truman</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="olympic" checked /> Olympic Games</li>
              <li><input class="remove_card" type="checkbox" name="nato" /> NATO</li>
              <li><input class="remove_card" type="checkbox" name="indreds" /> Independent Reds</li>
              <li><input class="remove_card" type="checkbox" name="marshall" /> Marshall Plan</li>
              <li><input class="remove_card" type="checkbox" name="indopaki" /> Indo-Pakistani War</li>
              <li><input class="remove_card" type="checkbox" name="containment" /> Containment</li>
              <li><input class="remove_card" type="checkbox" name="cia" /> CIA Created</li>
              <li><input class="remove_card" type="checkbox" name="usjapan" /> US/Japan Defense Pact</li>
              <li><input class="remove_card" type="checkbox" name="suezcrisis" /> Suez Crisis</li>
              <li><input class="remove_card" type="checkbox" name="easteuropean" /> East European Unrest</li>
              <li><input class="remove_card" type="checkbox" name="decolonization" /> Decolonization</li>
              <li><input class="remove_card" type="checkbox" name="redscare" /> Red Scare</li>
              <li><input class="remove_card" type="checkbox" name="unintervention" /> UN Intervention</li>
              <li><input class="remove_card" type="checkbox" name="destalinization" /> Destalinization</li>
              <li><input class="remove_card" type="checkbox" name="nucleartestban" /> Nuclear Test Ban Treaty</li>
              <li><input class="remove_card" type="checkbox" name="formosan" /> Formosan Resolution</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="defectors" /> Defectors</li>
              <li><input class="remove_card optional_edition " type="checkbox" name="specialrelation" /> Special Relationship</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="cambridge" /> The Cambridge Five</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="norad" /> NORAD</li>
            </ul>
            <ul class="removecards" style="clear:both;margin-top:13px">
              <li><input class="remove_card" type="checkbox" name="brushwar" /> Brush War</li>
              <li><input class="remove_card" type="checkbox" name="centralamerica" /> Central America Scoring</li>
              <li><input class="remove_card" type="checkbox" name="seasia" /> Southeast Asia Scoring</li>
              <li><input class="remove_card" type="checkbox" name="armsrace" /> Arms Race</li>
              <li><input class="remove_card" type="checkbox" name="cubanmissile" /> Cuban Missile Crisis</li>
              <li><input class="remove_card" type="checkbox" name="nuclearsubs" /> Nuclear Subs</li>
              <li><input class="remove_card" type="checkbox" name="quagmire" /> Quagmire</li>
              <li><input class="remove_card" type="checkbox" name="saltnegotiations" /> Salt Negotiations</li>
              <li><input class="remove_card" type="checkbox" name="beartrap" /> Bear Trap</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="summit" checked /> Summit</li>
              <li><input class="remove_card" type="checkbox" name="howilearned" /> How I Learned to Stop Worrying</li>
              <li><input class="remove_card" type="checkbox" name="junta" /> Junta</li>
              <li><input class="remove_card" type="checkbox" name="kitchendebates" /> Kitchen Debates</li>
              <li><input class="remove_card" type="checkbox" name="missileenvy" /> Missile Envy</li>
              <li><input class="remove_card" type="checkbox" name="wwby" /> We Will Bury You</li>
              <li><input class="remove_card" type="checkbox" name="brezhnev" /> Brezhnev Doctrine</li>
              <li><input class="remove_card" type="checkbox" name="portuguese" /> Portuguese Empire Crumbles</li>
              <li><input class="remove_card" type="checkbox" name="southafrican" /> South African Unrest</li>
              <li><input class="remove_card" type="checkbox" name="allende" /> Allende</li>
              <li><input class="remove_card" type="checkbox" name="willybrandt" /> Willy Brandt</li>
              <li><input class="remove_card" type="checkbox" name="muslimrevolution" /> Muslim Revolution</li>
              <li><input class="remove_card" type="checkbox" name="abmtreaty" /> ABM Treaty</li>
              <li><input class="remove_card" type="checkbox" name="culturalrev" /> Cultural Revolution</li>
              <li><input class="remove_card" type="checkbox" name="flowerpower" /> Flower Power</li>
              <li><input class="remove_card" type="checkbox" name="u2" /> U-2 Incident</li>
              <li><input class="remove_card" type="checkbox" name="opec" /> OPEC</li>
              <li><input class="remove_card" type="checkbox" name="lonegunman" /> Lone Gunman</li>
              <li><input class="remove_card" type="checkbox" name="colonial" /> Colonial</li>
              <li><input class="remove_card" type="checkbox" name="panamacanal" /> Panama Canal</li>
              <li><input class="remove_card" type="checkbox" name="campdavid" /> Camp David Accords</li>
              <li><input class="remove_card" type="checkbox" name="puppet" /> Puppet Governments</li>
              <li><input class="remove_card" type="checkbox" name="grainsales" /> Grain Sales to Soviets</li>
              <li><input class="remove_card" type="checkbox" name="johnpaul" /> John Paul</li>
              <li><input class="remove_card" type="checkbox" name="deathsquads" /> Death Squads</li>
              <li><input class="remove_card" type="checkbox" name="oas" /> OAS Founded</li>
              <li><input class="remove_card" type="checkbox" name="nixon" /> Nixon Plays the China Card</li>
              <li><input class="remove_card" type="checkbox" name="sadat" /> Sadat Expels Soviets</li>
              <li><input class="remove_card" type="checkbox" name="shuttle" /> Shuttle Diplomacy</li>
              <li><input class="remove_card" type="checkbox" name="voiceofamerica" /> Voice of America</li>
              <li><input class="remove_card" type="checkbox" name="liberation" /> Liberation Theology</li>
              <li><input class="remove_card" type="checkbox" name="ussuri" /> Ussuri River Skirmish</li>
              <li><input class="remove_card" type="checkbox" name="asknot" /> Ask Not What Your Country Can Do For You</li>
              <li><input class="remove_card" type="checkbox" name="alliance" /> Alliance for Progress</li>
              <li><input class="remove_card" type="checkbox" name="africa" /> Africa Scoring</li>
              <li><input class="remove_card" type="checkbox" name="onesmallstep" /> One Small Step</li>
              <li><input class="remove_card" type="checkbox" name="southamerica" /> South America</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="che" /> Che</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="tehran" /> Our Man in Tehran</li>
            </ul>
            <ul class="removecards" style="clear:both;margin-top:13px">
              <li><input class="remove_card" type="checkbox" name="iranianhostage" /> Iranian Hostage Crisis</li>
              <li><input class="remove_card" type="checkbox" name="ironlady" /> The Iron Lady</li>
              <li><input class="remove_card" type="checkbox" name="reagan" /> Reagan Bombs Libya</li>
              <li><input class="remove_card" type="checkbox" name="starwars" /> Star Wars</li>
              <li><input class="remove_card" type="checkbox" name="northseaoil" /> North Sea Oil</li>
              <li><input class="remove_card" type="checkbox" name="reformer" /> The Reformer</li>
              <li><input class="remove_card" type="checkbox" name="marine" /> Marine Barracks Bombing</li>
              <li><input class="remove_card" type="checkbox" name="KAL007" /> Soviets Shoot Down KAL-007</li>
              <li><input class="remove_card" type="checkbox" name="glasnost" /> Glasnost</li>
              <li><input class="remove_card" type="checkbox" name="ortega" /> Ortega Elected in Nicaragua</li>
              <li><input class="remove_card" type="checkbox" name="terrorism" /> Terrorism</li>
              <li><input class="remove_card" type="checkbox" name="ironcontra" /> Iran Contra Scandal</li>
              <li><input class="remove_card" type="checkbox" name="chernobyl" /> Chernobyl</li>
              <li><input class="remove_card" type="checkbox" name="debtcrisis" /> Latin American Debt Crisis</li>
              <li><input class="remove_card" type="checkbox" name="teardown" /> Tear Down this Wall</li>
              <li><input class="remove_card" type="checkbox" name="evilempire" /> An Evil Empire</li>
              <li><input class="remove_card" type="checkbox" name="aldrichames" /> Aldrich Ames Remix</li>
              <li><input class="remove_card" type="checkbox" name="pershing" /> Pershing II Deployed</li>
              <li><input class="remove_card" type="checkbox" name="wargames" /> Wargames</li>
              <li><input class="remove_card" type="checkbox" name="solidarity" /> Solidarity</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="iraniraq" /> Iran-Iraq War</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="yuri" /> Yuri and Samantha</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="awacs" /> AWACS Sale to Saudis</li>
            </ul>

            <div style="font-size:0.85em;font-weight:bold;clear:both;margin-top:10px;">add cards to game: </div>
            <ul id="removecards" class="removecards">
              <li><input class="remove_card saito_edition" type="checkbox" name="culturaldiplomacy" checked /> Cultural Diplomacy (Early-War)</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="handshake" checked /> Handshake in Space (Mid-War)</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="rustinredsquare" checked /> Rust Lands in Red Square (Late-War)</li>
              <li><input class="remove_card" type="checkbox" name="gouzenkoaffair" /> Gouzenko Affair (Early-War)</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="berlinagreement" checked /> 1971 Berlin Agreement (Mid-War)</li>
            </div>
          </form>

          `;

  }

  settleVPOutstanding() {

    if (this.game.state.vp_outstanding != 0) {
      this.game.state.vp += this.game.state.vp_outstanding;
    }
    this.game.state.vp_outstanding = 0;
    this.updateVictoryPoints();

  }

  addShowCardEvents(onCardClickFunction) {

    let twilight_self = this;

    $('.card').off();

    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

      $('.showcard').off();
      $('.showcard').mouseover(function() {
        let card = $(this).attr("id");
        twilight_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        twilight_self.hideCard(card);
      });

    }

    this.hud.status_callback = () => {
      $('.card').on('click', function() {
        // pass our click option
        onCardClickFunction(this);
      });
    }

    this.hud.status_callback();

  }

  addLogCardEvents() {

    let twilight_self = this;

    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

      $('.logcard').off();
      $('.logcard').mouseover(function() {
        let card = $(this).attr("id");
        twilight_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        twilight_self.hideCard(card);
      });

    }

  }

  returnFormattedGameOptions(options) {
    let new_options = {};
    for (var index in options) {
      if (index == "player1") {
        new_options[index] = options[index] == "ussr" ? "us" : "ussr";
      } else {
        new_options[index] = options[index]
      }
    }

    return new_options;
  }



  formatStatusHeader(status_header, include_back_button=false) {
    let back_button_html = `<i class="fa fa-arrow-left" id="back_button"></i>`;
    return `
    <div class="status-header">
      ${include_back_button ? back_button_html : ""}
      <div style="text-align: center;">
        ${status_header}
      </div>
    </div>
    `
  }


} // end Twilight class

module.exports = Twilight;










