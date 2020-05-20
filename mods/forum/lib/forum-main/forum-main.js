const ForumMainTemplate = require('./forum-main.template');
const ForumTeaser = require('./forum-teaser');
const ForumPost = require('./forum-post');
const ForumComment = require('./forum-comment');


module.exports = ForumMain = {

  render(app, data) {

    let forum_main = document.querySelector(".forum-main");
    if (!forum_main) { return; }
    forum_main.innerHTML = ForumMainTemplate();


    //
    // all teasers
    // 
    if (data.forum) {
      if (data.forum.forum.teasers) {
        if (data.forum.forum.teasers.length > 0) {
          for (let i = 0; i < data.forum.forum.teasers.length; i++) {
            data.forum.forum.teaser = data.forum.forum.teasers[i];
            ForumTeaser.render(app, data);
          }
        }
      }
    }


    //
    // post
    // 
    if (data.forum) {
      if (data.forum.forum.post) {
        ForumPost.render(app, data);
      }
    }


    //
    // organize comments into hashmap array
    // 
    let base_comments = [];



    //console.log("CMT: " + JSON.stringify(data.forum.forum.comments));



    //
    // push parent comments first
    //
    if (data.forum) {
      if (data.forum.forum.comments) {
        if (data.forum.forum.comments.length > 0) {
          for (let i = 0; i < data.forum.forum.comments.length; i++) {
            if (data.forum.forum.comments[i].transaction.msg.parent_id == data.forum.forum.comments[i].transaction.msg.post_id) {
              base_comments.push(data.forum.forum.comments[i]);
              data.forum.forum.comments.splice(i, 1);
              i = -1;
            }
          }
        }
      }
    }

    let loops_through = 0;
    while (data.forum.forum.comments.length > 0 && loops_through < 10) {
      for (let z = 0; z < data.forum.forum.comments.length; z++) {
        let acomment = data.forum.forum.comments[z];
        for (let y = 0; y < base_comments.length; y++) {
          let bcomment = base_comments[y];
          if (bcomment.transaction.sig == acomment.transaction.msg.parent_id) {
            base_comments.splice(y + 1, 0, acomment);
            data.forum.forum.comments.splice(z, 1);
            y = base_comments.length + 2;
            z = -1;
          }
        }
      }
      loops_through++;
    }
    data.forum.forum.comments = base_comments;





    //
    // comments
    // 
    let margin_indent = 0;
    if (data.forum) {
      if (data.forum.forum.comments) {
        if (data.forum.forum.comments.length > 0) {
          for (let i = 0; i < data.forum.forum.comments.length; i++) {
            if (i > 0) {
              if (data.forum.forum.comments[i].transaction.msg.parent_id == data.forum.forum.comments[i - 1].transaction.sig) {
                margin_indent += 20;
              } else {
                if (data.forum.forum.comments[i].transaction.msg.parent_id == data.forum.forum.comments[i - 1].transaction.msg.post_id) {
                  margin_indent = 0;
                } else {
                  for (let z = i - 1; z >= 0; z--) {
                    if (data.forum.forum.comments[i].transaction.msg.parent_id != data.forum.forum.comments[z].transaction.msg.post_id) {
                      margin_indent -= 20;
                    } else {
                      z = -2;
                    }
                  }
                }
              }
            }
            data.forum.forum.comment = data.forum.forum.comments[i];
            data.forum.forum.comment_indent = margin_indent;
            ForumComment.render(app, data);
          }
        }
      }
    }




  },



  attachEvents(app, data) {

    //add-button for mobile
    document.querySelector('.forum-mobile-new').addEventListener('click', (e) => {
      PostCreate.render(app, data);
      PostCreate.attachEvents(app, data);
    });

    //navigate back to forum
    document.querySelector('.forum-mobile-back').addEventListener('click', (e) => {
      var path = window.location.href.split("/");
      path.pop();
      window.location.href = path.join("/");
    });

    //
    // all teasers
    // 
    if (data.forum) {
      if (data.forum.forum.teasers) {
        if (data.forum.forum.teasers.length > 0) {
          for (let i = 0; i < data.forum.forum.teasers.length; i++) {
            data.forum.forum.teaser = data.forum.forum.teasers[i];
            ForumTeaser.attachEvents(app, data);
          }
        }
      }
    }

    //
    // post
    // 
    if (data.forum) {
      if (data.forum.forum.post) {
        ForumPost.attachEvents(app, data);
      }
    }


    //
    // comments
    // 
    if (data.forum) {
      if (data.forum.forum.comments) {
        if (data.forum.forum.comments.length > 0) {
          for (let i = 0; i < data.forum.forum.comments.length; i++) {
            data.forum.forum.comment = data.forum.forum.comments[i];
            ForumComment.attachEvents(app, data);
          }
        }
      }
    }


    //
    // comments on comments
    //
    try {
      Array.from(document.getElementsByClassName('comment-links-reply')).forEach(commentobj => {

        commentobj.addEventListener('click', (e) => {

          let post_id = document.querySelector(".post").getAttribute("id");
          let parent_id = e.currentTarget.id;
          let subforum = document.querySelector(".post-forum").value;

          let comment_textarea_container = ".comment-add-comment-" + parent_id;
          let comment_textarea = ".comment-add-comment-textarea-" + parent_id;
          let comment_btn = ".comment-add-comment-btn-" + e.currentTarget.id;

          document.querySelector(comment_textarea_container).style.display = "block";

          document.querySelector(comment_btn).addEventListener('click', (e2) => {
            let title = "";
            let content = document.querySelector(comment_textarea).value;
            let newtx = data.forum.createPostTransaction(title, content, "", subforum, post_id, "", parent_id);
            data.forum.app.network.propagateTransaction(newtx);
            newtx.transaction.comments = 0;
            newtx.transaction.votes = 0;
            data.forum.forum.posts.push(newtx);
            data.forum.render(data.forum.app, data);
          });
        });
      });
    } catch (err) {
    }




    //
    // upvotes and downvotes
    //
    Array.from(document.getElementsByClassName('post_upvote')).forEach(upvote => {
      upvote.addEventListener('click', (e) => {
        e.currentTarget.style.color = "#ff8235";

        let downvote_arrow = ".post_downvote_arrow_" + e.currentTarget.id;
        document.querySelector(downvote_arrow).style.color = "#444";

        let newtx = data.forum.createVoteTransaction(e.currentTarget.id, "upvote");
        app.network.propagateTransaction(newtx);

        let current_votes = parseInt(document.getElementById("votes-total-" + e.currentTarget.id).innerHTML);
        document.getElementById("votes-total-" + e.currentTarget.id).innerHTML = current_votes + 1;
      });
    });

    //
    // downvotes
    //
    Array.from(document.getElementsByClassName('post_downvote')).forEach(downvote => {
      downvote.addEventListener('click', (e) => {
        e.currentTarget.style.color = "#ff8235";

        let upvote_arrow = ".post_upvote_arrow_" + e.currentTarget.id;
        document.querySelector(upvote_arrow).style.color = "#444";

        let newtx = data.forum.createVoteTransaction(e.currentTarget.id, "downvote");
        app.network.propagateTransaction(newtx);

        let current_votes = parseInt(document.getElementById("votes-total-" + e.currentTarget.id).innerHTML);
        document.getElementById("votes-total-" + e.currentTarget.id).innerHTML = current_votes - 1;

      });
    });

    //
    // delete
    //
    Array.from(document.getElementsByClassName('teaser-content-links-delete')).forEach(del => {
      del.addEventListener('click', (e) => {

        let newtx = data.forum.createDeleteTransaction(e.currentTarget.id);
        app.network.propagateTransaction(newtx);

        let divid = ".teaser_" + e.currentTarget.id;
        let elem = document.querySelector(divid);
        elem.parentNode.removeChild(elem);

        salert("Delete Requested: it may take a minute for this to update");

      });
    });


    //
    // report 
    //
    Array.from(document.getElementsByClassName('teaser-content-links-report')).forEach(del => {
      del.addEventListener('click', (e) => {

        let newtx = data.forum.createReportTransaction(e.currentTarget.id);
        app.network.propagateTransaction(newtx);

        let divid = ".teaser_" + e.currentTarget.id;
        let elem = document.querySelector(divid);
        elem.parentNode.removeChild(elem);

        salert("Post Reported: admin should review.");

      });
    });

  },

}
