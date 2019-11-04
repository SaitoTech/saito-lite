module.exports = ArcadeGameListRowTemplate = (tx) => {

  let optionstxt = "";
  if (JSON.stringify(tx.transaction.msg.options).length > 2) { optionstxt = JSON.stringify(tx.transaction.msg.options); }

  return `
    <div class="arcade-game-invitation" id="${tx.transaction.sig}">
      <div class="arcade-game-row-name" id="${tx.transaction.sig}">${tx.transaction.msg.game}</div>
      <div class="arcade-game-row-options" id="${tx.transaction.sig}">${optionstxt}</div>
      <div class="arcade-game-row-join" id="${tx.transaction.sig}">JOIN</div>
    </div>
  `;
}
