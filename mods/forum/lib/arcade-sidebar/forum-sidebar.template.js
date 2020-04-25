module.exports = ForumSidebarTemplate = (app, data) => {
  return `
    <h3>Community Discussions:</h3>
    <div class="arcade-forum-posts"></div>
    <style>


.arcade-forum-posts {
  color: var(--saito-skyline-grey);
  font-family: 'visuelt-light';
  margin-bottom:10px;
  display: grid;
  grid-gap: 1em;
  overflow-x: hidden;
  height: 20vh;
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

    </style>
    `;
}
