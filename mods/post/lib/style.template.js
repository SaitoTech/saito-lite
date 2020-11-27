module.exports = PostStyleTemplate = (app, mod) => {

  return `

<style type="text/css">

:root {
  --saito-red: #639;
  --saito-nightscape: linear-gradient(-45deg, #324 50%, #1e1e1f 100%);
  --saito-jester: linear-gradient(-45deg, #426 50%, #213 100%);
  --tile-height: 8em;
  --saito-width: 1500px;
  --sidebar-width: 15em;
  --identicon-height: 1em;
}

.post-container {
  min-height: 100%;
  margin: 5em auto;
  padding: 0 1em;
  display: grid;
  gap: 1em;
  grid-template-columns: var(--sidebar-width) auto;
  font-size: 1em;
  width: 100vw;
  max-width: var(--saito-width);
  margin-top: 115px;
}

.post-sidebar {
  display: flex;
  flex-flow: column;
  flex-direction: column;
  flex-wrap: initial;
  z-index: 999;
}

.post-main {}

.post-teaser {
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: 3em auto;
}

.post-teaser-thumbnail {
  float: left;
  min-width: 50px;
}

.post-teaser-title {
  float: left;
  font-size: 1.2em;
  font-weight: bold;
}

.post-teaser-sublinks {
  clear: both;
  font-size: 0.8em;
}

.post-teaser-posted-by {
  float: left;
  margin-right: 1em;
}

.post-teaser-user {
  float: left;
  font-weight: bold;
}

.post-teaser-comments {
  float: left;
  font-weight: bold;
  margin-left: 1em;
  text-decoration: underline;
  cursor: pointer;
}

.post-teaser-report {
  float: left;
  font-weight: bold;
  margin-left: 1em;
  text-decoration: underline;
  cursor: pointer;
}

.post-view-edit {
  color: #888;
  float: left;
  margin-left: 1em;
  cursor: pointer;
}

.post-view-edit:hover {
  color: #444;
  text-decoration: underline;
}

.post-view-comment-edit {
  float: left;
  font-weight: bold;
  margin-left: 1em;
  cursor: pointer;
}

/*** Create ***/

.post-create-container {
  min-height: 80vh;
  min-width: 80vw;
  background-color: whitesmoke;
  padding: 2em;
  border-radius: 3px;
  color: #444;
  box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.75);
}

.post-create-header {
  border-left: 1px solid #ddd;
  display: flex;
  flex-flow: row;
  flex-direction: row;
  flex-wrap: row;
  margin-bottom: 20px;
}

.post-create-active {
  background-color: #dfdfdf;
}

.post-create-header-item {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  min-width: 140px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.post-create-title {
  border: none;
  padding: 10px 5px;
  border-radius: 0px;
  font-size: 1.2em;
  border-bottom: 1px solid var(--saito-cyber-black-wash);
  margin-bottom: 20px;
  background-color: whitesmoke;
}

.post-create-link {
  height: 200px;
  border: none;
  border-radius: 0px;
  font-size: 1.2em;
  margin-bottom: 20px;
  background-color: whitesmoke;
}

.post-create-link-input {
  padding: 10px 5px;
  border-bottom: 1px solid var(--saito-cyber-black-wash);
  background-color: whitesmoke;
}

.post-create-image {
  width: 100%;
  height: 50px;
  text-align: center;
  padding: 90px;
  border-radius: 5px;
  border: 4px dashed #ddd;
  margin-bottom: 20px;
  background-color: whitesmoke;
}

.post-create-image-preview-container {
  float: right;
  height: 30px;
  max-width: 100%;
}

.post-create-image-preview {
  float: right;
  margin-left: 10px;
  border: 1px solid #888;
}

.post-create-image-preview:hover {
  opacity: 0.5;
}

.post-create-textarea {
  border: 1px solid var(--saito-cyber-black-wash);
  padding: 1em;
  min-height: 12em;
  margin-bottom: 20px;
  background-color: white;
}

.post-submit-btn {
  position: relative;
  clear: both;
  bottom: 0;
}

/* Post View */

.post-view-container {
  color: #444;
  width: 90vw;
  min-height: 90vh;
  max-height: 90vh;
  background-color: whitesmoke;
  padding: 20px;
  height: 100%;
  overflow-y: scroll;
  border-radius: 3px;
  box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.75);
}

.post-view-overview {}

.post-view-thumbnail {
  float: left;
  min-width: 50px;
}

.post-view-title {
  float: left;
  font-size: 1.2em;
  font-weight: bold;
}

.post-view-sublinks {
  clear: both;
  font-size: 0.8em;
}

.post-view-posted-by {
  float: left;
  margin-right: 1em;
}

.post-view-user {
  float: left;
  font-weight: bold;
}

.post-view-report {
  color: #888;
  float: left;
  margin-left: 1em;
  cursor: pointer;
}

.post-view-report:hover {
  color: #444;
  cursor: pointer;
  text-decoration: underline;
}

.post-view-parent-comment {
  clear: both;
  margin-top: 30px;
  line-height: 1.5em;
  font-size: 1.0em;
  margin-bottom: 30px;
}

.post-view-comments {
  width: 100%;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.post-view-textarea {
  border: 1px solid var(--saito-cyber-black-wash);
  padding: 1em;
  min-height: 12em;
  margin-bottom: 10px;
  background-color: white;
}

.post-view-leave-comment {
  width: 100%;
  clear: both;
  margin-top: 20px;
}

.post-comment-submit-btn {}

.post-view-comment {
  clear: both;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.post-view-comment:nth-child(even) {
  background-color: #eaeaea;
}

.post-view-comment-text {
  clear: both;
  margin-top: 10px;
}

.post-view-comment-sublinks {
  font-size: 0.9em;
  clear: both;
  margin-bottom: 5px;
}

.post-view-gallery {
  max-width:70%;
}

.post-view-gallery-image {
  width: 100%;
}

.post-teaser-thumbnail {
  background-image: url(/post/img/post-logo.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: center;
  width: 100%;
  height: 100%;
  margin-top: 5px;
}


.arcade-posts-add {
  position: relative;
  top: 0;
  right: 0;
  float: right;
}

.arcade-post {
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 3em auto;
}

.arcade-post-thumbnail {
  background-image: url(/post/img/post-logo.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: center;
  width: 100%;
  height: 100%;
  margin-top: 5px;
}

.arcade-post-sublinks {
  clear: both;
  font-size: 0.8em;
}

.arcade-post-title {
  font-size: 1.2em;
  font-weight: bold;
  float: left;
  font-weight: bold;
  cursor: pointer;
}

.arcade-post-user {
  float: left;
  font-weight: bold;
  margin-left: 1em;
}

.arcade-post-comments {
  float: left;
  font-weight: bold;
  margin-left: 1em;
  text-decoration: underline;
  cursor: pointer;
  opacity: 0.7;
}

.arcade-post-report {
  float: left;
  font-weight: bold;
  margin-left: 1em;
  text-decoration: underline;
}

.arcade-post-posted-by {
  float: left;
}

.arcade-post-front {
  width: 3em;
}
.arcade-post-back {
}

.post-teaser-front {
  width: 3em;
}
.post-teaser-back {
}

</style>



  `;

}


