module.exports = EmailInboxHeaderTemplate = (app, mod) => {
  return `
    <div class="email-icons">
      <input id="email-select-icon" type="checkbox">
      <i id="email-delete-icon" class="icon-med far fa-trash-alt"></i>
      <i id="email-bars-icon" class="icon-med fas fa-bars"></i>
    </div>
    <div class="detail email-balance"></div>
  `;
}
