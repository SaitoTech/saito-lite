module.exports = GameHudTemplate = (height, width) => {
  return `
    <div id="hud" class="hud">
      <div id="hud-header" class="hud-header">
        <div id="controls" class="controls">
          <i id="hud-toggle-button" class="fas fa-caret-down"></i>

          <!-- <div id="homer" title="Lock to bottom" class="fa hud-button"></div> -->
        </div>
      </div>
      <div id="hud-menu" class="hud-menu"></div>
      <div id="hud-body" class="hud-body">
        <div id="status" class="status"></div>
        <div id="log" class="log"></div>
      </div>
    </div>
  `;
}

