module.exports = HeaderSettingsDropdownTemplate = (app) => {

  let show_backup  = 1;
  let show_restore  = 1;
  

  let html = `
    <div id="settings-dropdown" class="header-dropdown">
      <div class="personal-info">
        <img class="profile-photo" />
        <div class="account-info">
          <div class="profile-identifier">anonymous account</div>
          <div class="profile-public-key"></div>
        </div>
    </div>
    <center><hr width="98%" style="color:#888"/></center>

    <div class="wallet-actions">
  `;

  if (show_backup) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-backup-wallet">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-copy"></i> Backup Access Keys</span>
      </div>
    `;
  }
  if (show_restore) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-restore-wallet">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-redo"></i> Restore Access Keys</span>
      </div>
    `;
  }

  html += `
    </div>
  `;

  return html;

}
