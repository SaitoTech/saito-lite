const PostMainTemplate = require('./post-main.template');
const PostTeaserTemplate = require('./post-teaser.template');
const PostView = require('./../post-overlay/post-view');

module.exports = PostMain = {

  render(app, mod) {

    mod.renderMethod = "main";

    //
    // add parent wrapping class
    //
    if (!document.getElementById("post-container")) {
      app.browser.addElementToDom('<div id="post-container" class="post-container"></div>');
    }
    if (!document.querySelector(".post-main")) { 
      app.browser.addElementToDom(PostMainTemplate(app, mod), "post-container"); 
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
    app.browser.addElementToDom(PostTeaserTemplate(app, mod, post), "post-posts");
  }


}

