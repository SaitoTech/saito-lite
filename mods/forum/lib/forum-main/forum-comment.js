const ForumCommentTemplate = require('./forum-comment.template');

module.exports = ForumComment = {


  render(app, data) {

    let forum_comments = document.querySelector(".comments");
    if (!forum_comments) { return; }
    forum_comments.innerHTML += ForumCommentTemplate(app, data, data.forum.forum.comment);

  },



  attachEvents(app, data) {

    console.log("Add Events!");

  },

}
