const PostSidebarTemplate = require('./post-sidebar.template');
const PostCreate = require('./../post-overlay/post-create');

module.exports = PostSidebar = {

  render(app, mod) {

    //
    // add parent wrapping class
    //
    if (!document.getElementById("post-container")) {
      app.browser.addElementToDom('<div id="post-container" class="post-container"></div>');
    }
    if (!document.querySelector(".post-sidebar")) { 
      app.browser.addElementToDom(PostSidebarTemplate(app, mod), "post-container"); 
    }

    app.modules.respondTo("email-chat").forEach(module => {
      if (module != null) {
        module.respondTo('email-chat').render(app, module);
      }
    });

    document.querySelector(".post-sidebar-create-btn").onclick = (e) => {
      PostCreate.render(app, mod);
      PostCreate.attachEvents(app, mod);
    };

  },


  attachEvents(app, mod) {

    app.modules.respondTo("email-chat").forEach(module => {
      module.respondTo('email-chat').attachEvents(app, mod);
    });

  },

}

