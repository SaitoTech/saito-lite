//const DesignAppspace = require('./lib/email-appspace/design-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Design extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Design";

    return this;
  ***REMOVED***




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  return obj;
***REMOVED***

    return null;
  ***REMOVED***

  renderEmail(app, data) {
     let DesignAppspace = require('./lib/email-appspace/design-appspace');
     DesignAppspace.render(app, data);
  ***REMOVED***




***REMOVED***


module.exports = Design;