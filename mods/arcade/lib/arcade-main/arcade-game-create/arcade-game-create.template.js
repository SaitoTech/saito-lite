module.exports = ArcadeGameCreate = (game) => {
  return `
    <div class="create-game-wizard">
      <div class="return_to_arcade" id="return_to_arcade">
        <i style="margin-right: 0.5em" class="icon-med fa fa-arrow-left"></i> Return to Arcade
      </div>

      <div class=-"game-info-container">
        <img class="game-image game-image-wizard" src="">
        <div class="game-description"></div>
      </div>

      <div class="game-details"></div>

      <div id="game-players-select-container">
	<select class="game-players-select" name="game-players-select">
	  <option value="2" selected>2 players</option>
	  <option value="3">3 players</option>
	  <option value="4" id="game-players-select-4p">4 players</option>
	  <option value="5" id="game-players-select-5p">5 players</option>
	  <option value="6" id="game-players-select-6p">6 players</option>
	</select>
      </div>

      <button id="game-create-btn" class="game-create-btn">find opponent</button>
      <div id="game-publisher-message" class="game-publisher-message"></div>
    </div>
  `;
}
