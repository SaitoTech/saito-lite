module.exports = ArcadeLeftSidebarTemplate = () => {
  return `
    <div class="arcade-controls">
      <button class="super" id="arcade-play-btn">PLAY</button>
      <div class="email-bars-menu">
        <div class="email-navigator-bars-menu">
        <div>
          <ul class="email-navigator" id="email-navigator">
            <li class="email-navigator-item active-navigator-item" id="inbox">Open Games</li>
          </ul>
        </div>
        <div>
          <ul class="email-apps" id="email-apps">
            <li class="email-navigator-item">Twilight Struggle</li>
            <li class="email-navigator-item">WordBlocks</li>
            <li class="email-navigator-item">Red Imperium</li>
            <li class="email-navigator-item">Chess</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
    <div class="email-chat"></div>
  `;
}
