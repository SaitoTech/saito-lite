module.exports = ArcadeGameDetailsTemplate = (app, mod, invite) => {

  let html = '';

  let optionsHtml = "";
  Object.keys(invite.msg.options).forEach((key, i) => {
    optionsHtml += `<div>${key}:</div><div>${invite.msg.options[key]}</div>`
  });

  return `
    <div class="game-wizard">
      <form id="game-wizard-form" class="game-wizard-form">

	<div class="game-wizard-header">
          <div class="game-wizard-image"><img class="game-image" src="/imperium/img/arcade.jpg"/></div>
	  <div class="game-wizard-intro">
            <div class="game-wizard-title">Red Imperium</div>
            <div class="game-wizard-description">Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of the galaxy in the waning days of a dying Empire.</div>
	  </div>
	</div>
        

	<div class="game-wizard-controls">

          <div id="game-wizard-players" class="game-wizard-players">
          </div>

	<div>

            <select class="game-wizard-players-select" name="game-wizard-players-select">
            </select>
	
	    <div class="game-wizard-options-toggle"> <i class="fas fa-caret-right"></i> options... </div>

	  <div id="game-wizard-invite" class="game-wizard-invite">	
            <button id="game-invite-btn" class="game-invite-btn">Create New Game</button>
	  </div>
	</div>
	  <div class="game-wizard-options">

            <div id="game-wizard-basic-options" class="game-wizard-basic-options">
	      <div class="sage-options-time">[icon]</div>
	      <div class="sage-options-ranked">[icon]</div>
	      <div class="sage-options-escrow">[icon]</div>
	      <div class="game-basic-controls">${optionsHtml}</div>
	    </div>

            <div id="game-wizard-advanced-options" class="game-wizard-advanced-options"></div>
          </div>
        </div>
      </form>
    </div>
`;
}
