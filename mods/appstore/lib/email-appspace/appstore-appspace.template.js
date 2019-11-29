module.exports = AppStoreAppspaceTemplate = () => {
  let applist = [0,0,0,0].map((_, index) => {
    return `
      <div id="appstore-app-item-${index}" class="appstore-app-item">
        <div class="appstore-app-item-image"></div>
        <div class="appstore-app-item-name">Honey and Stones</div>
        <div class="appstore-app-item-rating">score: 8.5</div>
        <button class="appstore-app-install-btn">install</button>
      </div>`
  }).join('');

  let browselist = [0,0,0,0].map((_, index) => {
    return `
      <div id="appstore-browse-item-${index}" class="appstore-browse-item">
        <div class="appstore-sort-item-name">Games</div>
        <div class="appstore-sort-item-amount">358</div>
        <div class="appstore-sort-item-icon"><i class="fas fa-gamepad"></i></div>
      </div>`
  }).join('');

  return `
<link rel="stylesheet" type="text/css" href="/appstore/css/email-appspace.css">

<div class="appspace-appstore-container">
  <div class="appstore-header-featured">
    <h3>Featured Applications</h3>
    <div class="searchbox">
        <input type="text" placeholder="Search Applications for ..." id="appstore-search-box">
    </div>
  </div>

  <div class="appstore-app-list">${applist}</div>

  <div class="appstore-app-viewmore-header">
    <a href="">view more applications</a>
  </div>

  <div class="appstore-header-browse">
    <h3>Browse All Available</h3>
  </div>

  <div class="appstore-browse-list">${browselist}</div>

  <div class="appstore-publish">
    <h3>Developer?</h3>
    <button id="appstore-publish-button">PUBLISH</button>
  </div>

</div>
  `;
}
