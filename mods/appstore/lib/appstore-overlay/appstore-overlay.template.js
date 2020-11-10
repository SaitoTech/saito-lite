module.exports = AppStoreAppspaceTemplate = (app, row) => {

  return `
  
<div class="appstore-overlay-container">

  <div class="appstore-header-featured grid-2">
    <div>Install Applications:</div>
    <div class="searchbox appstore-overlay-searchbox">
        <input type="text" class="appstore-search-box" placeholder="search for apps..." id="appstore-search-box">
    </div>
  </div>

  <div class="appstore-overlay-grid" id="appstore-overlay-grid">
  </div>

  <fieldset class="appstore-overlay-developers">
    <p>
      Developer? Code and upload your first Saito Application in five minutes.
    </p>
  </fieldset>

</div>
<style type="text/css">

.appstore-bundler-install-notice {
  font-size: 1.2em;
  height: 300px;
  width: 600px;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid var(--saito-red);
  background-color: var(--saito-cyber-black);
  color: #fff;
  font-family: visuelt-light;
  padding: 1em;
  transform: translate(-50%, -50%);
}



.appstore-app-install-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0009;
  width: 100%;
  height: 100%;
  font-size: 1.1em;
  z-index: 10000;
}

.appstore-app-install-content {
  width: 80%;
  max-width: 800px;
  min-width: 400px;
  padding: 1em;
  color: var(--saito-white);
  font-family: visuelt-light;
  line-height: 1.5em;
  background-color: var(--saito-cyber-black);
  margin: auto;
  position: relative;
  top: 40%;
  transform: translateY(-50%);
  z-index: 5;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 3fr;
}

.appstore-app-install-version {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
}

.appstore-app-install-image img {
  width: 250px;
}

.appstore-app-istall-details.grid-2 {
  grid-gap: 0.5em;
  margin: 0;
}

.appstore-app-istall-details.grid-2 div{
  padding: 0;
  margin: 0;
}

.appstore-app-install-name {
  position: absolute;
  z-index: 5;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 2px #000;
}

.appstore-app-install-image {
  position: relative;
}

.appstore-app-install-description {
  height: 3em;
  overflow-y: auto;
  margin: 0 0 1em 0;
}



.appstore-search-box {
  width: 300px;
  float: right;
  font-size:0.8em;
}

.appstore-overlay-developers {
  font-size:0.5em;
}

.appstore-overlay-container {
  background-color: whitesmoke;
  width: 80vw;
  height: 80vh;
  padding: 20px;
  overflow-y: scroll;
}
.appstore-overlay-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom:20px;
}

.appstore-overlay-app {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 2fr 3fr;
  cursor: pointer;
  border: 1px solid var(--saito-red);
  font-size:20px;
  padding: 10px;
  min-height: 100px;
  background-color: whitesmoke;
  color: #444;
}
.appstore-overlay-app:hover {
  background-color: var(--saito-red);
  color: whitesmoke;
}


.appstore-overlay-app-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.appstore-overlay-app-details {
  font-size: 1em;
}
.appstore-overlay-app-title {
  font-weight: bold;
}

.appstore-overlay-app-type {
  font-size: 0.9em;
}

.appstore-overlay-app-btn {
  padding-top: 4px;
  padding-bottom: 4px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 14px;
  visibility: hidden;
}

.appstore-overlay-app-btn:hover {
  visibility: visible;
}

.appstore-overlay-app-author {
  margin-top: 10px;
}

.appstore-overlay-searchbox {
  max-width: 300px;
  float: right;
  font-size: 0.5em;
}

.appstore-header-featured {
  grid-template-columns: 1fr auto;
}


</style>

  `;
}
