const ModTemplate = require('./modtemplate');

class GameTemplate extends ModTemplate {

  constructor(app) {
    super(app);
  }


  respondTo(type) {

    if (type == "arcade_gamelist") {
      let obj = {};
      obj.img = this.name.toLowerCase() + "/web/arcade.jpg";
      obj.render = renderArcade;
      obj.attachEvents = attachEventsArcade;
      return obj;
    }

    return null;

  }

  renderArcade(app, data) {

  }

  attachEventsArcade(app, data) {

  }


}

module.exports = GameTemplate;

