module.exports = AppStorePublishTemplate = () => {
  return `
    <div class="appstore-publish-moddrop" id="appstore-publish-moddrop">
      <div id="appstore-publish-moddrop-insde">
       Drag ZIP File Here
      </div>
    </div>
    <form id="appstore-publish-form">
      <label>or select file from disk: <input id="appstore-publish-module" type="file" /></label>
      <div class="submit-file-btn-box">
        <button type="submit" id="submit-file-btn">SUBMIT</button>
      </div>
    </form>
  `
}
