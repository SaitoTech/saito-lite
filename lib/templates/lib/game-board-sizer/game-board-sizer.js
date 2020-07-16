const GameBoardSizerTemplate = require('./game-board-sizer.template');
const elParser = require('../../../helpers/el_parser');

module.exports = GameBoardSizer = {

  render(app, data, attachTo ="body") {
    if(!document.getElementById('game_board_sizer')) {
      var object = document.querySelector(attachTo);
      object.append(elParser(GameBoardSizerTemplate()));
    }

  },

  attachEvents(app, data, target = ".gameboard") {

    var targetObject = document.querySelector(target);
    document.querySelector('#game_board_sizer').addEventListener('change', function() {

      // disable hammer if it exists
      try { 
	//data.game.hammertime.get('tap').set({ enable: false });
	data.game.hammertime.get('pinch').set({ enable: false });
	data.game.hammertime.get('pan').set({ enable: false });
alert("HAMMERTIME DISABLED");
      } catch (err) {
alert("ERR: " + err);
      }

alert("sizer resize");
      targetObject.style.transform = `scale(${(document.querySelector('#game_board_sizer').value/100)})`;


      // re-enable hammer
      try {
	data.game.hammertime.get('pinch').set({ enable: true });
	data.game.hammertime.get('pan').set({ enable: true });
alert("HAMMERTIME ENABLED");
      } catch (err) {
alert("ERROR re-enabling hammertime");
      }

    });
  }

}
