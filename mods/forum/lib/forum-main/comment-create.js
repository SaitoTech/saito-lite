const CommentCreateTemplate = require('./comment-create.template');


module.exports = CommentCreate = {

  render(app, data) {
    let commentcreate = document.querySelector(".comment-create");
    if (!comment_create) { return; }
    comment_create.innerHTML = CommentCreateTemplate();
  },


  attachEvents(app, data) {
    console.log("Add Events!");
  },


}
