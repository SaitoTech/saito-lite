const ArcadeGameCarouselTemplate = require('./arcade-game-carousel.template.js');
const ArcadeGameLeafTemplate = require('./arcade-game-carousel-leaf.template.js');

module.exports = ArcadeGameCarousel = {

  render(app, data) {

    document.querySelector(".arcade-game-carousel").innerHTML = ArcadeGameCarouselTemplate();


    //
    // click-to-Create Games
    //
    //let carousel = document.getElementById("arcade-carousel-slides");
    //data.arcade.mods.forEach(mod => {
    //  let gameobj = mod.respondTo("arcade-games");
    //  if (gameobj != null) {
    //    carousel.innerHTML += ArcadeGameTemplate(mod, gameobj);
    //  ***REMOVED***
    //***REMOVED***);

    let carousel = document.querySelector(".arcade-hero-wrapper");
    carousel.innerHTML = "";
    // carousel.innerHTML += ArcadeGameLeafTemplate();

  ***REMOVED***,




  attachEvents(app, data) {

  ***REMOVED***,


***REMOVED***
