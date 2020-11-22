const ArcadePostsTemplate = require('./arcade-posts.template');
const PostTeaserTemplate = require('./post-teaser.template');

module.exports = ArcadePosts = {

  render(app, mod) {

    if (!document.getElementById("arcade-posts-container")) {
      app.browser.addElementToDom(ArcadePostsTemplate());
      for (let i = 0; i < 10; i++) {
        app.browser.addElementToDom(PostTeaserTemplate(), "post-posts");
      }
    }

  },


  attachEvents(app, mod) {
  },


}

