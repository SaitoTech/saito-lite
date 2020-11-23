let saito = require('./../../../../lib/saito/saito');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const PostViewTemplate = require('./post-view.template');
const PostViewCommentTemplate = require('./post-view-comment.template');

module.exports = PostView = {

  render(app, mod, sig="") {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    //
    // fetch comments from server
    //
    let sql = `SELECT id, tx FROM posts WHERE thread_id = "${sig}" AND parent_id != "" ORDER BY ts DESC`;
    mod.sendPeerDatabaseRequestWithFilter(

        "Post" ,

        sql ,

        (res) => {
          if (res) {
            if (res.rows) {
              for (let i = 0; i < res.rows.length; i++) {
		let add_this_comment = 1;
                let tx = new saito.transaction(JSON.parse(res.rows[i].tx));
	        for (let z = 0; z < mod.comments.length; z++) {
		  if (mod.comments[z].transaction.sig == tx.transaction.sig) { add_this_comment = 0; }
                }
		if (add_this_comment == 1) {
                  mod.comments.push(tx);
                }
              }
            }
          }

    	  for (let i = 0; i < mod.comments.length; i++) {
    	    this.addComment(app, mod, mod.comments[i]);
    	  }

        }
    );

    mod.overlay.showOverlay(app, mod, PostViewTemplate(app, mod, sig), function() {});

  },


  attachEvents(app, mod, sig="") {

    document.querySelector('.post-submit-btn').onclick = (e) => {

      let comment = document.querySelector('.post-view-textarea').innerHTML;
      document.querySelector('.post-view-textarea').innerHTML = "";

      let newtx = mod.createCommentTransaction(sig, comment);
      app.network.propagateTransaction(newtx);

      newtx.children = 0;
      mod.comments.push(newtx);
      this.addComment(app, mod, newtx);

    }



  },


  addComment(app, mod, comment) {
    app.browser.addElementToDom(PostViewCommentTemplate(app, mod, comment), "post-view-comments");
  }


}

