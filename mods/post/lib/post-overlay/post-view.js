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
	  this.attachEvents(app, mod, sig);
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


try {
    document.querySelectorAll('.post-view-comment-edit').forEach(el => {
      el.onclick = (e) => {

        let comment_sig = el.getAttribute("data-id");

        document.querySelectorAll('.post-view-comment-text').forEach(el2 => {	

	  if (el2.getAttribute("data-id") === comment_sig) {

	     let replacement_html = `<textarea data-id="${comment_sig}" id="textedit-field-${comment_sig}">${el2.innerHTML}</textarea><button id="edit-button-${comment_sig}" data-id="${comment_sig}" type="button" class="comment-edit-button" value="Edit Comment" />`;
	    el2.innerHTML = replacement_html;
	    document.getElementById(`edit-button-${comment_sig}`).onclick = (e) => {

	      let revised_text = document.querySelector(`#textedit-field-${comment_sig}`).value;
	      let newtx = mod.createEditTransaction(comment_sig, revised_text);   
	      app.network.propagateTransaction(newtx);

	      for (let i = 0; i < mod.comments.length; i++) {
		if (mod.comments[i].transaction.sig === comment_sig) {
		  newtx.children = mod.comments[i].children;
		  mod.comments[i] = newtx;
		}
	      }
	      for (let i = 0; i < mod.posts.length; i++) {
		if (mod.posts[i].transaction.sig === comment_sig) {
		  newtx.children = mod.posts[i].children;
		  mod.comments[i] = newtx;
		}
	      }

	      el2.innerHTML = revised_text;

	      mod.render();

	    };
	  }
	});


      }
    });
} catch (err) {}

    document.querySelector('.post-view-report').onclick = async (e) => {

      let reportit = await sconfirm("Report this post or comments to the mods?");
      if (reportit) {

        let sig = document.querySelector('.post-view-report').getAttribute("data-id");

	await salert("Thank you for flagging this");

	for (let i = 0; i < mod.posts.length; i++) {
	  if (mod.posts[i].transaction.sig === sig) {
	    mod.posts.splice(i, 1);
	  }
	}
	for (let i = 0; i < mod.comments.length; i++) {
	  if (mod.comments[i].transaction.sig === sig) {
	    mod.comments.splice(i, 1);
	  }
	}

	mod.render();
	mod.overlay.hideOverlay();

        let newtx = mod.createReportTransaction(sig);
        app.network.propagateTransaction(newtx);
      }

    }



  },


  addComment(app, mod, comment) {
    app.browser.addElementToDom(PostViewCommentTemplate(app, mod, comment), "post-view-comments");
  }


}

