module.exports = GameLoaderTemplate = () => {

  return `  
    <div id="game-loader" class="game-loader">
      <div id="game-loader-title" class="game-loader-title">Your Game is Initializing</div>
      <div class="game-loader-spinner" id="game-loader-spinner"></div>
    </div>
    <div id="game-loader-backdrop" class="game-loader-backdrop"></div>
  `;

}

