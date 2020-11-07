const ArcadeMainTemplate = require('./templates/arcade-main.template');
const ArcadePosts = require('./arcade-posts');
const ArcadeInfobox = require('./arcade-infobox');
const SaitoCarousel = require('../../../../lib/saito/ui/saito-carousel/saito-carousel');
const SaitoCarouselTemplate = require('../../../../lib/saito/ui/saito-carousel/saito-carousel');

module.exports = ArcadeMain = {

  render(app, mod) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-main")) { app.browser.addElementToDom(ArcadeMainTemplate(), "arcade-container"); }

    ArcadePosts.render(app, mod);
    ArcadeInfobox.render(app, mod);

    //
    // add games to header
    //
    app.modules.respondTo("arcade-games").forEach(module => {
      let title = module.name;
      let arcade_banner = "/" + module.returnSlug() + "/img/arcade.jpg";
      let html = `<div id="game-tile-${module.returnSlug()}" class="game-tile" style="background-image: url('${arcade_banner}'); background-size: cover"></div>`;
      app.browser.addElementToDom(html, "arcade-hero");
    });

/***
    //
    // add games to carousel
    //
    // create carousel, but manually insert instead of rendering in body
    //
    mod.carousel.render(app, mod, "arcade-hero");
    mod.carousel.attachEvents(app, mod);

    app.modules.mods.forEach(module => {
      if (module.respondTo("arcade-games")) {
        if (module.respondTo("arcade-carousel")) {
	  let gameobj = module.respondTo("arcade-carousel");
          let html = `<div class="leaf" style="background: url(${gameobj.background});background-size:cover">
                        <div class="big">${gameobj.title}</div>
                      </div> 
	  `;
	  let leaf = app.browser.htmlToElement(html);
          mod.carousel.addLeaf(leaf);
        }
      }
    });
***/

  },


  attachEvents(app, mod) {

  },
}
