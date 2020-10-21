module.exports = GameHudTemplate = () => {

  let arrow_dir = "down";

  return `
    <div id="hud" class="hud"></div>
    <div id="hud-header" class="hud-header"></div>
    <div id="hud-body" class="hud-body">
      <div id="status" class="status"></div>
      <div id="status-overlay" class="status-overlay"></div>
    </div>
  `;
}

