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


  },

}
