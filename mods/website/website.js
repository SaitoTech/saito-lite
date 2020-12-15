var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const Data = require('./lib/data');


class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Website";

    this.description = "Module that creates a root website on a Saito node.";
    this.categories = "Utilities Communications";

    this.header = new SaitoHeader(this.app, this);

    return this;
  }



  initializeHTML(app) {

    //super.initializeHTML(app);

    this.header.render(app, this);
    this.header.attachEvents(app, this);

  }

}



module.exports = Website;
