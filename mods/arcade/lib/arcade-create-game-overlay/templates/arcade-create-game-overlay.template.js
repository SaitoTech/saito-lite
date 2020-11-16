module.exports = ArcadeCreateGameOverlayTemplate = (app, gameCreator) => {
  let playerNumberOptionsHtml = "";
  for (let p = gameCreator.minPlayers; p <= gameCreator.maxPlayers; p++) {
    playerNumberOptionsHtml += `<option value="${p}">${p} player</option>`;
  }
  
  return `
  <div id="background-shim" class="background-shim" style="background-image: url('/${gameCreator.slug}/img/arcade.jpg')">
    <div class="create-game-wizard">
      <div class="return-to-arcade" id="return-to-arcade">
          <i class="icon-large fas fa-times-circle"></i>
      </div>
      <div class="game-wizard-content">
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
                    <form id="options" class="options">${gameCreator.returnGameOptionsHTML()}</form>
                  </div>
                  <div class="game-start-controls">
                      <div id="game-players-select-container">
                          <select class="game-players-select" name="game-players-select">${playerNumberOptionsHtml}</select>
                      </div>
                      <button id="game-invite-btn" class="game-invite-btn">Go</button>
                  </div>
                  <div id="game-publisher-message" class="game-publisher-message">${gameCreator.publisher_message}</div>
              </div>
              <div id="game-invite-controls" class="game-invite-controls hidden">
                  <div id="public-invite">
                      <button id="game-create-btn" class="game-create-btn">Public Invitation</button>
                      <div>Anyone can take your invitation.</div>
                  </div>
                  <div id="friend-invite">
                  <button id="friend-invite-btn" class="friend-invite-btn">Invite Friends</button>
                  <input type="text" id="game-invitees" class="game-invitees" placeholder="Enter names or addresses, comma separated" />
                  </div>
                  <div id="link-invite">
                      <button id="link-invite-btn" class="link-invite-btn">Share a link</button>
                      <textarea id="link-invite-input" style="display:none"></textarea>
                  </div>
              </div>
          </div>
      </div>
    </div>

  </div>
  `;
}

// document.querySelector('.game-image').src = gamemod_url;
// document.querySelector('.background-shim').style.backgroundImage = 'url(' + gamemod_url + ')';
// document.querySelector('.game-title').innerHTML = gamemod.name;
// document.querySelector('.game-description').innerHTML = gamemod.description;
// document.querySelector('.game-publisher-message').innerHTML = gamemod.publisher_message;
// let x = gamemod.returnGameOptionsHTML();
// if (x != "") {
//   document.querySelector('.game-details').innerHTML = '<h3>' + gamemod.name + ': </h3><form id="options" class="options">' + x + '</form>'
// }
// 
// setTimeout(() => {
// 
//   //
//   // TODO: is this value supposed to be used?
//   //
//   // let current_sel = document.querySelector('.game-players-select').value;
// 
//   for (let p = gamemod.minPlayers; p <= gamemod.maxPlayers; p++) {
//     var option = document.createElement("option");
//     option.text = p + " player";
//     option.value = p;
//     document.querySelector('.game-players-select').add(option);
//   }
// 
// }, 100);
