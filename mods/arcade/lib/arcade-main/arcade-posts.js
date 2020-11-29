const ArcadePostsTemplate = require('./templates/arcade-posts.template');

module.exports = ArcadePosts = {

  render(app, mod) {

    if (!document.querySelector(".arcade-posts")) { app.browser.addElementToDom(ArcadePostsTemplate(), "arcade-sub"); }

    app.modules.respondTo("arcade-posts").forEach(module => {
      if (module != null) {
        module.respondTo('arcade-posts').render(app, module);
      }
    });


  },


  attachEvents(app, mod) {

    app.modules.respondTo("arcade-posts").forEach(module => {
      if (module != null) {
        module.respondTo('arcade-posts').attachEvents(app, module);
      }
    });
  },
}
