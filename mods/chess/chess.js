const GameTemplate = require('../../lib/templates/gametemplate');

var this_chess = null;
var chess = null;
var chessboard = null;

class Chessgame extends GameTemplate {

  constructor(app) {

    super(app);

    this.publickey = app.wallet.returnPublicKey();

    this.name = "Chess";
    this.description = "Chess is a two-player strategy board game played on a checkered board with 64 squares arranged in an 8×8 grid."

    this.board = null;
    this.engine = null;
    this_chess = this;

    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.type       = "Classic Boardgame";
    this.description = "An implimentation of Chess for the Saito Blockchain";
    this.categories  = "Boardgame Game";

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
      obj.background = "/chess/img/arcade/arcade-banner-background.png";
      obj.title = "Chess";
      return obj;
    }

    return null;

  }

  initialize(app) {
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(this_chess.app, this_chess);
    });
    super.initialize(app);
  }

  async initializeGame(game_id) {

    console.log('######################################################');
    console.log('######################################################');
    console.log('######################         #######################');
    console.log('######################  CHESS  #######################');
    console.log('######################         #######################');
    console.log('######################################################');
    console.log('######################################################');

    if (this.browser_active == 1) {

      // enable chat
      //if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
      //  const chat = this.app.modules.returnModule("Chat");
      //  chat.addPopUpChat();
      //}

      chess = require('./lib/chess.js');
      chessboard = require('./lib/chessboard');

      this.board = new chessboard('board', { pieceTheme: 'img/pieces/{piece}.png' });
      this.engine = new chess.Chess();
    }

    //
    // load this.game object
    //
    this.loadGame(game_id);

    //
    // finish initializing
    //
    if (this.game.initializing == 1) {
      this.game.queue.push("READY");
    }


    if (this.browser_active == 1) {
      if (this.game.position != undefined) {
        this.engine.load(this.game.position);
      } else {
        this.game.position = this.engine.fen();
      }

      if (this.game.target == this.game.player) {
        this.setBoard(this.engine.fen());
      } else {
        this.lockBoard(this.engine.fen());
      }

      var opponent = this.game.opponents[0];

      if (this.app.crypto.isPublicKey(opponent)) {
        if (this.app.keys.returnIdentifierByPublicKey(opponent).length >= 6) {
          opponent = this.app.keys.returnIdentifierByPublicKey(opponent);
        }
        else {
          try {
            opponent = await this.app.keys.fetchIdentifierPromise(opponent);
          }
          catch (err) {
            console.log(err);
          }
        }
      }

      let opponent_elem = document.getElementById('opponent_id');
      if (opponent_elem) opponent_elem.innerHTML = opponent;

      this.updateStatusMessage();
      this.attachEvents();

    }

  }

  ////////////////
  // handleGame //
  ////////////////
  handleGameLoop(msg={}) {

    msg = {};
console.log("QUEUE: " + this.game.queue);
    if (this.game.queue.length > 0) {
      msg.extra = JSON.parse(this.app.crypto.base64ToString(this.game.queue[this.game.queue.length-1]));
    } else {
      msg.extra = {};
    }
    this.game.queue.splice(this.game.queue.length-1, 1);

    if (msg.extra == undefined) {
      console.log("NO MESSAGE DEFINED!");
      return;
    }
    if (msg.extra.data == undefined) {
      console.log("NO MESSAGE RECEIVED!");
      return;
    }

    //
    // the message we get from the other player
    // tells us the new board state, so we
    // update our own information and save the
    // game
    //
    let data = JSON.parse(msg.extra.data);
    this.game.position = data.position;
    this.game.target = msg.extra.target;

    if (msg.extra.target == this.game.player) {
      if (this.browser_active == 1) {
        this.setBoard(this.game.position);
        this.updateLog(data.move, 999);
        this.updateStatusMessage();
      }
    } else {
      if (this.browser_active == 1) {
        this.lockBoard(this.game.position);
      }
    }

    this.saveGame(this.game.id);

    return 0;

  }

  endTurn(data) {

    let extra = {};

    extra.target = this.returnNextPlayer(this.game.player);
    extra.data = JSON.stringify(data);

    let data_to_send = this.app.crypto.stringToBase64(JSON.stringify(extra));
    this.game.turn = [data_to_send];
    this.moves = [];
    this.sendMessage("game", extra);
    this.updateLog(data.move, 999);
    this.updateStatusMessage();
  }

  attachEvents() {

    let move_accept = document.getElementById('move_accept');
    let move_reject = document.getElementById('move_reject');
    if (!move_accept) return;

    move_accept.onclick = () => {
      console.log('send move transaction and wait for reply.');

      var data = {};
      data.white = this.game.white;
      data.black = this.game.black;
      data.id = this.game.id;
      data.position = this.engine.fen();
      data.move = this.game.move;
      this.endTurn(data);

      move_accept.disabled = true;
      move_accept.classList.remove('green');

      move_reject.disabled = true;
      move_reject.classList.remove('red');
    };

    move_reject.onclick = () => {
      this.setBoard(this.game.position);

      move_accept.disabled = true;
      move_accept.classList.remove('green');

      move_reject.disabled = true;
      move_reject.classList.remove('red');
    }

    window.onresize = () => this.board.resize();

    this.app.modules.respondTo('chat-manager').forEach(mod => {
      mod.respondTo('chat-manager').attachEvents(this_chess.app, this_chess);
    })
  }

  updateStatusMessage(str = "") {

    if (this.browser_active != 1) { return; }

    let statusEl = document.getElementById('status');

    //
    // print message if provided
    //
    if (str != "") {
      statusEl.innerHTML = str;
      return;
    }

    var status = '';
;
    var moveColor = 'White';
    if (this.engine.turn() === 'b') {
      moveColor = 'Black';
    }

    // checkmate?
    if (this.engine.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (this.engine.in_draw() === true) {
      status = 'Game over, drawn position';
    }

    // game still on
    else {

      status = moveColor + ' to move';

      // check?
      if (this.engine.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
      }

    }

    statusEl.innerHTML = status;
    console.log(this.game.position);
    console.log(this.engine.fen());
    console.log(this.returnCaptured(this.engine.fen()));
    console.log(this.returnCapturedHTML(this.returnCaptured(this.engine.fen())));
    document.getElementById('captured').innerHTML = this.returnCapturedHTML(this.returnCaptured(this.engine.fen()));
    this.updateLog();

  };

  setBoard(position) {

    this.game.moveStartPosition = position;

    if (this.board != undefined) {
      if (this.board.destroy != undefined) {
        this.board.destroy();
      }
    }

    let cfg = {
      draggable: true,
      position: position,
      // pieceTheme: 'chess/pieces/{piece}.png',
      pieceTheme: 'img/pieces/{piece}.png',
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onMouseoutSquare: this.onMouseoutSquare,
      onMouseoverSquare: this.onMouseoverSquare,
      onSnapEnd: this.onSnapEnd,
      onMoveEnd: this.onMoveEnd,
      onChange: this.onChange
    };

    if (this.browser_active == 1) {
      this.board = new chessboard('board', cfg);
    }
    this.engine.load(position);

    if (this.game.player == 2 && this.browser_active == 1) {
      this.board.orientation('black');
    }

  }

  lockBoard(position) {

    if (this.board != undefined) {
      if (this.board.destroy != undefined) {
        this.board.destroy();
      }
    }

    let cfg = {
      pieceTheme: 'img/pieces/{piece}.png',
      moveSpeed: 0,
      position: position
    }

    this.board = new chessboard('board', cfg);
    this.engine.load(position);

    if (this.game.player == 2) {
      this.board.orientation('black');
    }

  }

  //////////////////
  // Board Config //
  //////////////////
  onDragStart(source, piece, position, orientation) {

    if (this_chess.engine.game_over() === true ||
      (this_chess.engine.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (this_chess.engine.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  onDrop(source, target, piece, newPos, oldPos, orientation, topromote) {

    this_chess.removeGreySquares();

    this_chess.game.move = this_chess.engine.fen().split(" ").slice(-1)[0] + " " + this_chess.colours(this_chess.engine.fen().split(" ")[1]) + ": ";

    //was a pawn moved to the last rank
    if ((source.charAt(1) == 7 && target.charAt(1) == 8 && piece == 'wP')
        || (source.charAt(1) == 2 && target.charAt(1) == 1 && piece == 'bP')) {
      // check with user on desired piece to promote.
      this_chess.checkPromotion(source, target, piece.charAt(0));
    } else {
      // see if the move is legal
      var move = this_chess.engine.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      // illegal move
      if (move === null) return 'snapback';
      // legal move - make it

      this_chess.game.move += this_chess.pieces(move.piece) + " ";

      this_chess.game.move += " - " + move.san;
    }
  }

  promoteAfterDrop(source, target, piece) {
    var move = this_chess.engine.move({
      from: source,
      to: target,
      promotion: piece
    });

    document.getElementById('promotion').style.display = "none";
    document.getElementById('buttons').style.display = "grid";

    this_chess.updateStatusMessage("Confirm Move to Send!");

    // legal move - make it
    this_chess.game.move += `${this_chess.pieces(move.piece)} - ${move.san}`;
    this_chess.updateStatusMessage('Pawn promoted to ' + this_chess.pieces(piece) + '.');

  };

  checkPromotion(source, target, color) {
    let promotion = document.getElementById('promotion');
    let promotion_choices = document.getElementById('promotion-choices');
    let buttons = document.getElementById('buttons');
    buttons.style.display = "none";

    let html = ['q', 'r', 'b', 'n'].map(n => this.piecehtml(n, color)).join('');
    promotion_choices.innerHTML = html;
    promotion_choices.childNodes.forEach(node => {
      node.onclick = () => {
        promotion.style.display = "none";
        buttons.style.display = "grid";
        this_chess.promoteAfterDrop(source, target, node.alt);
      }
    });
    this.updateStatusMessage('Chose promotion piece');
    promotion.style.display = "block";
  }

  onMouseoverSquare(square, piece) {

    // get list of possible moves for this square
    var moves = this_chess.engine.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) { return; }

    // highlight the square they moused over
    this_chess.greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      this_chess.greySquare(moves[i].to);
    }
  };

  onMouseoutSquare(square, piece) {
    this_chess.removeGreySquares();
  };

  onSnapEnd() {
    this_chess.board.position(this_chess.engine.fen());
  };

  removeGreySquares() {
    let grey_squares = document.querySelectorAll('#board .square-55d63');
    Array.from(grey_squares).forEach(square => square.style.background = '');
  };

  greySquare(square) {

    var squareEl = document.querySelector(`#board .square-${square}`);

    var background = '#a9a9a9';
    if (squareEl.classList.contains('black-3c85d') === true) {
      background = '#696969';
    }

    squareEl.style.background = background;

  };

  onChange(oldPos, newPos) {

    this_chess.lockBoard(this_chess.engine.fen(newPos));
    let move_accept = document.getElementById('move_accept');
    let move_reject = document.getElementById('move_reject');

    move_accept.disabled = false;
    move_accept.classList.add('green');

    move_reject.disabled = false;
    move_reject.classList.add('red');

  };

  colours(x) {

    switch (x) {
      case "w": return ("White");
      case "b": return ("Black");
    }

    return;

  }

  pieces(x) {

    switch (x) {
      case "p": return ("Pawn");
      case "r": return ("Rook");
      case "n": return ("Knight");
      case "b": return ("Bishop");
      case "q": return ("Queen");
      case "k": return ("King");
    }

    return;

  }

  returnCaptured(afen) {
    afen = afen.split(" ")[0];
    let WH = ["Q", "R", "R", "B", "B", "N", "N", "P", "P", "P", "P", "P", "P", "P", "P"];
    let BL = ["q", "r", "r", "b", "b", "n", "n", "p", "p", "p", "p", "p", "p", "p", "p"];
    for (var i = 0; i < afen.length; i++) {
      if (WH.indexOf(afen[i]) >= 0) {
        WH.splice(WH.indexOf(afen[i]), 1);
      }
      if (BL.indexOf(afen[i]) >= 0) {
        BL.splice(BL.indexOf(afen[i]), 1);
      }
    }
    return [WH, BL];
  }

  returnCapturedHTML(acapt) {
    let captHTML = "";
    for (var i = 0; i < acapt[0].length; i++) {
      captHTML += this.piecehtml(acapt[0][i], "w");
    }
    captHTML += "<br />";
    for (var i = 0; i < acapt[1].length; i++) {
      captHTML += this.piecehtml(acapt[1][i], "b");
    }
    return captHTML;
  }

  piecehtml(p, c) {
    return `<img class="captured" alt="${p}" src = "img/pieces/${c}${p.toUpperCase()}.png">`;
  }

  returnGameOptionsHTML() {
    return `
      <h3>Chess: </h3>
      <form id="options" class="options">
        <label for="color">Pick Your Color:</label>
        <select name="color">
          <option value="black" default>Black</option>
          <option value="white">White</option>
        </select>
      </form>
    `;
  }
}

module.exports = Chessgame;

