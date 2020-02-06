module.exports = AppStorePublishTemplate = () => {
  return `
    <link rel="stylesheet" href="/appstore/css/email-appspace.css" />
    <div class="appstore-publish-moddrop" id="appstore-publish-moddrop" style="display:none">
      <div id="appstore-publish-moddrop-inside">
       Drag ZIP File Here
      </div>
    </div>
    <form id="appstore-publish-form">
      <label>Select ZIP file from disk: <input id="appstore-publish-module" type="file" /></label>
      <div class="submit-file-btn-box" style="display:none">
        <button type="submit" id="submit-file-btn">SUBMIT</button>
      </div>
    </form>
  `
}
