const AppStorePublishTemplate = require('./appstore-publish.template');
const AppStorePublishSuccess = require('./appstore-publish-success/appstore-publish-success');

module.exports = AppStorePublish = {
  render(app, data) {
    document.querySelector(".email-appspace")
            .innerHTML = AppStorePublishTemplate();
    //zip.workerScriptsPath = '/saito/lib/zip/';
  },

  attachEvents(app, data) {

    data.publish = {};

    let appstore_self = this;
    document.getElementById('appstore-publish-module')
            .onchange = async function(e) {


              let selectedFile = this.files[0];
              //
              // basic sanity check
              //
              if (selectedFile.type !== "application/zip") {
                salert('Incorrect File Type, please submit a zip file');
                return;
              } else {
                var base64_reader = new FileReader();
                var zip_reader = new FileReader();
                let indexFileBlob = await appstore_self.unzipBlob(selectedFile);

                zip_reader.readAsText(indexFileBlob);
                base64_reader.readAsDataURL(selectedFile);
              }

              zip_reader.onload = function() {
                let text = zip_reader.result;
                //
                // get name and description
                let getNameRegex = RegExp('[\n\r]*this.name\s*([^\n\r]*)');
                let getDescriptionRegex = RegExp('[\n\r]*this.description\s*([^\n\r]*)');
                let cleanupRegex = RegExp('=(.*)');

                let nameMatch = text.match(getNameRegex);
                let descriptionMatch = text.match(getDescriptionRegex);

                data.publish = {
                  name: cleanString(nameMatch[0].match(cleanupRegex)[1]),
                  description: cleanString(descriptionMatch[0].match(cleanupRegex)[1])
                };

                function cleanString(str) {
                  str = str.substring(0, str.length - 1);
                  return [...str].map(char => {
                    if (char == "\'" || char == "\"" || char == ";") return ''
                    return char
                  }).join('');
                }
              }

              base64_reader.onload = () => data.publish.zip = base64_reader.result;
            }

    document.getElementById('appstore-publish-form')
            .onsubmit = (e) => {

              e.preventDefault();

              if (data.publish.zip) {

                //
                // Name + Description
                // reg.search()
                //

                let newtx = this.createPublishTX(app, data);
                app.network.propagateTransaction(newtx);
                //
                // TODO:
                // convert this to main one way data flow structure like email
                //
                AppStorePublishSuccess.render();
                AppStorePublishSuccess.attachEvents();
              } else {
                alert("Please attach a zip file of your module");
              }
            }
  },

  createPublishTX(app, { publish }) {
    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
    let { name, description, zip } = publish;
    newtx.transaction.msg = {
      module: "AppStore",
      request: "submit module",
      name: name,
      description: description,
      module_zip: zip,
    };
    return app.wallet.signTransaction(newtx);
  },

  unzipBlob(selected_file) {
    return new Promise((resolve, reject) => {
      // use a zip.BlobReader object to read zipped data stored into blob variable
      zip.createReader(new zip.BlobReader(selected_file), function(zipReader) {
        // get entries from the zip file
        zipReader.getEntries(function(entries) {
          // get data from the first file
          entries[1].getData(new zip.BlobWriter("text/plain"), function(data) {
            // close the reader and calls callback function with uncompressed data as parameter
            zipReader.close();
            resolve(data);
          });
        });
      }, onerror);
    });
  }
}
