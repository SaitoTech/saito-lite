module.exports = ArcadeGameCreate = (game) => {
  return `
  <div class="create-game-wizard">
  <div class="return-to-arcade" id="return-to-arcade">
        <i class="icon-large fas fa-times-circle"></i>
      </div>
  <div class="game-wizard-form">
      <div class="game-info-container">
          <img class="game-image game-image-wizard" src="">
          <div class="game-detail-text">
            <h2 class="game-title"></h2>
            <div class="game-description"></div>  
          </div>
      </div>

      <div class="game-details"></div>
     <div class="game-start-controls">
      <div id="game-players-select-container">
          <select class="game-players-select" name="game-players-select">
              <option value="1" id="game-players-select-1p">1 player</option>
              <option value="2" id="game-players-select-2p" selected>2 players</option>
              <option value="3" id="game-players-select-3p">3 players</option>
              <option value="4" id="game-players-select-4p">4 players</option>
              <option value="5" id="game-players-select-5p">5 players</option>
              <option value="6" id="game-players-select-6p">6 players</option>
          </select>
      </div>

      <button id="game-create-btn" class="game-create-btn">GO</button>
      </div>
      <div id="game-publisher-message" class="game-publisher-message"></div>
  </div>
</div>
<div id="background-shim" class="background-shim">
  <div id="background-shim-cover" class="background-shim-cover"></div>
</div>
  `;
}
