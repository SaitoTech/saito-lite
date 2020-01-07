const MyQRCodeAppspace = require('./lib/email-appspace/myqrcode-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class MyQRCodes extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "MyQRCode";
    this.link           = "/email?module=myqrcode";

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


