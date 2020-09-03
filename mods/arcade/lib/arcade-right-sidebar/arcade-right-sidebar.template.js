module.exports = ArcadeRightSidebarTemplate = (publickey, id) => {

  let top_right_html = '<div class="arcade-sidebar-greeting">';
  top_right_html += id ? `
       <h2>Hello <b>${id}</b> 👋</h2>
  ` :
  `<b>Welcome Anonymous!</b>`;
  top_right_html += ` 
  <div class="arcade-sidebar-balance"></div>
  <div class="arcade-sidebar-notices"></div>
  </div>
  `;

  return `
  <div class="arcade-announcement">${top_right_html}</div>
  <div class="arcade-sidebar-respondees"></div>
  <!--div class="arcade-sidebar-active-games-body"></div-->
  `;
}
