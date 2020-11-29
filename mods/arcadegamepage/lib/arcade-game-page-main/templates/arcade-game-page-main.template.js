module.exports = ArcadeGamePageMainTemplate = () => {
  return `
  <div class="a2 arcade-main">
    <div class="a2 arcade-hero">
      <div class="a2 hero-action">
        <div class="game-title"><div>Game Title</div></div>
        <div class="a2 game-start">Play Now</div>
      </div>
      <div class="a2 hero-list">
        <div class="a2 game-tile"></div>
        <div class="a2 game-tile"></div>
        <div class="a2 game-tile"></div>
        <div class="a2 game-tile"></div>
        <div class="a2 game-tile"></div>
        <div class="a2 game-tile"></div>
      </div>
    </div>
    <div class="a2 arcade-sub">
      <div class="a2 arcade-posts">Posts</div>
      <div class="a2 arcade-infobox">Infobox</div>
    </div>
  </div>
  `;
}
