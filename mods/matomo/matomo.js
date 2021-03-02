var ModTemplate = require('../../lib/templates/modtemplate');
var {addToDOM, logToMatomo} = require('./matomoHelpers.js');

class Matomo extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Matomo";
    this.description     = "Saito tracking tag";
    this.categories      = "Marketing";
    
    //this.browserize(this);
    this.alreadyAdded = false;
    return this;
  }
  
  initialize(app) {
    super.initialize(app);
    // This module should only be installed on the client, but let's not break
    // things in case someone installs it on the server.
    if (app.BROWSER) {
      // It shouldnt' be necessary to track alreadyAdded but let's do it anyway
      // just to be 100% sure the tracking isn't inserted multiple times.
      if(!this.alreadyAdded) {
        this.alreadyAdded = true;
        addToDOM();
      }
    }
  }
  
  respondTo(type) {
    if (type == "matomo_event_push") {
      let obj = {};
      obj.push = logToMatomo;
      return obj;
    }
    return null;
  }
}
module.exports = Matomo;
