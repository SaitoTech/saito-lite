module.exports = GameHudTemplate = () => {
  return `
    <div id="hud" class="hud">

    <!-- <nav id="hud-header" class="hud-header">
        <div id="dragbar" class="hud-clickable dragbar dragbar-default" title="Drag me">
          <div id="controls" class="controls">
            <div id="sizer" title="Expand/Collapse Controls" class="fa fa-caret-down hud-button"></div>
            <div id="homer" title="Lock to bottom" class="fa hud-button"></div>
          </div>
        </div>
        <ul>
          <li>
              <a id="game_status">Status</a>
          </li>
        </ul>
      </nav> -->

      <div id="hud-header" class="hud-header">
        <div id="controls" class="controls">
          <i class="fas fa-caret-down"></i>
          <div id="homer" title="Lock to bottom" class="fa hud-button"></div>
        </div>
      </div>
      <div id="hud-body" class="hud-body">
        <div id="hud-menu" class="hud-menu">
          <ul>
            <li>
                <a id="game_status">Status</a>
            </li>
            <li>
                <a id="game_status">Log</a>
            </li>
            <li>
                <a id="game_status">Cards</a>
            </li>
            <li>
                <a id="game_status">Settings</a>
            </li>
          </ul>
        </div>
        <div id="status" class="status"></div>
        <div id="log" class="log"></div>
      </div>
    </div>
  `;
  //
  // <div id="dragbar" class="hud-clickable dragbar dragbar-default" title="Drag me">
  //   <div id="controls" class="controls">
  //   </div>
  // </div>
***REMOVED***

