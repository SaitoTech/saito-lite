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

      <button id="game-create-btn" class="game-create-btn">find opponent</button>
      <div id="game-publisher-message" class="game-publisher-message"></div>
    </div>
  `;
***REMOVED***
