const ForumSidebarTemplate = require('./forum-sidebar.template');

module.exports = ForumSidebar = {

  loaded : 0 ,

  render(app, data) {
    if (this.loaded == 0) {
      document.querySelector(".arcade-right-sidebar").innerHTML += ForumSidebarTemplate(app);
    }
    this.loaded = 1;
  },

  attachEvents(app, data) {

  },

  addPost(title, author, date, forum, link, votes, comments) {

    let html = `<div class="arcade-forum-post">
		  <div class="forum-title" style=""><a href="${link}" class="forum-title-link">${title}</a>`;
    if (comments == 1) { html += ` (1 comment) `; } else { html += ` (${comments} comments) `; } 
        html += `</div>
		  <div class="forum-author" style="font-size:0.9em"><span>${author}</span> in <a href="/forum/${forum}">${forum}</a></div>
		</div>
   `;
    document.querySelector('.arcade-forum-posts').innerHTML += html;

  }

}

