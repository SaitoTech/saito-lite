module.exports = EmailInboxHeaderTemplate = (app, mod, boxname) => {
  return `
    <div class="email-inbox-header-holder">
      <div class="email-icons">
        <input id="email-select-icon" type="checkbox">
        <i id="email-delete-icon" class="icon-med far fa-trash-alt"></i>
        <i id="email-bars-icon" class="icon-med fas fa-bars"></i>
      </div>
      <div class="email-balance"><span id="email-balance"></span><nbsp/><span id="email-token"></span></div>
      <div class="email-box-name">${boxname}</div>
    </div>
  `;
}
