module.exports = ArcadeCreateGameOverlayTemplate = (app, gameCreator) => {
  let playerNumberOptionsHtml = "";
  for (let p = gameCreator.minPlayers; p <= gameCreator.maxPlayers; p++) {
    playerNumberOptionsHtml += `<option value="${p}">${p} player</option>`;
  }
  let tab1Content = `<div class="game-wizard-content">
      <div class="game-wizard-form">
        <div class="game-wizard-main">
          <div class="game-info-container">
            <img class="game-image game-image-wizard" src="/${gameCreator.slug}/img/arcade.jpg">
            <div class="game-detail-text">
              <h2 class="game-title">${gameCreator.modname}</h2>
              <div class="game-description">${gameCreator.description}</div>
            </div>
          </div>
          <div class="game-details">
            <h3>${gameCreator.modname}: </h3>
            ${gameCreator.returnGameOptionsHTML()}
          </div>
          <div class="game-start-controls">
            <div id="game-players-select-container">
              <select class="game-players-select" name="game-players-select">${playerNumberOptionsHtml}</select>
            </div>
            <button id="game-invite-btn" class="game-invite-btn">Go</button>
          </div>
          <div id="game-publisher-message" class="game-publisher-message">${gameCreator.publisher_message}</div>
        </div>
      </div>
    </div>`;
  return tab1Content;
}
