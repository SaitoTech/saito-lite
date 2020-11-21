const ArcadeInfoboxTemplate = require('./templates/arcade-infobox.template');

module.exports = ArcadeInfobox = {

  render(app, mod) {

    if (!document.querySelector(".arcade-infobox")) { app.browser.addElementToDom(ArcadeInfoboxTemplate(), "arcade-sub"); }

    //
    // show leaderboard
    //
    app.modules.respondTo("arcade-infobox").forEach(module => {
      let obj = module.respondTo("arcade-infobox");
      obj.render(app, mod);
      obj.attachEvents(app, mod);
    });

  },


  attachEvents(app, mod) {

  },
}
