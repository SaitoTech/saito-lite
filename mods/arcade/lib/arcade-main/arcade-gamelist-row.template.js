module.exports = ArcadeGameListRowTemplate = (tx) => {
  return `
    <div class="arcade-game-invitation" id="${tx.transaction.sig}">
      <div class="arcade-game-row-name" id="${tx.transaction.sig}">Twilight</div>
      <div class="arcade-game-row-options" id="${tx.transaction.sig}">US +2</div>
      <div class="arcade-game-row-join" id="${tx.transaction.sig}">JOIN</div>
    </div>
  `;
}
