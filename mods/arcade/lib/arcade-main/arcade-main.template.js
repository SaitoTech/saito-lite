module.exports = ArcadeMainTemplate = () => {
  return `
        <div class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">
            <li class="glide__slide">0</li>
            <li class="glide__slide">1</li>
            <li class="glide__slide">2</li>
          </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
        </div>
      </div>
      <div class="arcade-games" id="arcade-games"></div>
      <ul class="arcade-gamelist" id="arcade-gamelist"></ul>
  `;
}
