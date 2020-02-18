const { MOBILE_LANDSCAPE } = require('./game-hud-types');

module.exports = GameHudTemplate = (hud_menu_type) => {
  let arrow_dir = hud_menu_type != MOBILE_LANDSCAPE ? 'down' : 'right';
  return `
    <div id="hud" class="hud">
      <div id="hud-header" class="hud-header">
        <div id="controls" class="controls">
          <i id="hud-toggle-button" class="hud-button fas fa-caret-${arrow_dir}"></i>
          <i id="hud-home-button" class="hud-button fas fa-home"></i>
        </div>
      </div>
      <div id="hud-menu" class="hud-menu"></div>
      <div id="hud-body" class="hud-body">
        <div id="hud-menu-overlay" class="hud-menu-overlay"></div>
        <div id="status" class="status"></div>
        <div id="log" class="log"></div>
      </div>
    </div>
  `;
}

