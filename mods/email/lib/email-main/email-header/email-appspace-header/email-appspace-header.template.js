module.exports = EmailAppspaceHeaderTempkate = (app, data) => {
  return `
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <h3>${data.parentmod.header_title***REMOVED***</h3>
    </div>
    <div class="email-balance">${app.wallet.returnBalance()***REMOVED*** Saito</div>
  `;
***REMOVED***
