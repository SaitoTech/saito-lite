module.exports = ArcadeMainTemplate = () => {
  return `
      <div id="arcade-carousel" class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul id="arcade-carousel-slides" class="glide__slides"></ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="icon-med fas fa-angle-left"></i></button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="icon-med fas fa-angle-right"></i></button>
        </div>
      </div>
      <!-- <div class="arcade-games" id="arcade-games"></div> -->
      <ul class="arcade-gamelist" id="arcade-gamelist"></ul>
  `;
***REMOVED***
