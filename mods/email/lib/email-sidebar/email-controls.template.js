module.exports = EmailControlsTemplate = () => {
  return `
      <button class="email-compose-btn" id="email-compose-btn">COMPOSE</button>
      <ul class="email-navigator" id="email-navigator">
        <li class="email-navigator-item active-navigator-item" id="inbox">Inbox</li>
        <li class="email-navigator-item" id="sent">Sent</li>
        <li class="email-navigator-item" id="trash">Trash</li>
     </ul>
     <ul class="email-apps" id="email-apps">
     </ul>
     <div id="email-loader" class="email-loader">
       <div class="blockchain_synclabel">syncing blocks...</div>
       <div class="blockchain_syncbox">
         <div class="blockchain_syncbar" style="width: 100%;"></div>
       </div>
     </div>
  `;
***REMOVED***
