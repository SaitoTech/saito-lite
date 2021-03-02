const ArcadePostsTemplate = require('./arcade-posts.template');
const PostTeaserTemplate = require('./post-teaser.template');
const PostView = require('./../post-overlay/post-view');
const PostCreate = require('./../post-overlay/post-create');
const PostStyle = require('./../style.template.js');

module.exports = ArcadePosts = {

  render(app, mod) {

    if (!document.getElementById("arcade-posts-container")) {
      app.browser.addElementToDom(ArcadePostsTemplate());
    }
    for (let i = mod.posts.length-1; i >= 0; i--) {
      this.addPost(app, mod, mod.posts[i]);
    }

    mod.renderMethod = "arcade";
    if (!document.getElementById("posts-stylesheet")) {
      app.browser.addElementToDom(PostStyle());  
    }

  },


  attachEvents(app, mod) {

    document.querySelectorAll('.arcade-post-title, .arcade-post-comments').forEach(el => {
      el.onclick = (e) => {
        let clickLocation = e.currentTarget.id.replace("arcade-post-", "");
        app.browser.logMatomoEvent("Posts", "PostsOpen", "ArcadePostsViewClick", clickLocation);
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
    let post_this = 1;
    document.querySelectorAll('.arcade-post').forEach(el => {
      let sig = el.getAttribute("data-id");
      if (sig === post.transaction.sig) { post_this = 0; }
    });
    if (post_this == 0) { return; }
    app.browser.prependElementToDom(PostTeaserTemplate(app, mod, post), document.getElementById("arcade-posts"));
  }



}

