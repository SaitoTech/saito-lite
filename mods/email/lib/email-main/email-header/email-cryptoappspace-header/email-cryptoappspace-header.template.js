module.exports = EmailCryptoAppspaceHeaderTemplate = (app, mod) => {
  return `
  <div class="email-header-holder">
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <i id="email-bars-icon" class="icon-med fas fa-bars"></i>
    </div>
    <div class="email-balance"><span id="email-balance"></span><nbsp/><span id="email-token"></span></div>
  </div>
  `;
}
