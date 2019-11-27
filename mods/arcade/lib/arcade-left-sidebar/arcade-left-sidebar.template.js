module.exports = ArcadeLeftSidebarTemplate = () => {
  return `
  <div class="email-chat"></div>
  <div class="add-games-control">
  <h4>Get More Games</h4>
      <button class="add-games"><i class="fas fa-plus-circle"></i>Saito Appstore</button>
  </div>
  <div class="arcade-controls">
      <div class="arcade-bars-menu">
          <div class="arcade-navigator-bars-menu">
              <h4>Quick Start</h4>
              <div class="arcade-apps-wrapper">
                  <ul class="arcade-apps" id="arcade-apps">
                  </ul>
              </div>
          </div>
      </div>
  </div>
    
  `;
}
