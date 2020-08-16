const GameBoardSizerTemplate = require('./game-board-sizer.template');
const elParser = require('../../../helpers/el_parser');

module.exports = GameBoardSizer = {

  render(app, game_mod, attachTo ="body") {
    if(!document.getElementById('game_board_sizer')) {
      var object = document.querySelector(attachTo);
      object.append(elParser(GameBoardSizerTemplate()));
    }

  },

  attachEvents(app, game_mod, target = ".gameboard") {

    var targetObject = document.querySelector(target);
    document.querySelector('#game_board_sizer').addEventListener('change', function() {

      // disable hammer if it exists
      try { 
	game_mod.hammertime.get('pinch').set({ enable: false });
	game_mod.hammertime.get('pan').set({ enable: false });
      } catch (err) {
      }

      targetObject.style.transform = `scale(${(document.querySelector('#game_board_sizer').value/100)})`;


      // re-enable hammer
      try {
	game_mod.hammertime.get('pinch').set({ enable: true });
	game_mod.hammertime.get('pan').set({ enable: true });
      } catch (err) {
      }

    });
  }

}
