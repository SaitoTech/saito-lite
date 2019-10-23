const ModTemplate = require('./modtemplate');

class GameTemplate extends ModTemplate {

  constructor(app) {
    super(app);
  ***REMOVED***


  respondTo(type) {

    if (type == "arcade-gamelist") {
      let obj = {***REMOVED***;
      obj.img = "/" + this.name.toLowerCase() + "/img/arcade.jpg";
      obj.render = this.renderArcade;
      obj.attachEvents = this.attachEventsArcade;
      return obj;
***REMOVED***

    return null;

  ***REMOVED***

  renderArcade(app, data) {

  ***REMOVED***

  attachEventsArcade(app, data) {

  ***REMOVED***


***REMOVED***

module.exports = GameTemplate;

