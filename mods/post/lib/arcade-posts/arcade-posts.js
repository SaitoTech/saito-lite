const ArcadePostsTemplate = require('./arcade-posts.template');
const PostTeaserTemplate = require('./post-teaser.template');
const PostView = require('./../post-overlay/post-view');
const PostCreate = require('./../post-overlay/post-create');

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

    document.querySelectorAll('.arcade-post-title').forEach(el => {
      el.onclick = (e) => {
        let sig = e.currentTarget.getAttribute("data-id");
        PostView.render(app, mod, sig);
        PostView.attachEvents(app, mod, sig);
      }
    });

    document.querySelectorAll('.arcade-post-comments').forEach(el => {
      el.onclick = (e) => {
        let sig = e.currentTarget.getAttribute("data-id");
        PostView.render(app, mod, sig);
        PostView.attachEvents(app, mod, sig);
      }
    });

    try {
      document.querySelector('.arcade-posts-add').onclick = (e) => {
        PostCreate.render(app, mod);
        PostCreate.attachEvents(app, mod);
      }
    } catch (err) {
    }

  },

  addPost(app, mod, post) {
    app.browser.addElementToDom(PostTeaserTemplate(app, mod, post), "arcade-posts");
  }



}

