module.exports = ArcadeMainTemplate = () => {
  return `
  <link rel="stylesheet" href="/arcade/hero.css">
<div class="arcade-main-hero">
    <div class="arcade-hero">
        <div class="arcade-hero-wrapper">
            <div class="leaf">
              <div class="big">Twilight Struggle</div>
              <div class="med">Custom Cards</div>
              <div class="small">Open source, independent, so much fun.</div>
              <img class="HIS" src="./img/HIS.png" />
              <img class="CD" src="./img/CD.png" />
              <img class="RLIRS" src="./img/RLIRS.png" />              
            </div>
            <div class="leaf"></div>
            <div class="leaf"></div>
            <div class="leaf"></div>
            <div class="leaf"></div>
            <img style="width: 100%" src="16by5.png" />
        </div>
    </div>
</div>
<ul class="arcade-gamelist" id="arcade-gamelist"></ul>
  `;
}
