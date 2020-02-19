const ForumRightSidebarTemplate = require('./forum-right-sidebar.template');
const PostCreate = require('./../forum-main/post-create');

module.exports = ForumRightSidebare = {

  render(app, data) {

    let forum_right_sidebar = document.querySelector(".forum-right-sidebar");
    if (!forum_right_sidebar) { return; }
    forum_right_sidebar.innerHTML = ForumRightSidebarTemplate();

  },



  attachEvents(app, data) {

    document.querySelector('.create-post-btn').addEventListener('click', (e) => {
      PostCreate.render(app, data);
      PostCreate.attachEvents(app, data);
    });


  },

}
