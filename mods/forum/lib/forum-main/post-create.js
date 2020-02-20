const PostCreateTemplate = require('./post-create.template');


module.exports = PostCreate = {

  render(app, data) {
    let post_create = document.querySelector(".forum-main");
    if (!post_create) { return; }
    post_create.innerHTML = PostCreateTemplate();
  },


  attachEvents(app, data) {

    document.querySelector('.post-submit-btn').addEventListener('click', (e) => {

      let title   = document.querySelector('.post-create-title').value;
      let content = document.querySelector('.post-create-textarea').value;
      let link    = document.querySelector('.post-create-link').value;
      let forum   = document.querySelector('.post-create-forum').value;

      let newtx   = data.forum.createPostTransaction(title, content, link, forum);

      data.forum.app.network.propagateTransaction(newtx);

      data.forum.render(data.forum.app, data);

    });




    console.log("Add Events!");
  },


}
