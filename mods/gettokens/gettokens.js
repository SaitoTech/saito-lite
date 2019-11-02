var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const GetTokensAppspace = require('./lib/email-appspace/gettokens-appspace');

class GetTokens extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "GetTokens";

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

  renderEmail(app, data) {
     data.gettokens = app.modules.returnModule("GetTokens");
     GetTokensAppspace.render(app, data);
  }

  attachEventsEmail(app, data) {
     data.gettokens = app.modules.returnModule("GetTokens");
     GetTokensAppspace.attachEvents(app, data);
  }



  onConfirmation(blk, tx, conf, app) {

    let gettokens_self = app.modules.returnModule("GetTokens");

    if (conf == 0) {
    }

  }
}


module.exports = GetTokens;

