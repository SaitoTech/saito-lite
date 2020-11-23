const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const PostViewTemplate = require('./post-view.template');
const PostViewCommentTemplate = require('./post-view-comment.template');

module.exports = PostView = {

  render(app, mod, sig="") {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, PostViewTemplate(app, mod, sig), function() {});
    for (let i = 0; i < 3; i++) {
      app.browser.addElementToDom(PostViewCommentTemplate(app, mod), "post-view-comments");
    }
  },


  attachEvents(app, mod, sig="") {
  },


}

