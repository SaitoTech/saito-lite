module.exports = AppStoreAppspaceTemplate = () => {
  return `
<div class="email-appspace-appstore">
  <h2>Submit Module to AppStore</h2>
  <div>
    <h4>Please attach your Saito module as a ZIP file:</h4>
  </div>
  <fieldset>
  <div class="grid-2">
	<div>File:</div>
	<div>
	<input type="hidden" name="module-file" id="module-file" />
          <input type="file" id="module-file-upload-btn" multiple accept="*" />
    </div>
  </div>
  <button class="button inactive" id="appstore-submit">Upload to Network</button>
  <p>
	  <h5>Uploading a module automatically submits it to all listening AppStores on the Saito network.</h5>
  </p>
  </fieldset>
</div>
<hr />

  `;
}
