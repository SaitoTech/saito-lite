var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const ImageAppspace = require('./lib/email-appspace/image-appspace');




class ImageCVTR extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "ImageCVTR";
    this.description    = "Utility plugin for converting images to inline-includable base64 strings";
    this.categories     = "Utilities Apps";
    return this;

  }




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
    }

    return null;
  }

  renderEmail(app, mod) {
    ImageAppspace.render(app, mod);
  }

  attachEventsEmail(app, mod) {
    ImageAppspace.attachEvents(app, mod);
  }


}

module.exports = ImageCVTR;


