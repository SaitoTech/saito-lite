module.exports = EscrowGameWizardTemplate = () => {

  let html = `

  <link rel="stylesheet" href="/escrow/css/escrow-sidebar.css">

  <h3>Game Wizard Service (Charity Escrow)</h3>

  <p></p>

  <select class="escrow-game-select" id="escrow-game-select" name="game">
    <option class="escrow-game-select-item" value="select">Select Installed Game</option>
    <option class="escrow-game-select-item" value="Twilight">Twilight Struggle</option>
    <option class="escrow-game-select-item" value="Imperium">Red Imperium</option>
    <option class="escrow-game-select-item" value="Chess">Chess</option>
    <option class="escrow-game-select-item" value="Wordblocks">Wordblocks</option>
  </select>  

  <p></p>

  <div class="game-details"></div>

  Opponent: <input type="text" name="opponent" value="" />

  <p></p>

  Amount to Stake:
  
  <select name="stake" style="margin-top:10px;clear:both">
    <option value="0.005">0.005 BSV</option>
    <option value="0.01">0.01 BSV</option>
    <option value="0.05">0.05 BSV</option>
    <option value="0.1">0.1 BSV</option>
   </select>

  <p></p>

  NOTE: creating a game with escrow does not use the typical Arcade initialization process. Your
  opponent will be sent an invite via the Saito EMAIL client. They will need to have created and 
  funded their escrow channel before they can play. May the best player win!

  <p></p>

  <button id="escrow-submit-btn">create game</button>

  </div>
  `;


  return html;
}
