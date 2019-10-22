module.exports = EmailDetailHeaderTempkate = (app, data) => {
  return `
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <h3>${data.parentmod.header_title}</h3>
    </div>
    <div class="email-detail-right-options">
    <div class="email-icons">
      <i id="email-delete-icon" class="icon-med far fa-trash-alt"></i>
      <i id="email-detail-reply" class="icon-med fas fa-reply"></i>
      <i id="email-detail-forward" class="icon-med fas fa-share"></i>
    </div>
    <div class="email-balance">${app.wallet.returnBalance()} Saito</div>
    </div>
  `;
}
