module.exports = ArcadeRightSidebarTemplate = (publickey, id) => {

  let top_right_html = '<div class="arcade-sidebar-greeting">';
  top_right_html += id ? `
       <h2>Hello <b>${id}</b> 👋</h2>
  ` :
  `<b>Welcome Anonymous!</b>`;
  top_right_html += ` 
  <div class="arcade-sidebar-notices"></div>
  </div>
  `;

  return `
  <div class="arcade-announcement">${top_right_html}</div>
  <div class="arcade-sidebar-box">
    <!--div class="arcade-sidebar-active-games-header" style="display:flex; align-items:center;justify-content: space-between">
              <h2>Leaderboard</h2>
              <i id="games-add-game" class="icon-med fas fa-plus"></i>
	  </div>
    <div class="arcade-sidebar-active-leaderboard-body">
    </div-->
  </div>

  <div class="arcade-sidebar-respondees"></div>
  `;
}
