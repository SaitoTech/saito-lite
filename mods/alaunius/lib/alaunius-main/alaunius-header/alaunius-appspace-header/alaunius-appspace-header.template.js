module.exports = AlauniusAppspaceHeaderTempkate = (app, data) => {
  return `
    <div class="alaunius-detail-left-options">
      <i id="alaunius-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <span class="alaunius-header-title">${data.parentmod.header_title}</span>
    </div>
    <div class="alaunius-balance">${app.wallet.returnBalance()} Saito</div>
  `;
}
