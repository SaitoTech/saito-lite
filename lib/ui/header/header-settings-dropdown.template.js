module.exports = HeaderSettingsDropdownTemplate = (app) => {

  let show_qrcode = 0;
  let show_backup = 1;
  let show_reset  = 1;

  if (app.modules.returnModule("QRScanner")) {
    show_qrcode = 1;
  }


  let html = `
    <div id="settings-dropdown" class="header-dropdown">
      <div class="personal-info">
        <img class="profile-photo" />
        <div class="account-info">
          <div class="profile-identifier"></div>
          <div class="profile-public-key"></div>
        </div>
    </div>
    <button class="manage-account">Manage Profile</button>
    <div class="wallet-actions">
  `;
  if (show_qrcode) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-scan-qr">
        <span class="scan-qr-info"><i class="fas fa-qrcode"></i> Scan Qr Code</span>
      </div>
    `;
  }
  if (show_backup) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-backup-wallet">
        <span class="scan-qr-info"><i class="fas fa-copy"></i> Backup Wallet</span>
      </div>
    `;
  }
  if (show_reset) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-reset-wallet">
        <span class="scan-qr-info"><i class="fas fa-redo"></i> Reset Wallet</span>
      </div>
    `;
  }
  html += `
    </div>
  `;

  return html;

}
