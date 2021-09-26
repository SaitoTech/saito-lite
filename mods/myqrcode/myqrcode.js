const MyQRCodeAppspace = require('./lib/email-appspace/myqrcode-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class MyQRCodes extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "MyQRCode";
    this.description	= "Displays your QRcode as an option in the top menu for easy scanning by other users";
    this.categories     = "Core Utilities";
    this.link           = "/email?module=myqrcode";

    this.description = "QR Code display utility for Saito"
    this.categories  = "UI Utilities";

    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
     	    MyQRCodeAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
     	    MyQRCodeAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }

}







module.exports = MyQRCodes;


