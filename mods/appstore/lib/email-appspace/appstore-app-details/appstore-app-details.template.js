module.exports = AppstoreAppDetailsTemplate = (app) => {
  return `

<div class="appstore-app-install-overlay">

  <div class="appstore-app-install-image">
<img src="/saito/img/dreamscape.png" />
  </div>

  <div class="appstore-app-install-title">
Poker Leaderboards
  </div>

  <div class="appstore-app-install-description">
This is an exciting application that lets you track how you are doing playing poker compared to everyone else in the entire world. Can you make the top 1000 players?
  </div>

  <button id="appstore-app-install-btn" class="appstore-app-install-btn">INSTALL</button>

</div>
  `;
}
