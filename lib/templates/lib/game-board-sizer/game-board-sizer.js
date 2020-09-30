const GameBoardSizerTemplate = require('./game-board-sizer.template');
const elParser = require('../../../helpers/el_parser');

module.exports = GameBoardSizer = {

  render(app, game_mod, attachTo = "body") {
    if (!document.getElementById('game_board_sizer')) {
      var object = document.querySelector(attachTo);
      object.append(elParser(GameBoardSizerTemplate()));
    }

  },

  attachEvents(app, game_mod, target = ".gameboard") {

    var sizer_self = this;

    var targetObject = document.querySelector(target);
    document.querySelector('#game_board_sizer').addEventListener('change', () => { this.scaleBoard(targetObject) });
    
    // scale board to stored preference is exists.
    if (this.getPreference("game-board-scale")) {
      document.querySelector('#game_board_sizer').value = getPreference("game-board-scale");
      this.scaleBoard(targetObject);
    }
  },

  scaleBoard(targetObject) {

    // disable hammer if it exists
    try {
      game_mod.hammertime.get('pinch').set({ enable: false });
      game_mod.hammertime.get('pan').set({ enable: false });
    } catch (err) {
    }

    targetObject.style.transform = `scale(${(document.querySelector('#game_board_sizer').value / 100)})`;
    this.setPreference("game-board-scale", document.querySelector('#game_board_sizer').value);

    // re-enable hammer
    try {
      game_mod.hammertime.get('pinch').set({ enable: true });
      game_mod.hammertime.get('pan').set({ enable: true });
    } catch (err) {
    }
  },

  setPreference(key, value) {
    if (typeof window.localStorage.profile == 'undefined') {
      window.localStorage.profile = JSON.stringify({});
    }
    var profile = JSON.parse(localStorage.profile);

    profile[key] = value;

    localStorage.profile = JSON.stringify(profile);
  },

  getPreference(key) {
    if (typeof window.localStorage.profile != 'undefined') {
      var profile = JSON.parse(localStorage.profile);
      if (typeof profile[key] != 'undefined') {
        return profile[key];
      }
    }
    return;
  }

}

