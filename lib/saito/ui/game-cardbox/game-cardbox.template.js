module.exports = GameCardboxTemplate = () => {
  return `
    <div id="game-cardbox" class="game-cardbox">
      <div class="cardbox-exit-background" id="cardbox-exit-background" style="display:none"><div class="cardbox-exit" id="cardbox-exit" style="display:none">×</div></div>
      <div class="cardbox-card cardfan" id="cardbox-card" style="display:none"></div>
      <div class="cardbox-menu" id="cardbox-menu" style="display:none">PLAY</div>
    </div>
  `;
}

