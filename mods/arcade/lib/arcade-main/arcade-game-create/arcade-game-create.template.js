module.exports = ArcadeGameCreate = (game) => {
  return `

    <div class="create-game-wizard">

      <img class="game-image" src="" />

      <div class="game-description"></div>

      <div class="game-details"></div>

      <button id="game-create-btn" class="game-create-btn">find opponent</button>

      <div id="game-publisher-message" class="game-publisher-message"></div>

      <div class="return_to_arcade" id="return_to_arcade">
        <i class="fa fa-arrow-circle-left"></i> Return to Arcade
      </div>

    </div>

  `;
}
