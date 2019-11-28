module.exports = AlauniusControlsTemplate = () => {
  return `
      <button class="super" id="alaunius-compose-btn">NEW</button>
      <div class="alaunius-bars-menu">
      </div>
      <div id="alaunius-loader" class="alaunius-loader">
        <div class="blockchain_synclabel">syncing blocks...</div>
        <div class="blockchain_syncbox">
          <div class="blockchain_syncbar" style="width: 100%;"></div>
        </div>
      </div>
  `;
}
