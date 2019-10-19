module.exports = EmailControlsTemplate = () => {
  return `
      <div class="email-compose-btn" id="email-compose-btn">
      </div>
      <ul class="email-navigator" id="email-navigator">
        <li id="email-navigator-item" id="inbox">inbox</li>
        <li id="email-navigator-item" id="sent">sent</li>
        <li id="email-navigator-item" id="trash">trash</li>
        <li id="email-navigator-item" id="apps">apps</li>
     </ul>
     <div id="email-loader" class="email-loader">
       <div class="blockchain_synclabel">syncing blocks...</div>
       <div class="blockchain_syncbox">
         <div class="blockchain_syncbar" style="width: 100%;"></div>
       </div>
     </div>
  `;
}
