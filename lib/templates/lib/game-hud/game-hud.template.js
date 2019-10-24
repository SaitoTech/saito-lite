module.exports = GameHudTemplate = () => {
  return `
    <div id="hud" class="hud">
      <nav id="hud-header" class="hud-header">
        <div id="dragbar" class="hud-clickable dragbar dragbar-default" title="Drag me">
          <div id="controls" class="controls">
            <div id="sizer" title="Expand/Collapse Controls" class="fa fa-caret-${hud_caret} hud-button"></div>
            <div id="homer" title="Lock to bottom" class="fa hud-button"></div>
          </div>
        </div>
        <ul>
          <li>
              <a id="game_status">Status</a>
          </li>
          <li>
            <a id="game_extra_menu">extra</a>
          </li>
          <li>
            <a id="game_log">Log</a>
          </li>
          <li>
            <a id="game_help"><span id="hud-help" class="fa fa-question-circle"></span></a>
          </li>
	</ul>
      </nav>
    </div>
  `;
}

