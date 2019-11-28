const AlauniusAppspaceHeaderTemplate = require('./alaunius-appspace-header.template');


module.exports = AlauniusAppspaceHeader = {
  render(app, data) {
    document.querySelector('.alaunius-header').innerHTML = AlauniusAppspaceHeaderTemplate(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('alaunius-form-back-button')
            .addEventListener('click', (e) => {
              data.parentmod.active = data.parentmod.previous_state;
              data.parentmod.previous_state = "alaunius_appspace";

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });
  },
}

