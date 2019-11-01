module.exports = EmailBarsMenuTemplate = () => {
  return `
<div class="email-navigator-bars-menu">
  <div>
    <ul class="email-navigator" id="email-navigator">
      <li class="email-navigator-item active-navigator-item" id="inbox">Inbox</li>
      <li class="email-navigator-item" id="sent">Sent</li>
      <li class="email-navigator-item" id="trash">Trash</li>
    </ul>
  </div>
  <div>
    <ul class="email-apps" id="email-apps"></ul>
  </div>
  </div>
  `;
***REMOVED***