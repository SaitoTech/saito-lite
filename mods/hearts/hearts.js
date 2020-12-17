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

      this.initializeDice();

      this.game.queue.push("newround");
      this.game.queue.push("READY");
      this.game.queue.push("init");

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

      if (mv[0] === "newround") {
	console.log("new round...");
	this.game.queue.push("ACKNOWLEDGE\tThis is the start of a new Round");
	this.game.queue.splice(qe, 1);
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







  returnState() {

    let state = {};

    return state;
  }
}


module.exports = Hearts;

