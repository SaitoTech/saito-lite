module.exports = EmailAppspaceHeaderTemplate = (app, data) => {
  return `
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
    </div>
    <div class="email-balance">${app.wallet.returnBalance()} Saito</div>
  `;
}
