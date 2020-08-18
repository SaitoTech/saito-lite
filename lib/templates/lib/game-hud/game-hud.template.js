module.exports = GameHudTemplate = () => {

  let arrow_dir = "down";

  return `
    <div id="hud" class="hud"></div>
    <div id="hud-menu" class="hud-menu"></div>
    <div id="hud-header" class="hud-header"></div>
    <div id="hud-controls" class="hud-controls">
      <!--- <i id="hud-toggle-button" class="hud-button fas fa-caret-${arrow_dir}"></i> --->
      <i id="hud-toggle-fullscreen" class="hud-button hud-toggle-fullscreen hud-toggle-fullscreen-inhud fa fa-window-maximize" aria-hidden="true"></i>
      <!--- <i id="hud-home-button" class="hud-button fas fa-home"></i> --->
    </div>
    <div id="hud-body" class="hud-body">
      <div id="status" class="status"></div>
      <div id="status-overlay" class="status-overlay"></div>
    </div>
    <div id="hud-cardbox" class="hud-cardbox"></div>
    <div id="log" class="log"></div>
  `;
}

