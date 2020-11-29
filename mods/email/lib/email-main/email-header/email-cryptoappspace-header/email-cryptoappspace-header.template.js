module.exports = EmailCryptoAppspaceHeaderTemplate = (app, mod) => {
  return `
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <i id="email-bars-icon" class="icon-med fas fa-bars"></i>
    </div>
    <div class="email-balance">${app.wallet.returnBalance()} Saito</div>
  `;
}
