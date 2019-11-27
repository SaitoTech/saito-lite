module.exports = ArcadeMainTemplate = () => {
  return `
  <link rel="stylesheet" href="/arcade/hero.css">
  <div>
  <div class="arcade-hero">
    <div class="arcade-hero-wrapper">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <img style="width: 100%" src="16by5.png" />
    </div>
  </div>  
  <div class="play-now-holder">
    <button id="play-now" class="play-now">Create Game</button>
  </div>
  <ul class="arcade-gamelist" id="arcade-gamelist"></ul>
  `;
}
