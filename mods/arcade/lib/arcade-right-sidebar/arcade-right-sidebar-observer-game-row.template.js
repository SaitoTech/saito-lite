module.exports = ArcadeRightSidebarTemplate = (msg, msgjson) => {
  return `
    <div class="arcade-observer-game-row">
      <div class="arcade-observer-game-id" id="${msgjson}">${msg.game_id}</div>
    </div>
  `;
}
