const ImageAppspaceTemplate = require('./image-appspace.template.js');


module.exports = ImageAppspace = {

  render(app, mod) {
    document.querySelector(".email-appspace").innerHTML = ImageAppspaceTemplate();
  },

  attachEvents(app, mod) {

    app.browser.addDragAndDropFileUploadToElement('image-text-input', function(fileres) {
      document.querySelector(".image-text-output").innerHTML = fileres;
    }, true);

  }

}


