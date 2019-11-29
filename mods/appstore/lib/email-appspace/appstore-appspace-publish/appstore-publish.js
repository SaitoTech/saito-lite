const AppStorePublishTemplate = require('./appstore-publish.template');
const AppStorePublishSuccess = require('./appstore-publish-success/appstore-publish-success');

module.exports = AppStorePublish = {
  render(app, data) {
    document.querySelector(".email-appspace")
            .innerHTML = AppStorePublishTemplate();
    zip.workerScriptsPath = '/saito/lib/zip/';
  ***REMOVED***,

  attachEvents(app, data) {
    let appstore_self = this;
    document.getElementById('appstore-publish-module')
            .onchange = async function(e) {
              data.publish = {***REMOVED***;

              let selectedFile = this.files[0];
      ***REMOVED***
      ***REMOVED*** basic sanity check
      ***REMOVED***
              if (selectedFile.type !== "application/zip") {
                salert('Incorrect File Type, please submit a zip file');
                return;
          ***REMOVED*** else {
                var base64_reader = new FileReader();
                var zip_reader = new FileReader();
                let indexFileBlob = await appstore_self.unzipBlob(selectedFile);

                zip_reader.readAsText(indexFileBlob);
                base64_reader.readAsDataURL(selectedFile);
          ***REMOVED***

              zip_reader.onload = function() {
                let text = zip_reader.result;
        ***REMOVED***
        ***REMOVED*** get name and description
                let getNameRegex = RegExp('[\n\r]*this.name\s*([^\n\r]*)');
                let getDescriptionRegex = RegExp('[\n\r]*this.description\s*([^\n\r]*)');
                let cleanupRegex = RegExp('=(.*)');

                let nameMatch = text.match(getNameRegex);
                let descriptionMatch = text.match(getDescriptionRegex);

                data.publish = {
                  name: cleanString(nameMatch[0].match(cleanupRegex)[1]),
                  description: cleanString(descriptionMatch[0].match(cleanupRegex)[1])
            ***REMOVED***;

                function cleanString(str) {
                  str = str.substring(0, str.length - 1);
                  return [...str].map(char => {
                    if (char == "\'" || char == "\"" || char == ";") return ''
                    return char
              ***REMOVED***).join('');
            ***REMOVED***
          ***REMOVED***

              base64_reader.onload = () => data.publish.zip = base64_reader.result;
        ***REMOVED***

    document.getElementById('appstore-publish-form')
            .onsubmit = (e) => {
              e.preventDefault();
              if (data.publish.zip) {

        ***REMOVED***
        ***REMOVED*** Name + Description
        ***REMOVED*** reg.search()
        ***REMOVED***

                let newtx = this.createPublishTX(app, data);
                app.network.propagateTransaction(newtx);
        ***REMOVED***
        ***REMOVED*** TODO:
        ***REMOVED*** convert this to main one way data flow structure like email
        ***REMOVED***
                AppStorePublishSuccess.render();
                AppStorePublishSuccess.attachEvents();
          ***REMOVED*** else {
                salert("Please attach a zip file of your module");
          ***REMOVED***
        ***REMOVED***
  ***REMOVED***,

  createPublishTX(app, { publish ***REMOVED***) {
    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
    let { name, description, zip ***REMOVED*** = publish;
    newtx.transaction.msg = {
      module: "AppStore",
      request: "submit module",
      name: name,
      description: description,
      module_zip: zip,
***REMOVED***;
    return app.wallet.signTransaction(newtx);
  ***REMOVED***,

  unzipBlob(selected_file) {
    return new Promise((resolve, reject) => {
      // use a zip.BlobReader object to read zipped data stored into blob variable
      zip.createReader(new zip.BlobReader(selected_file), function(zipReader) {
***REMOVED*** get entries from the zip file
        zipReader.getEntries(function(entries) {
  ***REMOVED*** get data from the first file
          entries[1].getData(new zip.BlobWriter("text/plain"), function(data) {
    ***REMOVED*** close the reader and calls callback function with uncompressed data as parameter
            zipReader.close();
            resolve(data);
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***, onerror);
***REMOVED***);
  ***REMOVED***
***REMOVED***