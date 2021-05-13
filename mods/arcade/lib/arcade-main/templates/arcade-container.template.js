module.exports = ArcadeContainerTemplate = (app, mod) => {
  return `
    <div class="header-shim" style=""></div>
    <div id="arcade-container" class="arcade-container">
      <div class="page-header">
        <h1 class="page-title">Arcade</h1>
        <p class="page-subtitle">This is a tech demo for Saito. Play games and win cryptos!</p>
      </div>
    </div>
  `;
}