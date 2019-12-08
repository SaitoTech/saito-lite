module.exports = ArcadeRightSidebarTemplate = (id) => {
  let identifier_html = id ? `<h3>${id}</h3>` :
  `<div class="saito-identifier">
    <h2 style="justify-self: center">Get a Username</h2>
    <button id="register-button" style="width: 100%">REGISTER</button>
  </div>`;

  return `
    <div style="display: grid; justify-items: right;">
      <div style="
        font-size: 1.4em;
        text-overflow: ellipsis;
        overflow: hidden;" class="saito-balance">0.0 SAITO</div>
        ${identifier_html}
    </div>

    <div class="arcade-sidebar-box">
      <h2 class="arcade-sidebar-active-games-header">Leaderboard</h2>
      <div class="arcade-sidebar-active-leaderboard-body"></div>
    </div>

    <!-- <div class="arcade-sidebar-box">
      <h2 class="arcade-sidebar-active-games-header">Watch Live</h2>
      <div class="arcade-sidebar-active-games-body"></div>
    </div>
    <div class="arcade-sidebar-respondees"></div> -->
  `;
}
