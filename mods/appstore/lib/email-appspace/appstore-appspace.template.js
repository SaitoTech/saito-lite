module.exports = AppStoreAppspaceTemplate = () => {

  return `
<link rel="stylesheet" type="text/css" href="/appstore/css/email-appspace.css">

<div class="appspace-appstore-container">
  <div class="appstore-header-featured">
    <h3>Featured Applications</h3>
    <div class="searchbox">
        <input type="text" placeholder="Search Applications for ..." id="appstore-search-box">
    </div>
  </div>

  <div class="appstore-app-list"></div>

  <div class="appstore-app-viewmore-header">
    <a href="">view more applications</a>
  </div>

  <div class="appstore-header-browse">
    <h3>Browse All Available</h3>
  </div>

  <div class="appstore-browse-list"></div>

  <div class="appstore-publish">
    <h3>Developer?</h3>
    <button id="appstore-publish-button">PUBLISH</button>
  </div>

</div>
  `;
***REMOVED***
