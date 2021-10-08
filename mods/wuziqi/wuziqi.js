const { timingSafeEqual } = require('crypto');
const saito = require('../../lib/saito/saito');
const dragElement = require('../../lib/helpers/drag_element');
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

        //Define black and white so can use in menus        
        this.game.sides = ["black", "white"];


        // Add the Saito Chat Manager for in-game Chat
        this.app.modules.respondTo("chat-manager").forEach(mod => {
            mod.respondTo('chat-manager').render(this.app, this);
        });

        // Add Menu Items to standard Menu
        /*this.menu.addMenuOption({
            text: "Player: " + this.formatPlayer(),
            id: "playerno",
            class: "playerno",
            callback: function (app, game_mod) {

            }
        });*/
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
                        let name = this.game.sides[ii].toUpperCase();//"Player " + (ii + 1);
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
        // Add icon to switch to full screen mode
        this.menu.addMenuIcon({
            text: '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
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
                // If you are black, you are up.
                if (this.game.player == 1) {
                    this.addEvents(this.game.board);
                    this.updateStatus("Your move, "+this.formatPlayer());
                } else {
                    this.updateStatus("Waiting on <span class='playertitle'>Black</span>");
                }
                this.updateScore();

            }

        } catch (err) {
            console.log(err);
        }


    }

    /*
    Utility to make some of the status updates easier, figures out which color this player is using
    and formats it to capitalize the first letter
    */
    formatPlayer(){
        let myColor = this.game.sides[this.game.player-1];
        return myColor.charAt(0).toUpperCase() + myColor.slice(1);
    }

    //html for game intro/rules
    returnRulesOverlay() {

        let overlay_html = `<div class="intro">
          <h2>Wuziqi （五子棋）</h2>
           <p> Wuziqi, also known as Gokomu and Gobang, is a simple two player game played on a Go board. It is similar to <abbr title="also known as Naughts and Crosses">Tic-Tac-Toe</abbr> or Connect Four in that players alternately place tokens in an attempt to create a line of five consecutive tokens of their color. Tokens may be placed anywhere on the board not already occupied.</p>
           <p> The first player to place five of their own tokens in a continuous line--vertical, horizontal or diagonally--wins the round. The player who wins the most rounds, wins the match.</p><p> Matches are best out of three by default, but you can change this in the advanced options in the arcade. You may also specify the size of the board for added challenge.</p>
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
            // Add the id
            cell.id = n;
            // The cell is blank.
            cell.owner = "none";
            // The cell does not have a winning tile in it.
            cell.winner = false;

            /* Sets are the rows, columns and diagonals to which the cell belongs.
               Each row, col, and diag has a unique index, so that adjacent sells share
               a value in one of the four set categories
            */
            cell.sets = {};
            // Set the row as the total divided by the side length rounded up.
            cell.sets.row = Math.ceil(n / x);
            // Set the collumn as the cell id mod side length.
            cell.sets.col = ((n - 1) % x) + 1;
            // Set the left down diagonal as where inverse of the column summed with row is constant 
            cell.sets.lddiag = (x - cell.sets.col) + cell.sets.row;
            // Set the right and up diagonal to where the sum of the row and collumn
            cell.sets.rudiag = cell.sets.row + cell.sets.col - 1;
            this.game.board.push(cell);
        }
        //console.log(this.game.board);
    }

    // UI Score Update
    /* Though unnecessary to loop through two players, it is important to remember that players are numbered (1, 2, 3), 
        but data structures for player properties are typically 0-indexed arrays
    */
    updateScore() {
           /*
            Make player box
        */
        let boxobj;
        let status = document.querySelector(".status").innerHTML;
        for (let i = 0; i<this.game.players.length; i++){
            let name = this.app.keys.returnIdentifierByPublicKey(this.game.players[i], 1)
            let identicon = this.app.keys.returnIdenticon(name);
            if (name.indexOf("@") > 0) {
                name = name.substring(0, name.indexOf("@"));
            }
            if (name === this.game.players[i]) {
               name = this.game.players[i].substring(0, 10) + "...";
            }    
            console.log(i,this.game.player);
            boxobj = (this.game.player == (i+1)) ? document.querySelector(".player-box.me") : document.querySelector(".player-box.notme");
            let info = boxobj.querySelector(".info");
            let score = boxobj.querySelector(".plog");
            let scoreHTML = `<div>Score: </div>`;
            info.innerHTML = `<img class="identicon" src="${identicon}">
                                <div class="player-name">${name}</div>
                                `;
            
            
            for (let j = 0; j < this.game.score[i]; j++) {
                scoreHTML += `<img class="piece" src="img/${this.game.sides[i]}piece.png">`;
            }
            for (let j = 0; j < (this.game.options.best_of - this.game.score[i]); j++) {
                scoreHTML += `<img class="piece opaque30" src="img/${this.game.sides[i]}piece.png">`;
            }
            score.innerHTML = scoreHTML; //${this.game.score[i]} (out of ${this.game.options.best_of})`;
            try {
                dragElement(boxobj);
            } catch (err) {
                console.log("Drag error",err);
            }
        }


      //  for (let i = 0; i < 2 /*this.game.players.length==2*/; i++){
      //      document.querySelector(`.score${i+1}`).innerHTML = `${((i+1)==this.game.player)? "*" : ""}${this.game.sides[i]}: ${this.game.score[i]}`;
      //  }
      //  document.querySelector(".best_of").innerHTML = "Best of " + this.game.options.best_of;
    }


    // Iterate through the board object to draw each cell in the DOM
    drawBoard(board) {
        boardElement = document.querySelector('.board');
        // Clear the board
        boardElement.innerHTML = "";
        // Add the CSS grid-template-columns value to the correct number of rows.
        //Because variable board size, easier than hardcoding size classes in CSS
        boardElement.style.gridTemplate = `repeat(${this.game.size}, 1fr) / repeat(${this.game.size}, 1fr)`; //'repeat(' + this.game.size + ', 1fr)';
        
        // Draw the cells
        let ct = 1; 
        board.forEach(cell => {
            let tile = document.createElement('div');
            tile.id = cell.id;
            if (cell.winner) tile.classList.add("winner");
            if (ct <= this.game.size) tile.classList.add("top");
            if (ct > this.game.size*(this.game.size-1)) tile.classList.add("bottom");
            if (ct % this.game.size == 1) tile.classList.add("left");
            if (ct % this.game.size == 0) tile.classList.add("right");
            if (cell.owner != "none") {
                let el = document.createElement('div');
                el.classList.add("piece");
                el.classList.add(cell.owner);
                tile.append(el);
            }else{
                let el = document.createElement("div");
                el.classList.add("empty");
                tile.append(el);
            }
            boardElement.append(tile);
            ct++;
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
                        // Update my scores
                        this.game.score[this.game.player - 1] = parseInt(this.game.score[this.game.player - 1]) + 1;
                        this.updateScore();

                        // If this round win, wins the game - let the winner know.
                        if (this.game.score[this.game.player - 1] > this.game.options.best_of / 2) {
                            this.game.winner = this.game.player;
                            this.updateScore();
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
                    let mv = "place\t" + this.serializeBoard(board) + "\t" + cell.id + "\t" + this.game.player + "\t" + this.game.score[0] + "|" + this.game.score[1];
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
                // Remove this item from the queue.
                this.game.queue.splice(this.game.queue.length - 1, 1);

                //Winner sent the move
                if (mv[1]!=this.game.player) salert("You lose.");
                //Not duplicated in board events, so both players run these
                this.updateScore();
                this.updateStatus("<span class='playertitle'>" + this.game.sides[mv[1] - 1] + "</span> wins!")
                this.drawBoard(this.game.board);
                //this.resignGame(); //<- throws a 567567 error                
                return 0; //end queue cycling
            }
            // Round over
            if (mv[0] == "roundover") {
                this.drawBoard(this.game.board);
                this.updateScore();
              
                // Initiate next round.
                // Add a continue button if player did not play the winning token, just draw the board (and remove events if they did not);
                if (mv[1] != this.game.player) {
                    this.updateStatus(`<span class='playertitle'>${this.game.sides[mv[1] - 1]}</span> wins the round.`);
                    this.addContinueButton();
                } else {
                    this.updateStatus(`You win the round! Waiting for <span class="playertitle">${this.game.sides[mv[1]%2]}</span> to start next round.`);
                    this.drawBoard(this.game.board);
                }
                // Remove this item from the queue.
                this.game.queue.splice(this.game.queue.length - 1, 1);
                return 1;
            }
            if (mv[0] == "place") {
                // Set the game scores
                this.game.score[0] = mv[4].split("|")[0];
                this.game.score[1] = mv[4].split("|")[1];
                this.updateScore();

                // If the player is next, add events, if not let them know they are waiting.
                if (this.game.player != mv[3]) {
                
                    // Regenerate the game board object from the serialized version sent by the other player.
                    this.boardFromString(mv[1]);
                    // Grab the played cell
                    let cell = this.returnCellById(parseInt(mv[2]));
                    // And check if it won the game
                    let winner = this.findWinner(cell);
                    // Redraw the board (adding winning cells if any)
                    this.drawBoard(this.game.board);
                
                    //Let player make their move
                    this.addEvents(this.game.board);
                    this.updateStatus("Your move");
                } else {
                    //We don't need to run the above functions because this player already ran them through the board events
                    this.updateStatus("Waiting on <span class='playertitle'>" + this.game.sides[(mv[3]) % 2] + "</span>");
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
            this.updateStatus("You go first");
        });
        document.querySelector(".status").append(el);
    }

    // Check if a player won the round
    findWinner(cell) {
        let win;
        let winner = "no winner";
        // Iterate through the row, column and diagonals for the played cell
        for (const [key, value] of Object.entries(cell.sets)) {
            // Test each to check if there are five cells in a row with the same colour tile.
            let testset = this.returnCellsInLine(key, value);
            win = 0; //reset to 0 when switch directions, just in case there is a possibility that we accidentally count a bent line
            // Only check if there are at least 5 cells in the line (diagonals can be short)
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

    // Modify property winner of cells in the winning set so that CSS can be updated
    showWin(key, value, cell) {
        let set = this.returnCellsInLine(key, value);
        this.markWinners(set, cell);
        //must run through both ways to mark the whole winning set 
        set.reverse();
        this.markWinners(set, cell);
    }
    
    /*Skim through the line and start marking winning cells when we reach the given cell
    and as long as the following cells have the same owner */
    markWinners(set, cell) {
        let draw = false;
        set.forEach(el => {
            if (el.id == cell.id) {
                draw = true;
            }
            if (draw) {
                if (el.owner == cell.owner) {
                    el.winner = true;
                } else {
                    draw = false;
                }
            }
        });
    }

    /* Return cells that belong to a particular axis (horizontal, vertical, or diagonal)
        type = {row, col, lddiag, rudiag}
    */
    returnCellsInLine(type, value) {
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

    /*
    The following four function compress/decompress the board state into a string so that
    players can transmit it with their move, a completely unnecessary action, since each player places a single 
    tile at a time, it is enough to infer the new boardstate from the player's number and the cell id.
    */

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
        <label for="board_size">Board Size:</label>
        <select name="board_size">
        <option value="9">9</>
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