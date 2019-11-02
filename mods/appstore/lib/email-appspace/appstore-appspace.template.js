module.exports = AppStoreAppspaceTemplate = () => {
  return `

      <div class="email-appspace-appstore">

	<h2>Submit Module to AppStore</h2>

	<div>

	  Please attach your Saito module as a ZIP file:

	  <p></p>

	  <input type="hidden" name="module-file" id="module-file" />
          <input type="file" id="module-file-upload-btn" multiple accept="*" />

	  <p></p>

	  <button class="button inactive" id="appstore-submit">Upload to Network</button>

	  <p></p>

	  Uploading a module automatically submits it to all listening AppStores on the Saito network.

      </div>
  `;
***REMOVED***
