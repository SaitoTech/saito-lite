const { timingSafeEqual } = require('crypto');

const saito = require('../../lib/saito/saito');
const GameTemplate = require('../../lib/templates/gametemplate');
const { update } = require('../../lib/templates/lib/game-hammer-mobile/game-hammer-mobile');
//const GameBoardSizer = require('../../lib/templates/lib/game-board-sizer/game-board-sizer');
//const GameHammerMobile = require('../../lib/templates/lib/game-hammer-mobile/game-hammer-mobile');


class Wuziqi extends GameTemplate {

    constructor(app) {

        super(app);

        this.name = "Wuziqi";
        this.title = "五子棋"
        this.description = "五子棋 aka Gokomu and Gobang! is a simple game where two players alternately place black and white tiles on a go board attempting to place 5 of them in adjacent positions."
        this.categories = "Boardgame Strategy";
        this.type = "Boardgame";

        this.minPlayers = 2;
        this.maxPlayers = 2;

        this.useHUD = 0;

        this.moves = [];
        this.bestof = 1;

        return this;
    }


    initializeHTML(app) {

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
                    if (this.game.players[ii] != this.app.wallet.returnPublicKey()) {

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
                        let members = [this.game.players[ii], this.app.wallet.returnPublicKey()].sort();
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

        this.game.sides = ["black", "white"];
        this.game.score = [0,0];

        this.game.size = this.game.options.board_size;

        if (!this.game.board || this.game.board.length < 1) {
            this.generateBoard(this.game.size);
        }

        if (this.browser_active == 1) {
            try {
                this.drawBoard(this.game.board);
                if (this.game.player == 1) {
                    this.addEvents(this.game.board);
                    this.updateStatus("You to play.");
                } else {
                    this.updateStatus("Waiting for: <span class='playertitle'>Black</span>");
                }
                this.updateScore();

            } catch (err) {
                console.log(err);
            }
        }


    }

    returnRulesOverlay() {

        let overlay_html = `<div class="intro">
          <h1>Welcome to Wuziqi</h1>

          </div>`;
        return overlay_html;


    }

    initializeGame(game_id) {

        this.loadGame(game_id);

        this.game.queue.push("READY");
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
            cell.winner = "no";
            this.game.board.push(cell);
        }
        //console.log(this);
    }

