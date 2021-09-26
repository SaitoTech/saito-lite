const GameBoardSizerTemplate = require('./game-board-sizer.template');

module.exports = GameBoardSizer = {

  render(app, game_mod, attachTo = "body") {
    if (!document.getElementById('game_board_sizer')) {
      var object = document.querySelector(attachTo);
      object.append(app.browser.htmlToElement(GameBoardSizerTemplate()));
    }

  },

  attachEvents(app, game_mod, target = ".gameboard") {

    var sizer_self = this;

    var targetObject = document.querySelector(target);
    document.querySelector('#game_board_sizer').addEventListener('change', () => { this.scaleBoard(game_mod, targetObject) });
    
    // adjust scale
    if (game_mod.loadGamePreference((game_mod.returnSlug()+"-board-scale"))) {
      try {
        document.querySelector('#game_board_sizer').value = game_mod.loadGamePreference(game_mod.returnSlug()+"-board-scale");
        this.scaleBoard(game_mod, targetObject);
      } catch (err) {
      }
    }

    // and adjust positioning
    let boardoffset = game_mod.loadGamePreference((game_mod.returnSlug()+"-board-offset"));
    if (boardoffset) {
      $(target).offset(boardoffset);
    }

    // and make draggable
    $(target).draggable({
      stop : function(event, ui) {
        game_mod.saveGamePreference((game_mod.returnSlug()+"-board-offset"), ui.offset);
      }
    });

  },

  scaleBoard(game_mod, targetObject) {

    // disable hammer if it exists
    try {
      game_mod.hammertime.get('pinch').set({ enable: false });
      game_mod.hammertime.get('pan').set({ enable: false });
    } catch (err) {
    }

    // try loading offset top / left
    //if (game_mod.loadGamePreference((game_mod.returnSlug()+"-board-scale"))) {
/***
let boardoffset = game_mod.loadGamePreference(game_mod.returnSlug()+"-board-offset");
if (boardoffset) {
  console.log("T:" +boardoffset.top);
  console.log("L:" +boardoffset.left);
}
  console.log("T2: " + $("#gameboard").css('top'));
  console.log("L2: " + $("#gameboard").css('left'));
$("#gameboard").css('top', boardoffset.top);
$("#gameboard").css('left', boardoffset.left);
*/

    targetObject.style.transform = `scale(${(document.querySelector('#game_board_sizer').value / 100)})`;
    game_mod.saveGamePreference(game_mod.returnSlug()+"-board-scale", document.querySelector('#game_board_sizer').value);



    // re-enable hammer
    try {
      game_mod.hammertime.get('pinch').set({ enable: true });
      game_mod.hammertime.get('pan').set({ enable: true });
    } catch (err) {
    }
  },

}

