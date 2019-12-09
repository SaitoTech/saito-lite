module.exports = ArcadeLeftSidebarTemplate = () => {
  return `

  <div class="arcade-controls">
      <div class="arcade-bars-menu">
          <div class="arcade-navigator-bars-menu">
              <div class="arcade-apps-wrapper">
		<div class="play-now" id="play-now">Create Game</div>
                <ul class="arcade-apps" id="arcade-apps">
                </ul>
      		<div class="add-games" id="add-games"><i class="fas fa-plus-circle"></i>&nbsp;Install More Games...</div>
              </div>
          </div>
      </div>
  </div>
  <div class="email-chat"></div>
    
  `;
}
