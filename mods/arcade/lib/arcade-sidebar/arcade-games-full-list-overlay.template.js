module.exports = ArcadeGamesFullListOverlayTemplate = (app, mod) => {

  let html = `
    <div id="installed-games" class="installed-games">';
       <h1>Installed Games</h1>
       <div class="return-to-arcade" id="return-to-arcade"><i class="icon-large fas fa-times-circle"></i></div>
       <div class="start-game-list">
  `;

  app.modules.respondTo("arcade-games").forEach(game_mod => {

    let gamemod_url = "/" + game_mod.slug + "/img/arcade.jpg";
    let players = "Players: ";
    let minPlayers = game_mod.minPlayers;
    let maxPlayers = game_mod.maxPlayers;

    if (minPlayers == maxPlayers) {
      players += minPlayers;
    } else {
      players += minPlayers + "-" + maxPlayers;
    }

    html += `<div class="arcade-game-list-item" data-game="${game_mod.name}">
         <div class="arcade-game-list-image" style="background-image: url(${gamemod_url});"></div>
         <div class="arcade-gema-list-details">
           <div class="arcade-game-list-title"><h4>${game_mod.name}</h4></div>
           <div class="arcade-game-list-type">${game_mod.type}</h4></div>
           <div class="arcade-game-list-players">${players}</h4></div>
         </div>
       </div>`;
  });

  gamemod_url = '/saito/img/dreamscape.png';
  html += `<div class="arcade-game-list-item" data-game="Install New Game">
        <div class="arcade-game-list-image" style="background-image: url(${gamemod_url});"></div>
        <div class="arcade-gema-list-details">
          <div class="arcade-game-list-title"><h4>Install New Game</h4></div>
          <div class="arcade-game-list-type">Saito Appstore</h4></div>
          <div class="arcade-game-list-players">1 - 6</h4></div>
        </div>
        </div>`;

  html += `
       </div>
     </div>
  `;

  return html;

}

