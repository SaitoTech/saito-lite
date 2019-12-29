var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');
const Data = require('./lib/data');


class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Website";

    return this;
  }


  initializeHTML(app) {

    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    Data.render(app);

  }

  onConfirmation(blk, tx, conf, app) {
    if (app.BROWSER == 1) Data.render(app)
  }

  shouldAffixCallbackToModule() { return 1; }

}



module.exports = Website;
