const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Hearts extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "Hearts";
    this.description = 'A version of Hearts for the Saito Arcade';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Classic Cardgame";
    this.card_img_dir = '/hearts/img/cards';

    this.minPlayers = 2;
    this.maxPlayers = 4;

    return this;

  }




  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-create-game") {
      return {
        slug: this.slug,
        title: this.name,
        description: this.description,
        publisher_message: "",
        returnGameOptionsHTML: this.returnGameOptionsHTML.bind(this),
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
      }
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/hearts/img/arcade/arcade-banner-background.png";
      obj.title = "Hearts";
      return obj;
    }


    return null;

  }
  


  //
  // every time the game boots
  //
  initializeGame(game_id) {

    if (!this.game.state) {

      this.game.state = this.returnState();

      //this.initializeDice();

      this.game.queue.push("newround");
      this.game.queue.push("READY");
      this.game.queue.push("init");

      this.game.queue.push("DEAL\t1\t4\t13");
      this.game.queue.push("DEAL\t1\t3\t13");
      this.game.queue.push("DEAL\t1\t2\t13");
      this.game.queue.push("DEAL\t1\t1\t13");
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
      this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    }

  }

  //
  // initialize HTML (overwrites game template stuff, so include...)
  //
  initializeHTML(app) {

    super.initializeHTML(app);

    //
    // add ui components here
    //
    this.log.render(app, this);
    this.log.attachEvents(app, this);

    //
    // ADD CHAT
    //
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    //
    // ADD MENU
    //
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
        game_mod.handleStatsMenu();
      }
    });
    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        app.browser.requestFullscreen();
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
    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

    this.cardbox.render(app, this);
    this.cardbox.attachEvents(app, this);

    //
    // we want hud to support cardbox, so re-render
    //
    this.hud.render(app, this);
    this.hud.attachEvents(app, this);

    //
    // add card events -- for special hud treatment
    //
    // this means that if you click on an element tagged as class "card" 
    // the cardbox will automatically handle the click events and the 
    // card popup and menu options. set
    //
    //   this.cardbox.skip_card_prompt = 1;
    //
    // and you'll see what happens
    //
    this.hud.addCardType("card", "select", this.cardbox_callback);

    //
    // this prevents desktop users going creay
    //
    //if (!app.browser.isMobileBrowser(navigator.userAgent)) {
    //   this.cardbox.skip_card_prompt = 1;
    //}

    try {

      if (app.browser.isMobileBrowser(navigator.userAgent)) {

        this.hammer.render(this.app, this);
        this.hammer.attachEvents(this.app, this, '.gameboard');

      } else {

        let twilight_self = this;

        this.sizer.render(this.app, this);
        this.sizer.attachEvents(this.app, this, '.gameboard');

      }

    } catch (err) {}

  }






  //
  // main game queue
  //
  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      // TODO: make a cute little thing that as long as players are set up 
      // we can restart the game without going thru arcade...
      // if (mv[0) === "NEWGAME") {
      //   this.game = this.newGame(game_id);
      //   this.initializeGame();
      // }
      if (mv[0] === "newround") {
        console.log("new round...");
        this.game.queue.push("play\t2");
        this.game.queue.push("play\t1");
        this.game.queue.push("ACKNOWLEDGE\tThis is the start of a new Round");

        //
        // if we don't splice, we'll loop endlessly
        //
        //this.game.queue.splice(qe, 1);

        return 1;
      }

      if (mv[0] === "play") {

        let player_to_go = parseInt(mv[1]);
        let hearts_self = this;

        if (this.game.player == player_to_go) {
          this.updateStatusAndListCards("Select a Card", this.game.deck[0].hand, function(card) {

alert(`You picked: ${card}`);

            this.addMove("resolve");
            this.addMove(`NOTIFY\tPlayer ${this.game.player} picked card ${this.game.deck[0].cards[card].name}`);
            this.endTurn();
          });
        } else {
          this.updateStatus(`Player ${player_to_go} is taking their turn`);
        }

        //
        // STOP EXECUTION
        //
        return 0;
      }

      //
      // WE RELOAD AND HIT PLAYER X moving, and pause again, so if we want
      // to keep going deeper into the queue, PLAYER X should tell us to 
      // remove their move.
      //
      if (mv[0] === "resolve") {
        this.game.queue.splice(qe-1, 2);
        return 1;
      }

      if (mv[0] === "init") {
        console.log("sometimes we can handle init stuff in queue...");
        this.game.queue.splice(qe, 1);
        return 1;
      }



    }

    return 1;
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

  returnCardImage(cardidx) {

    let c = null;

    for (let z = 0; c == undefined && z < this.game.deck.length; z++) {
      c = this.game.deck[z].cards[cardidx];
      if (c == undefined) { c = this.game.deck[z].discards[cardidx]; }
      if (c == undefined) { c = this.game.deck[z].removed[cardidx]; }
    }

    //
    // card not found
    //
    if (c == undefined) {
      return '<div class="noncard">'+cardidx+'</div>';
    }

    return `<img class="cardimg showcard" id="${cardidx}" src="/${this.returnSlug()}/img/cards/${c.name}" />`;



  }



  returnState() {

    let state = {};

    return state;
  }
}


module.exports = Hearts;

