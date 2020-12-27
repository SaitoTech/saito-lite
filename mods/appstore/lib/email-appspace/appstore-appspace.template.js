module.exports = EmailAppStoreTemplate = () => {

  return `
<link rel="stylesheet" href="/appstore/css/email-appspace.css" />
<div class="appspace-appstore-container">

  <h2>Deploy an Application:</h2>

  <div class="appstore-apps"></div>
  
  <button id="appstore-publish-button">Upload New Application</button>

</div>
  `;

}
