module.exports = EmailAppStoreTemplate = () => {

  return `
<link rel="stylesheet" href="/appstore/css/email-appspace.css" />
<div class="appspace-appstore-container">

  <h2>Your Applications:</h2>

  <div class="appstore-apps"></div>
  
  <fieldset class="appstore-publish">
    <button id="appstore-publish-button">Upload New Application</button>
  </fieldset>

</div>
  `;

}
