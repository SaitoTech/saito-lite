var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const GetTokensAppspace = require('./lib/email-appspace/gettokens-appspace');

class GetTokens extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "GetTokens";

    return this;
  ***REMOVED***



  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***

    return null;
  ***REMOVED***

  renderEmail(app, data) {
     data.gettokens = app.modules.returnModule("GetTokens");
     GetTokensAppspace.render(app, data);
  ***REMOVED***

  attachEventsEmail(app, data) {
     data.gettokens = app.modules.returnModule("GetTokens");
     GetTokensAppspace.attachEvents(app, data);
  ***REMOVED***



  onConfirmation(blk, tx, conf, app) {

    let gettokens_self = app.modules.returnModule("GetTokens");

    if (conf == 0) {
***REMOVED***

  ***REMOVED***
***REMOVED***


module.exports = GetTokens;

