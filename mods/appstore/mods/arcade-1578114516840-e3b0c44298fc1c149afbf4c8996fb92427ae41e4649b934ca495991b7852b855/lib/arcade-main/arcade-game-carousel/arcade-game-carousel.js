const ArcadeGameCarouselTemplate = require('./arcade-game-carousel.template.js');
const ArcadeGameCarouselLeafTemplate = require('./arcade-game-carousel-leaf.template.js');

module.exports = ArcadeGameCarousel = {

  render(app, data) {

    document.querySelector(".arcade-game-carousel").innerHTML = ArcadeGameCarouselTemplate();


    //
    // carousel
    //
    let carousel = document.querySelector(".arcade-carousel-wrapper");
    carousel.innerHTML += "";

    data.arcade.mods.forEach(mod => {
      let gameobj = mod.respondTo("arcade-games");
      if (gameobj != null) {
        let gameobj2 = mod.respondTo("arcade-carousel");
	if (gameobj2 != null) {

	  //
	  // these modules support ARCADE and ARCADE-CAROUSEL
	  //
          carousel.innerHTML += ArcadeGameCarouselLeafTemplate(mod, gameobj2);

	}
      }
    });

  },



  attachEvents(app, data) {

  },


}
