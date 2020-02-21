const ForumLeftSidebarTemplate = require('./forum-left-sidebar.template');

module.exports = ForumLeftSidebar = {

  render(app, data) {


    let forum_left_sidebar = document.querySelector(".forum-left-sidebar");
    if (!forum_left_sidebar) { return; }
    forum_left_sidebar.innerHTML = ForumLeftSidebarTemplate();

    for (let i = 0; i < data.forum.mods.length; i++) {
      if (data.forum.mods[i].respondTo('email-chat') != null) {
        data.forum.mods[i].respondTo('email-chat').render(app, data);
      }
    }

  },



  attachEvents(app, data) {

    for (let i = 0; i < data.forum.mods.length; i++) {
      if (data.forum.mods[i].respondTo('email-chat') != null) {
        data.forum.mods[i].respondTo('email-chat').attachEvents(app, data);
      }
    }


  },

}
