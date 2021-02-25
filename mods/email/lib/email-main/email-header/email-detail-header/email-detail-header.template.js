module.exports = EmailDetailHeaderTempkate = (app, mod) => {
  return `
  <div class="email-header-holder">
    <div class="email-detail-left-options">
      <i id="email-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <i id="email-bars-icon" class="icon-med fas fa-bars"></i>
    </div>
    <div class="email-detail-right-options">
      <div class="email-icons-detail">
        <i id="email-delete-icon" class="icon-med far fa-trash-alt"></i>
        <i id="email-detail-reply" class="icon-med fas fa-reply"></i>
        <i id="email-detail-forward" class="icon-med fas fa-share"></i>
      </div>
      <div class="email-balance-detail"><span id="email-balance"></span><nbsp/><span id="email-token"></span></div>
    </div>
  </div>
  `;
}
