module.exports = ObserverGameTemplate = (msg, msgjson) => {
  return `
    <div class="arcade-observer-game-row">
      <div class="arcade-observer-game-id" id="${msgjson}">
        ID: ${msg.game_id.substring(0,8)}
      </div>
      <button style="width: 100%">WATCH</button
    </div>
  `;
}
