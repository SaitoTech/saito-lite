module.exports = SaitoGameCarouselTemplate = (type) => {
  return `
  <div id="saito-carousel" class="saito-carousel">
    <link rel="stylesheet" href="/${type}/carousel.css">
    <div id="saito-carousel-wrapper" class="carousel-wrapper">
      <img src="/saito/img/16by5.png" class="carousel-spacer" />
    </div>
  </div>
  `;
}
