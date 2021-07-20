module.exports = ArcadeGameDetailsTemplate = (app, mod, invite) => {

  return `
    <div class="game-wizard">
      <form id="game-wizard-form" class="game-wizard-form">

	<div class="game-wizard-header">
          <div class="game-wizard-image"><img class="game-image" src="/imperium/img/arcade.jpg"/></div>
	  <div class="game-wizard-intro">
	    <input type="hidden" name="gamename" value="${invite.msg.game}" />
            <div class="game-wizard-title">Red Imperium</div>
            <div class="game-wizard-description">Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of the galaxy in the waning days of a dying Empire.</div>
            <div class="game-wizard-status"></div>
	  </div>
	</div>
        

	<div class="game-wizard-controls">

          <div id="game-wizard-players" class="game-wizard-players">
            <select class="game-wizard-players-select" name="game-wizard-players-select">
            </select>
	    <div class="game-wizard-options-toggle"><span class="game-wizard-options-toggle-text">advanced options...</span></div>
          </div>

	  <div id="game-wizard-invite" class="game-wizard-invite">	
            <button type="button" id="game-invite-btn" class="game-invite-btn">Create New Game</button>
	  </div>

	</div>

        <div id="game-wizard-publisher-message" class="game-wizard-publisher-message"></div>

        <div id="game-wizard-advanced-options-overlay" class="game-wizard-advanced-options-overlay"></div>

      </form>
    </div>
`;
}
