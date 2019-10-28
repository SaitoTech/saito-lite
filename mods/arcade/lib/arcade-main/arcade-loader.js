const ArcadeLoaderTemplate = require('./arcade-loader.template');


module.exports = ArcadeLoader = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; }
    arcade_main.innerHTML = ArcadeLoaderTemplate();

  },


  attachEvents(app, data) {

  }

}
