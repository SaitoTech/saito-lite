module.exports = HeaderSettingsDropdownTemplate = () => {
  return `
    <div id="settings-dropdown" class="header-dropdown">
      <div class="personal-info">
        <img class="profile-photo" />
        <div class="account-info">
          <div class="profile-identifier"></div>
          <div class="profile-public-key"></div>
        </div>
    </div>
    <button class="manage-account">Manage Profile Account</button>
    <div class="wallet-actions">
      <div class="reset-wallet">

        <div class="scan-qr">
          <i class="fas fa-qrcode"></i>
          <span class="scan-qr-info">Scan Qr Code</span>
        </div>

        <div class="backup-wallet">
          <i class="fas fa-copy"></i>
          <span class="scan-qr-info">Backup Wallet</span>
        </div>

        <!--div class="terms">
          <a href="" target="_blank">Privacy Policy</a>
          <span>•</span>
          <a href="" target="_blank">Terms of Service</a>
        </div-->

      </div>

    </div>
  `;
***REMOVED***