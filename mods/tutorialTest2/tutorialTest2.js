var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial02 extends ModTemplate { 
  constructor(app) {
     super(app);
     this.name            = "Tutorial02";
     this.description     = "Chat notification service that triggers on receipt of an email"; 
     this.categories      = "Tutorials";
     return this;
  }
  shouldAffixCallbackToModule(modname, tx) {
    if (modname == "Email") { return 1; }
  return 0;
} 
}
module.exports = Tutorial02;