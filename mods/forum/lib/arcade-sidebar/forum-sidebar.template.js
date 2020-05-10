module.exports = ForumSidebarTemplate = (app, data) => {
  return `
  <div class="arcade-forum-sidebar">
    <div class="arcade-forum-header" style="display: flex; align-items: center; justify-content: space-between;">
      <h3>Community Discussions:</h3>
    </div>
    <div class="arcade-forum-posts"></div>
    <style>


.arcade-forum-posts {
  color: var(--saito-skyline-grey);
  font-family: 'visuelt-light';
  display: grid;
  grid-gap: 0.7em;
  overflow-x: hidden;
  padding-left: 0.5em;
  padding-top: 0.5em;
}

.forum-title {
  font-weight: bolder;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arcade-forum-posts a {
  text-decoration: none;
  color: var(--saito-skyline-grey);
}
.arcade-forum-posts a:hover {
  text-decoration: none;
  border-bottom: 1px dashed white;
  color: white;
}

.arcade-forum-post {
  display: grid;
  grid-gap: 7px;
  grid-template-columns: 32px auto;
}

.sidebar-forum-identicon {
  width: 32px;
  margin: 2px 0;
}

.post-details {
  display: grid;
  grid-gap: 3px;
  grid-template-columns: 2.5em 2.5em auto;
  font-size: smaller;
}

.sub-forum {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.about-post {
  display: grid;
  grid-gap: 5px;
}

.arcade-forum-sidebar {
  border: 1px solid #663399;
  width: 100%;
  height: auto;
  font-size: 0.9em;
}
.arcade-forum-header {
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid var(--saito-red);
  background: var(--saito-jester);
}

    </style>
  </div>
    `;
}
