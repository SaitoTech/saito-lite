const ArcadePostsTemplate = require('./arcade-posts.template');
const PostTeaserTemplate = require('./post-teaser.template');

module.exports = ArcadePosts = {

  render(app, mod) {

    if (!document.getElementById("arcade-posts-container")) {
      app.browser.addElementToDom(ArcadePostsTemplate());
    }
    for (let i = 0; i < mod.posts.length; i++) {
      this.addPost(app, mod, mod.posts[i]);
    }

  },


  attachEvents(app, mod) {

    document.querySelectorAll('.post-teaser-title').forEach(el => {
      el.onclick = (e) => {
        let sig = e.currentTarget.getAttribute("data-id");
        PostView.render(app, mod, sig);
        PostView.attachEvents(app, mod, sig);
      }
    });

    document.querySelectorAll('.post-teaser-comments').forEach(el => {
      el.onclick = (e) => {
        let sig = e.currentTarget.getAttribute("data-id");
        PostView.render(app, mod, sig);
        PostView.attachEvents(app, mod, sig);
      }
    });

  },

  addPost(app, mod, post) {
    app.browser.addElementToDom(PostTeaserTemplate(app, mod, post), "arcade-posts");
  }



}

