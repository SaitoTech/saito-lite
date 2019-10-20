module.exports = EmailDetailHeaderTempkate = (title) => {
  return `
    <div class="email-detail-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <h3>${title}</h3>
    </div>
    <div class="email-balance">${("0.0000000").replace(/0+$/,'').replace(/\.$/,'\.0')} Saito</div>
  `;
}