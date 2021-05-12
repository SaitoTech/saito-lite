let saito = require('./../../../../lib/saito/saito');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const PostViewTemplate = require('./post-view.template');
const PostViewCommentTemplate = require('./post-view-comment.template');

module.exports = PostView = {

  render(app, mod, sig="") {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);
    mod.comments = [];

    //
    // fetch comments from server
    //
    // we now fetch parent to show images and stuff
    //
    //let sql = `SELECT id, tx FROM posts WHERE thread_id = "${sig}" AND parent_id != "" ORDER BY ts DESC`;
    let sql = `SELECT id, tx FROM posts WHERE thread_id = "${sig}" ORDER BY ts ASC`;
    mod.sendPeerDatabaseRequestWithFilter(

        "Post" ,

        sql ,

        (res) => {
          if (res) {
            if (res.rows) {
              for (let i = 0; i < res.rows.length; i++) {
                let add_this_comment = 1;
                let tx = new saito.transaction(JSON.parse(res.rows[i].tx));
                let txmsg = tx.returnMessage();
                for (let z = 0; z < mod.comments.length; z++) {
                  if (mod.comments[z].transaction.sig == tx.transaction.sig) { add_this_comment = 0; }
                }
	        if (tx.transaction.sig == sig) {
		  add_this_comment = 0;
		  try {
		    document.getElementById("post-view-parent-comment").innerHTML = txmsg.comment;
		    let gallery = document.getElementById("post-view-gallery");
		    let html = "";
    		    if (txmsg.images.length > 0) {
      		      for (let i = 0; i < tx.msg.images.length; i++) {
       			 html += `<img class="post-view-gallery-image" src="${tx.msg.images[i]}" />`;
      		      }
		      gallery.innerHTML = html;
		      gallery.style.display = "block";
    		    }
		  } catch (err) {
console.log("error showing comment or gallery");
		  }
	        }
                if (add_this_comment == 1) {
                  tx.originalSig = res.rows[i].id;
                  mod.comments.push(tx);
                }
              }
              for (let i = 0; i < mod.comments.length; i++) {
                this.addComment(app, mod, mod.comments[i]);
              }
              this.attachEvents(app, mod, sig);
            }
          }
          
        }
    );
    mod.overlay.showOverlay(app, mod, PostViewTemplate(app, mod, sig), function() {});
  },
  rerender(app, mod, sig) {



  },

  attachEvents(app, mod, sig="") {
    document.querySelector('.post-submit-btn').onclick = (e) => {

      let comment = document.querySelector('.post-view-textarea').innerHTML;
      document.querySelector('.post-view-textarea').innerHTML = "";
      if (comment != ""){
        let newtx = mod.createCommentTransaction(sig, comment);
        app.network.propagateTransaction(newtx);

        newtx.children = 0;
        mod.comments.push(newtx);
        this.addComment(app, mod, newtx);
        this.attachEvents(app, mod, sig);  
      }
    }



    document.querySelectorAll('.post-view-edit').forEach(el => {
      el.onclick = (e) => {
        console.log("********* post-view-edit onclick ********");
        let post_sig = el.getAttribute("data-id");
        document.querySelectorAll('.post-view-parent-comment').forEach(el2 => {	
          
          if (el2.getAttribute("data-id") === post_sig) {
            if (el2.getAttribute("mode") != "edit") { // already in edit mode
              el2.setAttribute("mode", "edit");
              let replacement_html = `
                <textarea data-id="${post_sig}" id="textedit-field-${post_sig}">${el2.innerHTML}</textarea>
                <button id="edit-button-${post_sig}" data-id="${post_sig}" type="button" class="comment-edit-button" value="Edit Post">edit comment</button>
              `;

              el2.innerHTML = replacement_html;
              document.getElementById(`edit-button-${post_sig}`).onclick = (e) => {

                let revised_text = document.querySelector(`#textedit-field-${post_sig}`).value;
                let this_post = null;

                for (let i = 0; i < mod.posts.length; i++) {
                  if (mod.posts[i].transaction.sig === post_sig) {
                    this_post = mod.posts[i];
                  }
                }

                let newtx = mod.createEditPostTransaction(this_post.msg.title, revised_text, this_post.msg.link, this_post.msg.forum, this_post.msg.images, post_sig);
                app.network.propagateTransaction(newtx);

                for (let i = 0; i < mod.posts.length; i++) {
                  if (mod.posts[i].transaction.sig === post_sig) {
                    newtx.children = mod.posts[i].children;
                    mod.posts[i] = newtx;
                  }
                }
                el2.setAttribute("mode", "read");
                el2.innerHTML = revised_text;
                document.querySelectorAll('.post-view-parent-comment, .post-view-edit').forEach(el2 => {	
                  // This is necessary so that the edit button has the new sig, i.e. data-id
                  // need to be correct for the edit button to work again...
                  el2.setAttribute("data-id", newtx.transaction.sig);
                });
                this.attachEvents(app, mod, sig);
              };
            }
          }
        });
      }
    });


    try {
      document.querySelectorAll('.post-view-comment-edit').forEach(el => {
        el.onclick = (e) => {

          let comment_sig = el.getAttribute("data-id");

          document.querySelectorAll('.post-view-comment-text').forEach(el2 => {	

            if (el2.getAttribute("data-id") === comment_sig) {

              let replacement_html = `
                <textarea data-id="${comment_sig}" id="textedit-field-${comment_sig}">${el2.innerHTML}</textarea>
                <button id="edit-button-${comment_sig}" data-id="${comment_sig}" type="button" class="comment-edit-button" value="Edit Comment">edit comment</button>
              `;
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
              };
            }
          });
        }
      });
    } catch (err) {}

    /*  REPORTING SYSTEM
    *   
    */
    document.querySelectorAll('.post-view-report').forEach(el => {
      el.onclick = async (e) => {
        const reportit = await sconfirm("Report this post or comments to the mods?");
        if (reportit) {
          const sig = el.getAttribute("data-id");
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

          const newtx = mod.createReportTransaction(sig);
          app.network.propagateTransaction(newtx);
        }
    }
  });


  },


  addComment(app, mod, comment) {
    app.browser.addElementToDom(PostViewCommentTemplate(app, mod, comment), "post-view-comments");
  }


}

