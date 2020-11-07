const ArcadeMainTemplate = require('./templates/arcade-main.template');
const ArcadePosts = require('./arcade-posts');
const ArcadeInfobox = require('./arcade-infobox');

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
      let html = `
      <div id="game-tile-${module.returnSlug()}" class="game-tile" style="background-image: url('${arcade_banner}'); background-size: cover">
        <div class="game-tile-name">${module.name}</div>
        <div class="game-tile-action">Play Now</div>
      </div>`;
      app.browser.addElementToDom(html, "arcade-hero");
    });
  
  },


  attachEvents(app, mod) {

  },
}
