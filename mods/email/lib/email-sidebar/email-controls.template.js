module.exports = EmailControlsTemplate = () => {
  return `
      <button class="super" id="email-compose-btn">SEND</button>
      <div class="email-bars-menu">
      </div>
      <div id="email-loader" class="email-loader">
        <div class="blockchain_synclabel">syncing blocks...</div>
        <div class="blockchain_syncbox">
          <div class="blockchain_syncbar" style="width: 100%;"></div>
        </div>
      </div>
  `;
}
