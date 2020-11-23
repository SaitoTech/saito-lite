const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const PostViewTemplate = require('./post-view.template');
const PostViewCommentTemplate = require('./post-view-comment.template');

module.exports = PostView = {

  render(app, mod) {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, PostViewTemplate(), function() {});
    for (let i = 0; i < 3; i++) {
      app.browser.addElementToDom(PostViewCommentTemplate(), "post-view-comments");
    }
  },


  attachEvents(app, mod) {
  },


}

