module.exports = GameHudTemplate = () => {
  return `
    <div id="hud" class="hud"></div>
    <div id="hud-menu" class="hud-menu"></div>
    <div id="hud-header" class="hud-header"></div>
    <div id="hud-body" class="hud-body">
      <div id="status" class="status"></div>
      <div id="hud-menu-overlay" class="hud-menu-overlay"></div>
    </div>
    <div id="hud-cardbox" class="hud-cardbox"></div>
    <div id="log" class="log"></div>
  `;
}

