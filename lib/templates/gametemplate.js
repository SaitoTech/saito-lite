const ModTemplate = require('./modtemplate');

class GameTemplate extends ModTemplate {

  constructor(app) {
    super(app);
  ***REMOVED***


  respondTo(type) {

    if (type == "arcade_gamelist") {
      let obj = {***REMOVED***;
      obj.img = this.name.toLowerCase() + "/web/arcade.jpg";
      obj.render = renderArcade;
      obj.attachEvents = attachEventsArcade;
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

