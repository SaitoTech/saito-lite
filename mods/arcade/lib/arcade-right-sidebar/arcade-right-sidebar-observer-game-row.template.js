module.exports = ObserverGameTemplate = (msg, msgjson) => {
  return `
    <div class="arcade-observer-game-row">
      <div class="arcade-observer-game-id" id="${msgjson}">GAME ID: ${msg.game_id.substring(0,8)}</div>
      <button>WATCH</button
    </div>
  `;
}