    drawBoard(board) {
        boardElement = document.querySelector('.board');
        boardElement.style.gridTemplateColumns = 'repeat(' + this.game.size + ', 1fr)';

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
                el.classList.add("active");
                el.addEventListener("click", (e) => {
                    cell.owner = this.game.sides[this.game.player - 1];
                    // check for round winner.
                    let winner = this.findWinner(cell);
                    this.drawBoard(board);

                    // finish turn
                    if (winner != "no winner") {
                        this.game.score[this.game.player - 1] = parseInt(this.game.score[this.game.player - 1]) + 1;
                        this.updateScore();

                        if (this.game.score[this.game.player - 1] > this.game.options.best_of / 2) {
                            this.game.winner = this.game.player;
                            salert("You Win!");
                            this.addMove("gameover\t" + this.game.player);
                        } else {
                            this.addMove("roundover\t" + this.game.player);
                        }
                    }
                    let mv = "place\t" + this.serializeBoard(board) + "\t" + e.target.id + "\t" + this.game.player + "\t" + this.game.score[0] + "|" + this.game.score[1];
                    this.addMove(mv);
                    this.endTurn();
                });
            }
        });
    }

    updateScore() {
        document.querySelector(".blackscore").innerHTML = "Black: " + this.game.score[0];
        document.querySelector(".whitescore").innerHTML = "White: " + this.game.score[1];
        document.querySelector(".best_of").innerHTML = "Best of: " + this.game.options.best_of;
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

        //let groo = this;

        if (this.game.queue.length > 0) {
            //
            // save before we start executing the game queue
            //
            this.saveGame(this.game.id);
            let qe = this.game.queue.length - 1;
            let mv = this.game.queue[qe].split("\t");

            //
            // game over conditions
            //

            if (mv[0] === "gameover") {
                salert("you lose - sad");
                this.updateScore();
                this.updateStatus("<span class='playertitle'>" + this.game.sides[mv[1] - 1] + "</span> wins!")
                this.drawBoard(this.game.board);
                this.resignGame();
                this.game.queue.splice(this.game.queue.length - 1, 1);
                return 0;
            }
            if (mv[0] == "roundover") {
                this.drawBoard(this.game.board);
                this.updateScore();
                this.updateStatus("<span class='playertitle'>" + this.game.sides[mv[1] - 1] + "</span> wins the round.");
                //initiate next round.
                if (mv[1] != this.game.player) {
                    this.addContinueButton();
                } else {
                    this.drawBoard(this.game.board);
                }
                this.game.queue.splice(this.game.queue.length - 1, 1);
            }
            if (mv[0] == "place") {
                this.game.score[0] = mv[4].split("|")[0];
                this.game.score[1] = mv[4].split("|")[1];
                this.updateScore();
                this.boardFromString(mv[1]);
                let cell = this.returnCellById(parseInt(mv[2]));
                let winner = this.findWinner(cell);
                this.drawBoard(this.game.board);
                if (this.game.player != mv[3]) {
                    this.addEvents(this.game.board);
                    this.updateStatus("<span class='playertitle'>You</span> to play.");
                } else {
                    this.updateStatus("Waiting for: <span class='playertitle'>" + this.game.sides[(mv[3]) % 2] + "</span>");
                }
                this.game.queue.splice(this.game.queue.length - 1, 1);
                return 1;
            }
        }
    }

    addContinueButton() {
        var el = document.createElement('button');
        el.textContent = "Continue";
        el.classList.add("continue");
        el.addEventListener("click", () => {
            this.generateBoard(this.game.options.board_size);
            this.drawBoard(this.game.board);
            this.addEvents(this.game.board);
            this.updateStatus("You to play");
        });
        document.querySelector(".status").append(el);
    }

    findWinner(cell) {
        let win = 0;
        let winner = "no winner";
        for (const [key, value] of Object.entries(cell.sets)) {
            let testset = this.returnCells(key, value);
            if (testset.length > 4) {
                testset.forEach(item => {
                    if (item.owner == cell.owner) {
                        win = win + 1;
                        if (win > 4) {
                            this.showWin(key, value, cell);
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
        let set = this.returnCells(key, value);
        this.addWinners(set, cell);
        set.reverse();
        this.addWinners(set, cell);
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

    returnCellById(id) {
        var cell = {};
        this.game.board.forEach(item => {
            if (item.id == id) {
                cell = item;
            }
        });
        return cell;
    }

    serializeBoard(board) {
        boardString = "";
        board.forEach(cell => {
            boardString += this.shortOwner(cell.owner);
        });
        return boardString;
    }

    boardFromString(boardString) {
        this.generateBoard(Math.sqrt(boardString.length));
        this.game.board.forEach((cell, idx) => {
            cell.owner = this.longOwner(boardString[idx]);
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

    longOwner(s) {
        switch (s) {
            case "B":
                return "black";
                break;
            case "W":
                return "white";
                break;
            default:
                return "none";
                break;
        }
    }

    returnGameOptionsHTML() {
        return `
        <label for="best_of">Best of:</label>
        <select name="best_of">
          <option value="1">1</>
          <option value="3" selected>3</>
          <option value="5">5</>
          <option value="7">7</>
          <option value="9">9</>
          <option value="11">11</>
          <option value="13">13</>
          <option value="15">15</>
        </select>
        <label for="board_size">
        <select name="board_size">
        <option value="11">11</>
        <option value="13" selected>13</>
        <option value="15">15</>
        <option value="17">17</>
        <option value="19">19</>
        <option value="21">21</>
        <option value="23">23</>
        <option value="25">25</>
      </select>
      <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>
    `;

    }


}

module.exports = Wuziqi;