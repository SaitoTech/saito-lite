var ModTemplate = require('../../lib/templates/modtemplate');

class Design extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Design";

    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  return obj;
    }

    return null;
  }

  renderEmail(app, data) {
     let DesignAppspace = require('./lib/email-appspace/design-appspace');
     DesignAppspace.render(app, data);
  }




}


module.exports = Design;