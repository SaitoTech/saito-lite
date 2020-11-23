const PostMainTemplate = require('./post-main.template');
const PostTeaserTemplate = require('./post-teaser.template');
const PostView = require('./../post-overlay/post-view');

module.exports = PostSidebar = {

  render(app, mod) {

    //
    // add parent wrapping class
    //
    if (!document.getElementById("post-container")) {
      app.browser.addElementToDom('<div id="post-container" class="post-container"></div>');
    }
    if (!document.querySelector(".post-main")) { 
      app.browser.addElementToDom(PostMainTemplate(app, mod), "post-container"); 
      for (let i = 0; i < 10; i++) {
        app.browser.addElementToDom(PostTeaserTemplate(), "post-main");
      }
    }

  },


  attachEvents(app, mod) {

    document.querySelectorAll('.post-teaser-title').forEach(el => { 
      el.onclick = (e) => {
        PostView.render(app, mod);
        PostView.attachEvents(app, mod);
      }
    });

   

  },


}

