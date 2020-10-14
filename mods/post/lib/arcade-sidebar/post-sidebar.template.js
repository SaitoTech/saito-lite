module.exports = PostSidebarTemplate = (app, data) => {
  return `
  <div class="arcade-post-sidebar">
    <div class="arcade-post-header" style="display: flex; align-items: center; justify-content: space-between;">
      <h3>Community Posts:</h3><i class="new-post icon-med fas fa-plus"></i>
    </div>
    <div class="arcade-post-posts"></div>
    <style>


.arcade-post-posts {
  color: var(--saito-skyline-grey);
  font-family: 'visuelt-light';
  display: grid;
  grid-gap: 0.7em;
  overflow-x: hidden;
  padding-left: 0.5em;
  padding-top: 0.5em;
  height: 20vh;
}

.post-title {
  font-weight: bolder;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arcade-post-posts a {
  text-decoration: none;
  color: var(--saito-skyline-grey);
}
.arcade-post-posts a:hover {
  text-decoration: none;
  border-bottom: 1px dashed white;
  color: white;
}

.arcade-post-post {
  display: grid;
  grid-gap: 7px;
  grid-template-columns: 32px auto;
}

.sidebar-post-identicon {
  width: 32px;
  margin: 2px 0;
}

.post-details {
  display: grid;
  grid-gap: 3px;
  grid-template-columns: 2.5em 2.5em auto;
  font-size: smaller;
}

.sub-post {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.about-post {
  display: grid;
  grid-gap: 5px;
}

.arcade-post-sidebar {
  border: 1px solid #663399;
  width: 100%;
  height: auto;
  font-size: 0.9em;
}
.arcade-post-header {
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid var(--saito-red);
  background: var(--saito-jester);
}

.new-post-wrapper {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: #4448;
  z-index: 10000;
  left: 0;
}

.new-post-form {
  position: relative;
  width: 90vw;
  max-width: 40em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--saito-nightscape);
  padding: 2em;
}

    </style>
  </div>
    `;
}
