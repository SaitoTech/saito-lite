const ArcadePostsTemplate = require('./templates/arcade-posts.template');

module.exports = ArcadePosts = {

  render(app, mod) {

    if (!document.querySelector(".arcade-posts")) { app.browser.addElementToDom(ArcadePostsTemplate(), "arcade-sub"); }

  },


  attachEvents(app, mod) {

  },
}
