module.exports = AracadeGameCarousel = () => {
  return `
    <div id="arcade-carousel" class="glide">
      <div class="glide__track" data-glide-el="track">
        <ul id="arcade-carousel-slides" class="glide__slides">
        </ul>
      </div>
      <div class="glide__arrows" data-glide-el="controls">
        <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><</button>
        <button class="glide__arrow glide__arrow--right" data-glide-dir=">">></button>
      </div>
    </div>
  `;
***REMOVED***