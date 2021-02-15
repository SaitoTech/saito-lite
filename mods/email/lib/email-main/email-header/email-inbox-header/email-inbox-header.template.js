module.exports = EmailInboxHeaderTemplate = (app, mod, boxname) => {
  return `
    <div class="email-inbox-header-holder">
      <div class="email-box-name">

        ${boxname}

        <div class="email-icons">
          <input id="email-select-icon" type="checkbox">
          <i id="email-delete-icon" class="far fa-trash-alt"></i>
          <i id="email-bars-icon" class="fas fa-bars"></i>
        </div>

      </div>
      <div class="email-balance"><span id="email-balance"></span><nbsp/><span id="email-token"></span></div>
    </div>
  `;
}
