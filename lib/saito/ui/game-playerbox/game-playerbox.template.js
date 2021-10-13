module.exports = GamePlayerBoxTemplate = (player_num) => {
  return `
    <div class="player-info p${player_num}" id="player-info-${player_num}">
      <div class="info" style="display: block;">
        <div class="player-info-hand hand tinyhand" id="player-info-hand-${player_num}">
        </div>
        <div class="player-info-name dealerbutton bigblind" id="player-info-name-${player_num}"></div>
        <div class="player-info-chips" id="player-info-chips-${player_num}"></div> 
      </div>
      <div class="plog status"></div>
      </div>
    </div>
  `;
}

