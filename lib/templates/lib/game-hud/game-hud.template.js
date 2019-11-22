module.exports = GameHudTemplate = ({height, width***REMOVED***) => {
  return `
    <div id="hud" class="hud" style=
      "height: ${height***REMOVED***px;
      width: ${width***REMOVED***px;
      grid-template-rows: 40px ${height-40***REMOVED***px;">
      <div id="hud-header" class="hud-header">
        <div id="controls" class="controls">
          <i id="hud-toggle-button" class="hud-button fas fa-caret-down"></i>
          <i id="hud-home-button" class="hud-button fas fa-home"></i>
        </div>
      </div>
      <div id="hud-menu" class="hud-menu"></div>
      <div id="hud-body" class="hud-body">
        <div id="status" class="status hud-menu-overlay"></div>
        <div id="log" class="log"></div>
      </div>
    </div>
  `;
***REMOVED***

