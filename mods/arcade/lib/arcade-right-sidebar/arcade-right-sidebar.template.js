module.exports = ArcadeRightSidebarTemplate = (publickey, id) => {
  let identifier_html = id ? `<h3>${id}</h3>` :
  `

  <div class="saito-identifier" style="width: 100%; display: grid;">
    <div style="
      font-size: 1.4em;
      width: 10.5em;
      text-overflow: ellipsis;
      overflow: hidden;" class="saito-balance">${publickey}</div>
    <div>
    <button id="register-button" style="width: 100%; margin-top: 1em">SIGN UP</button>
  </div>`;

  return `
    <div style="display: grid; justify-items: right;">
      <h2>Account</h2>
      <div style="
        font-size: 1.4em;
        text-overflow: ellipsis;
        overflow: hidden;" class="saito-balance">0.0 SAITO</div>
      <div>
        ${identifier_html}
    </div>

    <div class="arcade-sidebar-box">
      <div class="arcade-sidebar-active-leaderboard-body">
        <h2 class="arcade-sidebar-active-games-header">Leaderboard</h2>
      </div>
    </div>

    <!-- <div class="arcade-sidebar-box">
      <h2 class="arcade-sidebar-active-games-header">Watch Live</h2>
      <div class="arcade-sidebar-active-games-body"></div>
    </div>
    <div class="arcade-sidebar-respondees"></div> -->
  `;
}
