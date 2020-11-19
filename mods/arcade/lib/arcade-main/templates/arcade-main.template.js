const ArcadeInviteTemplate = require('./arcade-invite.template');
module.exports = ArcadeMainTemplate = (app, mod) => {
  return `
    <div id="arcade-main" class="arcade-main">
      <div id="arcade-tab-buttons">
        <div id="tab-button-arcade" class="tab-button active-tab-button"><span>Invites</span></div>
        <div id="tab-button-observables" class="tab-button"><span>Observe a Game</span></div>
        <div id="tab-button-tournaments" class="tab-button"><span>Tournaments</span></div>
      </div>
      <div id="arcade-tabs">
        <div id="arcade-hero" class="arcade-hero">
          
        </div>
        <div id="observables-hero" class="arcade-tab-hidden">
          Coming Soon!
        </div>
        <div id="tournaments-hero" class="arcade-tab-hidden">
          Tournaments coming soon!
        </div>
      </div>
      <div id="arcade-sub" class="arcade-sub">
      </div>
    </div>
  `;
}
