module.exports = EscrowGameWizardTemplate = () => {

  let html = `

  <div class="escrow-game-wizard">
  <div class="return-to-arcade" id="return-to-arcade">
  <i class="icon-large fas fa-times-circle"></i>
</div>

  <link rel="stylesheet" href="/escrow/css/escrow-sidebar.css">

  <h3>Game Wizard Service (Charity Escrow)</h3>

  <div>

      <select class="escrow-game-select" id="escrow-game-select" name="game">
          <option class="escrow-game-select-item" value="select">Select Installed Game</option>
          <option class="escrow-game-select-item" value="Twilight">Twilight Struggle</option>
          <option class="escrow-game-select-item" value="Imperium">Red Imperium</option>
          <option class="escrow-game-select-item" value="Chess">Chess</option>
          <option class="escrow-game-select-item" value="Wordblocks">Wordblocks</option>
      </select>

      <div class="game-details"></div>
      <div>
          <h4>Opponent:</h4>
          <input type="text" id="opponent_address" name="opponent" value="" />
      </div>
      <div>
          <h4>Amount to Stake:</h4>
          <select id="escrow_stake" name="stake" style="margin-top:10px;clear:both">
              <option value="0.005">0.005 BSV</option>
              <option value="0.01">0.01 BSV</option>
              <option value="0.05">0.05 BSV</option>
              <option value="0.1">0.1 BSV</option>
          </select>
      </div>
      <div>
          NOTE: creating a game with escrow does not use the typical Arcade initialization process. Your opponent will be sent an invite via the Saito EMAIL client. They will need to have created and funded their escrow channel before they can play. May the best player win!
      </div>
      <div>
          <button id="escrow-submit-btn">Create Game</button>
      </div>
  </div>
</div>
<div id="background-shim" class="background-shim">
  <div id="background-shim-cover" class="background-shim-cover"></div>
</div>


`;

  return html;
}
