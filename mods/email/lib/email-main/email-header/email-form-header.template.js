module.exports = EmailHeaderTemplate = () => {
  return `
    <div class="email-icons">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
    </div>
    <div class="email-balance">${("0.0000000").replace(/0+$/,'').replace(/\.$/,'\.0')} Saito</div>
  `;
}