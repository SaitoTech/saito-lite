const PostSidebarTemplate = require('./post-sidebar.template');
const NewPost = require('../new-post/new-post');

module.exports = PostSidebar = {

  loaded : 0 ,

  render(app, data) {
    if (this.loaded == 0) {
      try {
        document.querySelector(".arcade-left-sidebar-apps").innerHTML += PostSidebarTemplate(app, data);
      } catch (err) {
      }
    }
    this.loaded = 1;
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

  addPost(app, title, author, address, date, post, link, votes, comments) {

    let html = `<div class="arcade-post-post">
      <div class="poster-id">
        <div class="tip">
          <img class="sidebar-post-identicon" src="${app.keys.returnIdenticon(author)}" alt="${address}">
          <div class="tiptext">${app.keys.returnIdentifierByPublicKey(author, true)}"</div>
        </div>
      </div>
      <div class="about-post">
        <div class="post-title" style="">
          <a href="${link}" class="post-title-link">${title}</a>
        </div>
        <div class="post-details">
          <div class="comment-count"><i class="far fa-comment-alt"></i>&nbsp;<b>${comments}</b></div>
          <div class="vote-count"><i class="fas fa-vote-yea"></i>&nbsp;<b>${votes}</b></div>          
          <div class="sub-post"> in <a href="${post}">${post}</a></div>
        </div>
      </div>
    </div>`;

    document.querySelector('.arcade-post-posts').innerHTML += html;

  }

}

