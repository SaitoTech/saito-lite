module.exports = AppStoreAppspaceTemplate = () => {

  return `
<link rel="stylesheet" type="text/css" href="/appstore/css/email-appspace.css">

<div class="appspace-appstore-container">
  <div class="appstore-header-featured">
    <h3>Install a New Application:</h3>
    <div class="searchbox">
        <input type="text" placeholder="search for apps..." id="appstore-search-box">
    </div>
  </div>

  <div class="appstore-app-list"></div>

  <div class="appstore-publish">
    <h3>Are you a Developer?</h3>
    <p></p>
    It takes about five minutes to code your first Saito Application: <a href="https://org.saito.tech/" target="_saito">click here to learn how</a>. When you are done, publish your applications to the network for anyone to install and use:
    <p></p>
    <button id="appstore-publish-button">Publish Application</button>
  </div>

</div>
  `;
}
