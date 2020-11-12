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
            <div id="game-players-select-container">
              <div class="saito-select">
                <select class="game-players-select saito-slct" name="game-players-select">
                  <option value="2">2 player</option><option value="3">3 player</option><option value="4">4 player</option>
                </select>
              </div>
            </div>

            <button id="game-invite-btn" class="game-invite-btn">Go</button>
          </div>
          <div id="game-publisher-message" class="game-publisher-message"></div>
        </div>
        <div id="game-invite-controls" class="game-invite-controls hidden">
          <div id="public-invite">
            <button id="game-create-btn" class="game-create-btn">Public Invitation</button>
            <div>Anyone can take your invitation.</div>
          </div>
          <div id="friend-invite">
            <button id="friend-invite-btn" class="friend-invite-btn">Invite Friends</button>
            <input type="text" id="game-invitees" class="game-invitees" placeholder="Enter names or addresses, comma separated">
          </div>
          <div id="link-invite">
            <button id="link-invite-btn" class="link-invite-btn">Share a link</button>
            <textarea id="link-invite-input" style="display:none"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>


`;
}

/*



<option value="1" id="game-players-select-1p">1 player</option>
                <option value="2" id="game-players-select-2p" selected>2 players</option>
                <option value="3" id="game-players-select-3p">3 players</option>
                <option value="4" id="game-players-select-4p">4 players</option>
                <option value="5" id="game-players-select-5p">5 players</option>
                <option value="6" id="game-players-select-6p">6 players</option>
                */
