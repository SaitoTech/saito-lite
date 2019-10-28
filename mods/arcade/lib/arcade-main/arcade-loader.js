const ArcadeLoaderTemplate = require('./arcade-loader.template');


module.exports = ArcadeLoader = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; ***REMOVED***
    arcade_main.innerHTML = ArcadeLoaderTemplate();

  ***REMOVED***,


  attachEvents(app, data) {

  ***REMOVED***

***REMOVED***
