const ModTemplate = require('./modtemplate');

class GameTemplate extends ModTemplate {

  constructor(app) {
    super(app);
  }


  respondTo(type) {

    if (type == "arcade-gamelist") {
      let obj = {};
      obj.img = "/" + this.name.toLowerCase() + "/img/arcade.jpg";
      obj.render = this.renderArcade;
      obj.attachEvents = this.attachEventsArcade;
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

