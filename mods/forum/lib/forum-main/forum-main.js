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
    // comments
    // 
    if (data.forum) {
      if (data.forum.forum.comments) {
        if (data.forum.forum.comments.length > 0) {
  	  for (let i = 0; i < data.forum.forum.comments.length; i++) {
	    data.forum.forum.comment = data.forum.forum.comments[i];
	    ForumComment.render(app, data);
	  }
        }
      }
    }




  },



  attachEvents(app, data) {

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
    // upvotes and downvotes
    //
    Array.from(document.getElementsByClassName('post_upvote')).forEach(upvote => {
      upvote.addEventListener('click', (e) => {
        e.currentTarget.style.color = "#ff8235";

	let downvote_arrow = ".post_downvote_arrow_"+e.currentTarget.id;
	document.querySelector(downvote_arrow).style.color = "#444";

        let newtx = data.forum.createVoteTransaction(e.currentTarget.id, "upvote");
        app.network.propagateTransaction(newtx);

        let current_votes = parseInt(document.getElementById("votes-total-"+e.currentTarget.id).innerHTML);
        document.getElementById("votes-total-"+e.currentTarget.id).innerHTML = current_votes+1;
      });
    });

    //
    // downvotes
    //
    Array.from(document.getElementsByClassName('post_downvote')).forEach(downvote => {
      downvote.addEventListener('click', (e) => {
        e.currentTarget.style.color = "#ff8235";

	let upvote_arrow = ".post_upvote_arrow_"+e.currentTarget.id;
	document.querySelector(upvote_arrow).style.color = "#444";

        let newtx = data.forum.createVoteTransaction(e.currentTarget.id, "downvote");
        app.network.propagateTransaction(newtx);

        let current_votes = parseInt(document.getElementById("votes-total-"+e.currentTarget.id).innerHTML);
        document.getElementById("votes-total-"+e.currentTarget.id).innerHTML = current_votes-1;

      });
    });


  },

}
