module.exports = AppStorePublishTemplate = () => {
  return `
    <link rel="stylesheet" href="/appstore/css/email-appspace.css" />

    <div style="font-size:1.2em;margin-top:20px;">

    <h2>Install Applications:</h2>

    To install applications <span style="color: var(--saito-red); cursor:pointer;" class="appstore-browse-btn">launch the Saito Appstore</span> and find and install new applications.

    <p><br/></p>

    <h2>Deploy Applications:</h2>

    Our <span style="color: var(--saito-red); cursor:pointer;" class="appstore-developer-center">developer center</span> has tutorials and documentation for deploying Saito applications. Once you have build an application, come back here and upload it to the network using the file-uploader below. It takes about 5 minutes to get your first application running on the network.:

    </div>

    <p></p>

    <div class="appstore-publish-moddrop" id="appstore-publish-moddrop" style="display:block">
      <div id="appstore-publish-moddrop-inside">
       Drag-and-Drop Application ZIP
      </div>
    </div>
    <form id="appstore-publish-form">
      <label>or select zip-file from disk: <input id="appstore-publish-module" type="file" /></label>
      <div class="submit-file-btn-box" style="display:none">
        <button type="submit" id="submit-file-btn">SUBMIT</button>
      </div>
    </form>
  `
}
