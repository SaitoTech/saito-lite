
module.exports = SaitoHeaderTemplate = (app, mod) => {

  let html = `

    <div id="saito-header" class="header header-home">
      <a href="/"><img class="logo" src="/saito/img/logo.svg"></a>
      <div id="header-icon-links" class="header-icon-links">
        <div id="header-mini-wallet" class="header-mini-wallet">
          <span id="header-username" class="header-username"></span>
        </div>
        <i id="navigator" class="header-icon icon-med fas fa-cog"></i>
      </div>

      <div id="settings-dropdown" class="header-dropdown">
        <div class="personal-info">
          <img id="header-profile-photo" class="header-profile-photo" />
          <div class="account-info">
            <div id="profile-public-key" class="profile-public-key"></div>
            <div id="header-balance" class="header-balance" ></div><div id="header-token" class="header-token"></div>
          </div>
        </div>

        <center><hr width="98%" style="color:#888"/></center>

        <div class="wallet-actions">
          <div class="wallet-action-row" id="header-dropdown-backup-wallet">
            <span class="scan-qr-info"><i class="settings-fas-icon fas fa-copy"></i> Backup Access Keys</span>
          </div>
          <div class="wallet-action-row" id="header-dropdown-restore-wallet">
            <span class="scan-qr-info"><i class="settings-fas-icon fas fa-redo"></i> Restore Access Keys</span>
          </div>
          <div class="wallet-action-row" id="header-dropdown-settings">
            <span class="scan-qr-info"><i class="settings-fas-icon fas fa-wrench"></i> Settings </span>
          </div>
          <div class="wallet-action-row" id="header-dropdown-scan-qr">
            <span class="scan-qr-info"><i class="settings-fas-icon fas fa-qrcode"></i> Scan </span>
          </div>
        </div>

     </div>
  `;
  return html;

}
