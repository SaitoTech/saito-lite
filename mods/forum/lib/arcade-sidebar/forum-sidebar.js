const ForumSidebarTemplate = require('./forum-sidebar.template');

module.exports = ForumSidebar = {

  loaded : 0 ,

  render(app, data) {
    if (this.loaded == 0) {
      document.querySelector(".arcade-left-sidebar-apps").innerHTML += ForumSidebarTemplate(app);
    }
    this.loaded = 1;
  },

  attachEvents(app, data) {

  },

  addPost(app, title, author, address, date, forum, link, votes, comments) {

    let html = `<div class="arcade-forum-post">
      <div class="poster-id">
        <div class="tip">
          <img class="sidebar-forum-identicon" src="${app.keys.returnIdenticon(author)}" alt="${address}">
          <div class="tiptext">${app.keys.returnIdentifierByPublicKey(author, true)}"</div>
        </div>
      </div>
      <div class="about-post">
        <div class="forum-title" style="">
          <a href="${link}" class="forum-title-link">${title}</a>
        </div>
        <div class="post-details">
          <div class="comment-count"><i class="far fa-comment-alt"></i>&nbsp;<b>${comments}</b></div>
          <div class="vote-count"><i class="fas fa-vote-yea"></i>&nbsp;<b>${votes}</b></div>          
          <div class="sub-forum"> in <a href="${forum}">${forum}</a></div>
        </div>
      </div>
    </div>`;

    document.querySelector('.arcade-forum-posts').innerHTML += html;

  }

}

