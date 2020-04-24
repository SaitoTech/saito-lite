module.exports = ForumSidebarTemplate = (app, data) => {
    return `
    <h3>Community Discussions:</h3>
    <div class="arcade-forum-posts"></div>
    <style>
.arcade-forum-posts {
  color: whitesmoke;
  font-family: 'visuelt-light';
  margin-bottom:10px;
}
.forum-title {
  margin-bottom:2px;
}
.arcade-forum-posts a {
  text-decoration: none;
  color: whitesmoke;
}
.arcade-forum-posts a:hover {
  text-decoration: none;
  border-bottom: 1px dashed white;
  color: white;
}
    </style>
    `;
  }
