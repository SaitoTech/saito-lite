const AlauniusMainTemplate = require('./alaunius-main.template');
const AlauniusHeader = require('./alaunius-header/alaunius-header');
const AlauniusBody = require('./alaunius-body/alaunius-body');

module.exports = AlauniusMain = {

  render(app, data) {

    let alaunius_main = document.querySelector(".alaunius-main");
    if (!alaunius_main) { return; }
    alaunius_main.innerHTML = AlauniusMainTemplate();

    data.parentmod.main = this;

    AlauniusHeader.render(app, data);
    AlauniusBody.render(app, data);

  },

  attachEvents(app, data) {
    AlauniusHeader.attachEvents(app, data);
    AlauniusBody.attachEvents(app, data);
  }

}
