module.exports = HeaderSettingsDropdownTemplate = () => {
  return `
    <div id="settings-dropdown" class="header-dropdown" style="display: none">
  
      <div class="personal-info">

        <div class="profile-photo"></div>

        <div class="account-info">

          <div class="email-address">alice@saito.com</div>
          <div class="public-key">221M3VRYag31ARbZ93AgTMkGUByp46VYpAzjpVeREiugJ</div>
          <div class="manage-account">
          <a href="" target="_blank">Manage Profile Account</a>

        </div>

      </div>

      <div class="reset-wallet">

        <div class="scan-qr">
          <i class="fas fa-qrcode"></i>
          <span class="scan-qr-info">Scan Qr Code</span>
        </div>

        <div class="backup-wallet">
          <i class="fas fa-copy"></i>
          <span class="scan-qr-info">Backup Wallet</span>
        </div>

        <div class="terms">
          <a href="" target="_blank">Privacy Policy</a>
          <span>•</span>
          <a href="" target="_blank">Terms of Service</a>
        </div>

      </div>
      

    </div>

    <div>


    </div>
  `;
***REMOVED***