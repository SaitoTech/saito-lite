module.exports = GamePlayerBoxTemplate = (player_num) => {
  return `
    <div class="player-box" id="player-box-${player_num}">
      <div class="player-box-graphic" id="player-box-graphic-${player_num}"></div> 
      <div class="player-box-head" id="player-box-head-${player_num}"></div>
      <div class="player-box-info" id="player-box-info-${player_num}"></div>
      <div class="plog" id="player-box-log-${player_num}"></div>
      </div>
    </div>
  `;
}

