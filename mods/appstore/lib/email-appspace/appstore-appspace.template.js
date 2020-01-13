module.exports = AppStoreAppspaceTemplate = () => {

  return `
<link rel="stylesheet" type="text/css" href="/appstore/css/email-appspace.css">

<div class="appspace-appstore-container">

  <div class="appstore-header-featured grid-2">
    <div>Your Applications:</div>
    <div class="searchbox">
        <input type="text" placeholder="search for apps..." id="appstore-search-box">
    </div>

  </div>

  <div class="appstore-installed-apps"></div>
  
  <div class="app-space">

    <div class="appstore-categories-wrapper">

    <h4>Categories
        <div class="app-category-checkbox app-category-all">
          <label class="s-container">All
            <input type="checkbox" name="app-all" id="app-all" />
            <span class="s-checkmark"></span>
          </label>
        </div>
      </h4>

      <div class="appstore-categories"></div>

      </div>

    <div class="appstore-app-list"></div>

  </div>

  <fieldset class="appstore-publish">
    <h3>Are you a Developer?</h3>
    <p>
      It takes about five minutes to code your first Saito Application: <a href="https://org.saito.tech/developers" target="_saito">click here to learn how</a>.
    </p>
    <p>
      When you are done, publish your applications to the network for anyone to install and use:
    </p>
    <button id="appstore-publish-button">Publish Application</button>
  </fieldset>

</div>
  `;
}
