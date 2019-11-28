const AlauniusFormHeaderTemplate = require('./alaunius-form-header.template');

module.exports = AlauniusFormHeader = {

  render(app, data) {
    document.querySelector('.alaunius-header').innerHTML = AlauniusFormHeaderTemplate(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('alaunius-form-back-button')
            .addEventListener('click', (e) => {
              data.parentmod.active = data.parentmod.previous_state;
              data.parentmod.previous_state = "alaunius_form";

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });
  }
}
