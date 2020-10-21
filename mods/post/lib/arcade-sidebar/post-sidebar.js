const PostSidebarTemplate = require('./post-sidebar.template');
const NewPost = require('../post/new-post');
const ShowPost = require('../post/show-post');

module.exports = PostSidebar = {

  loaded: 0,
  contentLoaded: 0,

  render(app, data) {
    if (this.loaded == 0) {
      try {
        document.querySelector(".arcade-left-sidebar-apps").innerHTML += PostSidebarTemplate(app, data);
        this.loaded = 1;
      } catch (err) {
        console.log(err);
      }
    }

  },

  attachEvents(app, data) {

    // add button
    document.querySelector(".new-post").addEventListener('click', (e) => {
      if (!document.querySelector('.new-post-wrapper')) {
        NewPost.render(app, data);
        NewPost.attachEvents(app, data);
      }
    });
  },

  addPosts(app, data) {
    if (this.contentLoaded == 0) {
      try {
        app.modules.returnModule("Post").sendPeerDatabaseRequestWithFilter(

          "Post",

          (`SELECT
          * 
        FROM 
          posts 
        WHERE 
          deleted = 0 AND 
          parent_id = ""
        ORDER BY
          ts desc
        LIMIT 10
        ;`),

          (res) => {
            if (res.rows) {
              res.rows.forEach(row => {
                this.addPost(app, data, row);
              });
              this.contentLoaded = 1;
            }
          },

          (peer) => {
            if (peer.peer.services) {
              for (let z = 0; z < peer.peer.services.length; z++) {
                if (peer.peer.services[z].service === "post") {
                  return 1;
                }
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  },


  addPost(app, data, row) {

    let html = `<div class="arcade-post-post">
      <div class="poster-id">
        <div class="tip">
          <img class="sidebar-post-identicon" src="${app.keys.returnIdenticon(row.author)}"/>
          <div class="tiptext">${app.keys.returnIdentifierByPublicKey(row.author, true)}"</div>
        </div>
      </div>
      <div class="about-post">
        <div class="post-title" id="${row.id}">
          <span class="side-bar-post">${row.content.substr(0, 60)}</span>
        </div>
        <div class="post-details">
          <div class="comment-count"><i class="far fa-comment-alt"></i>&nbsp;<b>${row.children}</b></div>
        </div>
      </div>
    </div>`;

    if (document.querySelector('.arcade-post-posts')) {

      document.querySelector('.arcade-post-posts').append(app.browser.htmlToElement(html));

      document.getElementById(row.id).addEventListener('click', (e, app, data, row) => {
        console.log('click');
        ShowPost.render(app, data, row);
        ShowPost.attachEvents(app, data, row);
      });
    }
  }

}

