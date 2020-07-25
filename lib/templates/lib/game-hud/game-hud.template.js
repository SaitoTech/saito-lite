const { MOBILE_LANDSCAPE } = require('./game-hud-types');

module.exports = GameHudTemplate = (hud_menu_type) => {
  let arrow_dir = hud_menu_type != MOBILE_LANDSCAPE ? 'down' : 'right';
  return `
    <div id="hud-menu-topleft" class="hud-menu hud-menu-topleft"></div>
    <div id="hud" class="hud">
    <div id="hud-menu-inhud" class="hud-menu hud-menu-inhud"></div>
      <div id="hud-header" class="hud-header">
        <div id="controls" class="controls">
          <i id="hud-toggle-button" class="hud-button fas fa-caret-${arrow_dir}"></i>
	  <i id="hud-toggle-fullscreen" class="hud-toggle-fullscreen fa fa-window-maximize" aria-hidden="true"></i>
          <i id="hud-home-button" class="hud-button fas fa-home"></i>
        </div>
      </div>
      <div id="hud-body" class="hud-body">
        <div id="hud-menu-overlay" class="hud-menu-overlay"></div>
        <div id="status" class="status"></div>
        <div id="log" class="log"></div>
      </div>
    </div>
  `;
}

