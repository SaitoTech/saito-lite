const ForumMainTemplate = require('./forum-main.template');
const ForumTeaser = require('./forum-teaser');

module.exports = ForumMain = {

  render(app, data) {

    let forum_main = document.querySelector(".forum-main");
    if (!forum_main) { return; }
    forum_main.innerHTML = ForumMainTemplate();


    //
    // all posts / comments
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

  },



  attachEvents(app, data) {

    console.log("Add Events!");
    //
    // all posts / comments
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

  },

}
