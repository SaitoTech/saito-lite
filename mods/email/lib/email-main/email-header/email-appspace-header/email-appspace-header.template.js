module.exports = EmailAppspaceHeaderTempkate = (app, data) => {
  return `
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <span class="email-header-title">${data.parentmod.header_title***REMOVED***</span>
    </div>
    <div class="email-balance">${app.wallet.returnBalance()***REMOVED*** Saito</div>
  `;
***REMOVED***
