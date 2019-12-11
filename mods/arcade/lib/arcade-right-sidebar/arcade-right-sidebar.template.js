module.exports = ArcadeRightSidebarTemplate = (publickey, id) => {

  let top_right_html = id ? `Hello <b>${id***REMOVED***</b> 👋<br> Click here to start earning SAITO tokens.` :
    `<b>Welcome Anonymous!</b> Click here to register your Saito username and start earning SAITO tokens.`

  return `
  <div class="arcade-announcement">${top_right_html***REMOVED***</div>
  <div class="arcade-sidebar-box">
    <h2 class="arcade-sidebar-active-games-header">Leaderboard</h2>
    <div class="arcade-sidebar-active-leaderboard-body">
    </div>
  </div>

  <div class="arcade-sidebar-respondees"></div>
  `;
***REMOVED***
