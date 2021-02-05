const PostMainTemplate = require('./post-main.template');
const PostTeaserTemplate = require('./post-teaser.template');
const PostView = require('./../post-overlay/post-view');
const PostStyle = require('./../style.template');

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
    for (let i = mod.posts.length-1; i >= 0; i--) {
      this.addPost(app, mod, mod.posts[i]);
    }

    //
    // add css
    //
    if (!document.getElementById("posts-stylesheet")) {
      app.browser.addElementToDom(PostStyle());  
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
    let post_this = 1;
    document.querySelectorAll('.post-teaser').forEach(el => {
      let sig = el.getAttribute("data-id");
      if (sig === post.transaction.sig) { post_this = 0; }
    });
    if (post_this == 0) { return; }
    app.browser.prependElementToDom(PostTeaserTemplate(app, mod, post), document.getElementById("post-posts"));
  }


}

