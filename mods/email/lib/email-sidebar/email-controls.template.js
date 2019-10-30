module.exports = EmailControlsTemplate = () => {
  return `
      <button class="button-main" email-compose-btn" id="email-compose-btn">NEW</button>
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
