module.exports = ArcadeGameViewTemplate = (app, mod, invite) => {
  let optionsHtml = "";
  Object.keys(invite.msg.options).forEach((key, i) => {
    optionsHtml += `<div>${key}:</div><div>${invite.msg.options[key]}</div>`
  });
  return `
  <div class="view-game-overlay create-game-wizard" style="width: 100em; font-size: 15px;">
    <div class="return-to-arcade" id="return-to-arcade">
      <i class="icon-large fas fa-times-circle"></i>
    </div>
    <div class="game-wizard-content">
      <div class="game-wizard-form">
        <div class="game-wizard-main">
          <div class="game-info-container">
            <img class="game-image game-image-wizard" src="/imperium/img/arcade.jpg"/>
            <div class="game-detail-text">
              <h2 class="game-title">Imperium</h2>
              <div class="game-description">Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of the galaxy in the waning days of a dying Empire.</div>
            </div>
          </div>
          <div class="game-details">
            <h3>Imperium: </h3>
            ${optionsHtml}
          </div>
          <div class="game-start-controls">
            <button id="game-invite-btn" class="game-invite-btn">Join</button>
          </div>
          <div id="game-publisher-message" class="game-publisher-message"></div>
        </div>
      </div>
    </div>
  </div>
`;
}