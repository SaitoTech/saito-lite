module.exports = ArcadeLeftSidebarTemplate = () => {
  return `
    <div class="arcade-controls">
      <button class="super" id="arcade-play-btn">PLAY</button>
      <div class="arcade-bars-menu">
        <div class="arcade-navigator-bars-menu">
        <div>
          <ul class="arcade-navigator" id="arcade-navigator">
            <li class="arcade-navigator-item active-navigator-item" id="inbox">Open Games</li>
          </ul>
        </div>
        <div>
          <ul class="arcade-apps" id="arcade-apps">
          </ul>
        </div>
        </div>
      </div>
    </div>
    <div class="email-chat"></div>
  `;
***REMOVED***
