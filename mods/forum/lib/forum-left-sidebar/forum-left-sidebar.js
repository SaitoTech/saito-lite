const ForumLeftSidebarTemplate = require('./forum-left-sidebar.template');
const PostCreate = require('./../forum-main/post-create');

module.exports = ForumLeftSidebare = {

  render(app, data) {

    let forum_left_sidebar = document.querySelector(".forum-left-sidebar");
    if (!forum_left_sidebar) { return; }
    forum_left_sidebar.innerHTML = ForumLeftSidebarTemplate();

  },



  attachEvents(app, data) {
  },

}
