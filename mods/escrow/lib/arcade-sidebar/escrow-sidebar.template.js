module.exports = EscrowSidebarTemplate = () => {
  return `
  <div class="escrow-sidebar-outer">
    <link rel="stylesheet" href="/escrow/css/escrow-sidebar.css">

    <h3>Escrow Service</h3>
    <div class="escrow-sidebar-inner">
        <div>

            Play a charity game with your favourite crypto. Loser donates staked amount from escrow:

        </div>

        <button id="escrow-sidebar-btn">Create Game</button>
    </div>
</div>
  `;
}
