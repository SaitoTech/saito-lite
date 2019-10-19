module.exports = EmailControlsTemplate = () => {
  return `
      <div class="email-compose-btn" id="email-compose-btn">COMPOSE</div>
      <ul class="email-navigator" id="email-navigator">
        <li class="email-navigator-item active-navigator-item" id="inbox">inbox</li>
        <li class="email-navigator-item" id="sent">sent</li>
        <li class="email-navigator-item" id="trash">trash</li>
     </ul>
     <div class="email-apps" id="email-apps">
     </div>
     <div id="email-loader" class="email-loader">
       <div class="blockchain_synclabel">syncing blocks...</div>
       <div class="blockchain_syncbox">
         <div class="blockchain_syncbar" style="width: 100%;"></div>
       </div>
     </div>
  `;
}
