const { timingSafeEqual } = require('crypto');
const saito = require('../../lib/saito/saito');
const GameTemplate = require('../../lib/templates/gametemplate');
const { update } = require('../../lib/templates/lib/game-hammer-mobile/game-hammer-mobile');

class Wuziqi extends GameTemplate {

    constructor(app) {

        super(app);

        // Define static game parameters and add global variables.

        this.name = "Wuziqi";
        this.title = "五子棋"
        this.description = "五子棋 aka Gokomu and Gobang! is a simple game where two players alternately place black and white tiles on a go board attempting to place 5 of them in adjacent positions."
        this.categories = "Boardgame Strategy";
        this.type = "Boardgame";
        this.status = "Alpha";

        this.minPlayers = 2;
        this.maxPlayers = 2;

        this.useHUD = 0;

        this.moves = [];
        this.bestof = 1;

        return this;
    }


    initializeHTML(app) {

        // Override the game template initializeHTML function
        super.initializeHTML(app);

        // Add the Saito Chat Manager for in-game Chat
        this.app.modules.respondTo("chat-manager").forEach(mod => {
            mod.respondTo('chat-manager').render(this.app, this);
        });

        // Add Menu Items to standard Menu
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

        // Add Chat Features to Menu
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
            text: '<i class="fa fa-fullscreen" aria-hidden="true"></i>',
            id: "game-menu-fullscreen",
            callback: function (app, game_mod) {
                game_mod.menu.hideSubMenus();
                app.browser.requestFullscreen();
            }
        });

        // Render menu and attach events
        this.menu.render(app, this);
        this.menu.attachEvents(app, this);

        // Initialize our game
        this.game.sides = ["black", "white"];
        this.game.score = [0, 0];

        // Set the game board to the size set in the options
        this.game.size = this.game.options.board_size;

        // Create the game board object if it does not exist.
        if (!this.game.board || this.game.board.length < 1) {
            this.generateBoard(this.game.size);
        }

        // Render board and set up values.
        try {
            // Check if anyone has played yet (black goes first)
            let blackplayedyet = this.serializeBoard(this.game.board).indexOf("B");

            // If no one has played set up the board
            if (blackplayedyet < 0) {
                this.drawBoard(this.game.board);
                this.addEvents(this.game.board);
                // If you are black, you are up.
                if (this.game.player == 1) {
                    this.updateStatus("You to play.");
                } else {
                    this.updateStatus("Waiting for: <span class='playertitle'>Black</span>");
                }
                this.updateScore();

            }

        } catch (err) {
            console.log(err);
        }


    }

    returnRulesOverlay() {

        let overlay_html = `<div class="intro">
          <h1>Welcome to Wuziqi</h1>
            Wuziqi also known as Gokomu and Gobang is a simple two player game played on a Go board.  Players alternately place black and white tokens. The first player to place five of their own tokens in a continuous line, vertical, horizontal or diagonally, wins. 
          </div>`;
        return overlay_html;


    }

    initializeGame(game_id) {

        // Grab the game from my wallet if it's there, and the arcade if not.
        this.loadGame(game_id);

        // Send 'let's get started' message.
        this.game.queue.push("READY");
    }

    // Create the game board data structure
    generateBoard(x) {
        // Set the board size (always a square of side length set by the user.)
        var cells = x * x;
        // Clear the board
        this.game.board = [];
        // Itterate through the cells in the board
        for (let n = 1; n <= cells; n++) {
            // Create an empty cell
            let cell = {};
            // Sets are the rows, columns and diagonals to which the cell belongs.
            cell.sets = {};
            // Add the id
            cell.id = n;
            // Set the row as the total divided by the side length rounded up.
            cell.sets.row = Math.ceil(n / x);
            // Set the collumn as the cell id mod side length.
            cell.sets.col = ((n - 1) % x) + 1;
            // Set the left down diagonal as where inverse of the column summed with row is constant 
            cell.sets.lddiag = (x - cell.sets.col) + cell.sets.row;
            // Set the right and up diagonal to where the sum of the row and collumn
            cell.sets.rudiag = cell.sets.row + cell.sets.col - 1;
            // The cell is blank.
            cell.owner = "none";
            // The cell does not have a winning tile in it.
            cell.winner = "no";
            this.game.board.push(cell);
        }
        //console.log(this);
    }

    // UI Score Update
    updateScore() {
        document.querySelector(".blackscore").innerHTML = "Black: " + this.game.score[0];
        document.querySelector(".whitescore").innerHTML = "White: " + this.game.score[1];
        document.querySelector(".best_of").innerHTML = "Best of: " + this.game.options.best_of;
    }


    // Itterate through the board object to draw each cell
    drawBoard(board) {
        boardElement = document.querySelector('.board');
        // Add the CSS grit-template-columns value to the correct number of rows.
        boardElement.style.gridTemplateColumns = 'repeat(' + this.game.size + ', 1fr)';

        // Clear the board
        boardElement.innerHTML = "";
        // Draw the cells
        board.forEach(cell => {
            let el = document.createElement('div');
            el.id = cell.id;
            el.classList.add("owner_" + cell.owner);
            el.classList.add("winner_" + cell.winner);
            boardElement.append(el);
        });
    }

    // Add click events to the board
    addEvents(board) {
        board.forEach(cell => {
            el = document.getElementById(cell.id);
            // Only add click function to blank cells,
            if (cell.owner == "none") {
                // Add CSS indications that the cell can be clicked.
                el.classList.add("active");

                // When the cell is clicked
                el.addEventListener("click", (e) => {

                    // Set it's owner to the clicker.
                    cell.owner = this.game.sides[this.game.player - 1];
                    // Check for round winner.
                    let winner = this.findWinner(cell);
                    // Redraw the board - showing winning tokens and removing events.
                    this.drawBoard(board);

                    // Do the Saito Game Queue stuff

                    // If we have a winner
                    if (winner != "no winner") {
                        // Upate the scores
                        this.game.score[this.game.player - 1] = parseInt(this.game.score[this.game.player - 1]) + 1;
                        this.updateScore();

                        // If this round win, wins the game - let the winner know.
                        if (this.game.score[this.game.player - 1] > this.game.options.best_of / 2) {
                            this.game.winner = this.game.player;
                            salert("You Win!");

                            // Add a game over message to the stack.
                            this.addMove("gameover\t" + this.game.player);
                        } else {
                            // If not only add a 'round over' message to the stack.
                            this.addMove("roundover\t" + this.game.player);
                        }
                    }
                    // No matter what, add a 'place' message (filo - thi will be executed first) to update the board for both players.
                    // Set the message type, the board state, cell played, player, and existing scores.
                    let mv = "place\t" + this.serializeBoard(board) + "\t" + e.target.id + "\t" + this.game.player + "\t" + this.game.score[0] + "|" + this.game.score[1];
                    // Add this move to the stack 
                    this.addMove(mv);
                    // And send on chain.
                    this.endTurn();
                });
            }
        });
    }

    // Utility to add moves to stack
    addMove(mv) {
        this.moves.push(mv);
    }

    // Bundle moves and send them off.
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

        // The Game Loop hands us back moves from the end of the stack (the reverse order they were added)

        // Check we have a queue
        if (this.game.queue.length > 0) {
            
            // Save before we start executing the game queue
            this.saveGame(this.game.id);

            // Get the last move and split it on tabs.
            let qe = this.game.queue.length - 1;
            let mv = this.game.queue[qe].split("\t");

            
            // Game over conditions
            if (mv[0] === "gameover") {
                salert("You lose.");
                this.updateScore();
                this.updateStatus("<span class='playertitle'>" + this.game.sides[mv[1] - 1] + "</span> wins!")
                this.drawBoard(this.game.board);
                this.resignGame();
                // Remove this item from the queue.
                this.game.queue.splice(this.game.queue.length - 1, 1);
                return 0;
            }
            // Round over
            if (mv[0] == "roundover") {
                this.drawBoard(this.game.board);
                this.updateScore();
                this.updateStatus("<span class='playertitle'>" + this.game.sides[mv[1] - 1] + "</span> wins the round.");
                // Initiate next round.
                // Add a continue button if player did not play the winning token, just draw the board (and remove events if they did not);
                if (mv[1] != this.game.player) {
                    this.addContinueButton();
                } else {
                    this.drawBoard(this.game.board);
                }
                // Remove this item from the queue.
                this.game.queue.splice(this.game.queue.length - 1, 1);
            }
            if (mv[0] == "place") {
                // Set the game scores
                this.game.score[0] = mv[4].split("|")[0];
                this.game.score[1] = mv[4].split("|")[1];
                this.updateScore();
                // Regenerate the game board object from the serialized version sent by the other player.
                this.boardFromString(mv[1]);
                // Grab the played cell
                let cell = this.returnCellById(parseInt(mv[2]));
                // And check if it won the game
                let winner = this.findWinner(cell);
                // Redraw the board (adding winning cells if any)
                this.drawBoard(this.game.board);
                // If the player is next, add events, if not let them know they are waiting.
                if (this.game.player != mv[3]) {
                    this.addEvents(this.game.board);
                    this.updateStatus("<span class='playertitle'>You</span> to play.");
                } else {
                    this.updateStatus("Waiting for: <span class='playertitle'>" + this.game.sides[(mv[3]) % 2] + "</span>");
                }
                // Remove this item from the queue.
                this.game.queue.splice(this.game.queue.length - 1, 1);
                return 1;
            }
        }
    }

    // Add button to continue the game
    addContinueButton() {
        var el = document.createElement('button');
        el.textContent = "Continue";
        el.classList.add("continue");
        // Reinitialise the board and add events.
        el.addEventListener("click", () => {
            this.generateBoard(this.game.options.board_size);
            this.drawBoard(this.game.board);
            this.addEvents(this.game.board);
            this.updateStatus("You to play");
        });
        document.querySelector(".status").append(el);
    }

    // Check if a play won the round
    findWinner(cell) {
        let win = 0;
        let winner = "no winner";
        // Itterte through the row, column and diagonals for the played cell
        for (const [key, value] of Object.entries(cell.sets)) {
            // Test each to check if there are five cells in a row with the same colour tile.
            let testset = this.returnCells(key, value);
            // Don't worry if the diagonal is not long enough for five tokens
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

    // Add CSS class to show cells are part of a winning row of 5
    showWin(key, value, cell) {
        let set = this.returnCells(key, value);
        this.addWinners(set, cell);
        set.reverse();
        this.addWinners(set, cell);
    }
    
    // Add to each cell owned by the winner until running out
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

    // Return cells by set
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

    // Return the board as a series of letters B, W, N
    // For Black, White, No owner.
    serializeBoard(board) {
        boardString = "";
        board.forEach(cell => {
            boardString += this.shortOwner(cell.owner);
        });
        return boardString;
    }

    // Return a game board object from a serialised string.
    boardFromString(boardString) {
        this.generateBoard(Math.sqrt(boardString.length));
        this.game.board.forEach((cell, idx) => {
            cell.owner = this.longOwner(boardString[idx]);
        });
    }

    // Translators between B - black etc.
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

    // Add options to the game start wizard for different game parameters
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