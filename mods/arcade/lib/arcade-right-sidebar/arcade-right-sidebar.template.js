module.exports = ArcadeRightSidebarTemplate = (publickey, id) => {

  let top_right_html = id ? `Hello <b>${id***REMOVED***</b> 👋<br> Click here to start earning SAITO tokens.` :
    `<b>Welcome Anonymous!</b> Click here to register your Saito username and start earning SAITO tokens.`

  return `
  <div class="arcade-announcement">${top_right_html***REMOVED***</div>
  <div class="arcade-sidebar-box">
    <div class="arcade-sidebar-active-games-header" style="display:flex; align-items:center;justify-content: space-between">
              <h2>Leaderboard</h2>
              <!---
              <i id="games-add-game" class="icon-med fas fa-plus"></i>
	      --->
    </div>
    <div class="arcade-sidebar-active-leaderboard-body">
    </div>
  </div>

  <div class="arcade-sidebar-respondees"></div>
  `;
***REMOVED***
