module.exports = AppStorePublishWaiting = (app) => {  

  let html = `

    <div class="appstore-app-install-overlay">
      <div class="appstore-bundler-install-notice">
        <center class="appstore-loading-text" style="margin-bottom:20px">
	  Waiting for your AppStore to index your applications</Your custom Saito bundle is being compiled. Please do not leave this page.
        </center>
        <center><div class="loader" id="game_spinner">
      </div>
    </div>

    <style type="text/css">

    </style>

  `;

  return html;

}


