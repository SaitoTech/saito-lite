module.exports = EmailInboxHeaderTemplate = (app, data) => {
  return `
    <div class="email-icons">
      <input id="email-select-icon" type="checkbox">
      <i id="email-delete-icon" class="icon-med far fa-trash-alt"></i>
    </div>
    <div class="email-balance">${app.wallet.returnBalance()***REMOVED*** Saito</div>
  `;
***REMOVED***
