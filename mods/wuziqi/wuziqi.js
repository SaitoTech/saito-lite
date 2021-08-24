const saito = require('../../lib/saito/saito');
const GameTemplate = require('../../lib/templates/gametemplate');
//const GameBoardSizer = require('../../lib/templates/lib/game-board-sizer/game-board-sizer');
//const GameHammerMobile = require('../../lib/templates/lib/game-hammer-mobile/game-hammer-mobile');


class wuziqi extends GameTemplate {

    constructor(app) {

        super(app);

        this.name = "Wuziqi";
        this.description = "A simple game where two players alternately place black and white tiles on a go board attempting to place 5 of them in adjacent positions."
        this.categories = "Boardgame Strategy";
        this.type = "Boardgame";

        this.minPlayers = 2;
        this.maxPlayers = 2;

        this.game.size = 13;
        this.useHUD = 0;

        return this;
    }


    initialize() {

        super.initializeHTML(app);
        this.app.modules.respondTo("chat-manager").forEach(mod => {
            mod.respondTo('chat-manager').render(this.app, this);
        });

        this.menu.addMenuOption({
            text: "Player" + this.game.player,
            id: "playerno",
            class: "playerno",
            callback: function (app, game_mod) {

            }
        });
        this.menu.addMenuOption({
            text: "Game",
            id: "game-game",
            class: "game-game",
            callback: function (app, game_mod) {
                game_mod.menu.showSubMenu("game-game");
            }
        });
        this.menu.addSubMenuOption("game-game", {
            text: "How to Play",
            id: "game-intro",
            class: "game-intro",
            callback: function (app, game_mod) {
                game_mod.menu.hideSubMenus();
                game_mod.overlay.showOverlay(game_mod.app, game_mod, game_mod.returnRulesOverlay());
            }
        });
        this.menu.addSubMenuOption("game-game", {
            text: "Exit",
            id: "game-exit",
            class: "game-exit",
            callback: function (app, game_mod) {
                window.location.href = "/arcade";
            }
        });

        let main_menu_added = 0;
        let community_menu_added = 0;
        for (let i = 0; i < this.app.modules.mods.length; i++) {
            if (this.app.modules.mods[i].slug === "chat") {
                for (let ii = 0; ii < this.game.players.length; ii++) {
                    if (this.game.sides[ii] != this.app.wallet.returnPublicKey()) {

                        // add main menu
                        if (main_menu_added == 0) {
                            this.menu.addMenuOption({
                                text: "Chat",
                                id: "game-chat",
                                class: "game-chat",
                                callback: function (app, game_mod) {
                                    game_mod.menu.showSubMenu("game-chat");
                                }
                            })
                            main_menu_added = 1;
                        }

                        if (community_menu_added == 0) {
                            this.menu.addSubMenuOption("game-chat", {
                                text: "Community",
                                id: "game-chat-community",
                                class: "game-chat-community",
                                callback: function (app, game_mod) {
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
                        let members = [this.game.sides[ii], this.app.wallet.returnPublicKey()].sort();
                        let gid = this.app.crypto.hash(members.join('_'));
                        let name = "Player " + (ii + 1);
                        let chatmod = this.app.modules.mods[i];

                        this.menu.addSubMenuOption("game-chat", {
                            text: name,
                            id: "game-chat-" + (ii + 1),
                            class: "game-chat-" + (ii + 1),
                            callback: function (app, game_mod) {
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
            text: '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
            id: "game-menu-fullscreen",
            callback: function (app, game_mod) {
                game_mod.menu.hideSubMenus();
                app.browser.requestFullscreen();
            }
        });

        this.menu.render(app, this);
        this.menu.attachEvents(app, this);

    }
    returnRulesOverlay() {

        let overlay_html = `<div class="intro">
          <h1>Welcome to Wuziqi</h1>

          </div>`;
        return overlay_html;


    }

    initializeGame(game_id) {

        this.loadGame(game_id);

        this.game.sides = ["black", "white"];

        document.querySelector('.board').style.gridTemplateColumns = 'repeat(' + this.game.size + ', 1fr)';

        if (!this.game.board) {
            generateBoard(this.game.size);
        }

        if (this.browser_active == 1) {
            try {
                drawBoard(this.game.board);
                if (this.game.target == this.game.player) {
                    addEvents(this.game.board);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }



    generateBoard(x) {
        var cells = x * x;
        this.game.board = [];
        for (let n = 1; n <= cells; n++) {
            let cell = {};
            cell.sets = {};
            cell.id = n;
            cell.sets.row = Math.ceil(n / x);
            cell.sets.col = ((n - 1) % x) + 1;
            cell.sets.lddiag = (x - cell.sets.col) + cell.sets.row;
            cell.sets.rudiag = cell.sets.row + cell.sets.col - 1;
            cell.owner = "none";
            cell.winner = "no"
            this.game.board.push(cell);
        }
        //console.log(this);
    }

    drawBoard(board) {
        boardElement = document.querySelector('.board');
        boardElement.innerHTML = "";
        board.forEach(cell => {
            let el = document.createElement('div');
            el.id = cell.id;
            el.classList.add("owner_" + cell.owner);
            el.classList.add("winner_" + cell.winner);
            boardElement.append(el);
        });
    }

    addEvents(board) {
        board.forEach(cell => {
            el = document.getElementById(cell.id);
            if (cell.owner == "none") {
                el.addEventListener("click", (e) => {
                    cell.owner = this.game.sides[this.game.player];
                    // check for winner.
                    let winner = findWinner(cell);
                    if (winner != "no winner") {
                        this.game.winner = this.game.player;
                        let mv = this.serializeBoard(board + "\t");
                        this.addMove(mv);
                        this.addMove("gameover");
                        this.endTurn();
                        return 1;
                    }
                    drawBoard(board);

                    salert("You Win!");

                    // send move


                    let mv = this.serializeBoard(board);
                    this.addMove(mv);

                    //addEvents(board);
                    //this.game.player = (this.game.player + 1) % 2;
                    console.log(serializeBoard(board));
                });
            }
        });
    }

    addMove(mv) {
        this.moves.push(mv);
    }


    endTurn() {
        let extra = {};
        extra.target = (this.game.player + 1) % 2;
        this.game.turn = this.moves;
        this.moves = [];
        this.sendMessage("game", extra);
    }



    //
    // Core Game Logic
    //
    handleGameLoop(msg = null) {

        let wuziqi_self = this;

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

            }
      
// here - handling game logic.

    }


    findWinner(cell) {
        let win = 0;
        let winner = "no winner";
        for (const [key, value] of Object.entries(cell.sets)) {
            let testset = returnCells(key, value);
            if (testset.length > 4) {
                testset.forEach(item => {
                    if (item.owner == cell.owner) {
                        win = win + 1;
                        if (win > 4) {
                            showWin(key, value, cell);
                            winner = cell.owner;
                        }
                    } else {
                        win = 0;
                    }
                });
            }
        };
        return winner;
    }

    showWin(key, value, cell) {
        let set = returnCells(key, value);
        addWinners(set, cell);
        set.reverse();
        addWinners(set, cell);
    }

    addWinners(set, cell) {
        let draw = false;
        set.forEach(el => {
            if (el.id == cell.id) {
                draw = true;
            }
            if (draw) {
                if (el.owner == cell.owner) {
                    el.winner = "yes";
                } else {
                    draw = false;
                }
            }
        });
    }

    returnCells(type, value) {
        var cells = [];
        this.game.board.forEach(cell => {
            if (cell.sets[type] == value) {
                cells.push(cell);
            }
        });
        return cells;
    }

    serializeBoard(board) {
        boardString = "";
        board.forEach(cell => {
            boardString += shortOwner(cell.owner);
        });
        return boardString;
    }

    boardFromString(boardString) {
        generateBoard(Math.sqrt(boardString.length));
        this.game.board.forEach(cell, idx => {
            cell.owner = boardString[idx];
        });
    }

    shortOwner(s) {
        switch (s) {
            case "black":
                return "B";
                break;
            case "white":
                return "W";
                break;
            default:
                return "N";
                break;
        }
    }


}

module.exports = Wuziqi;