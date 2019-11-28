const AlauniusForm = require('../../alaunius-body/alaunius-list/alaunius-list');
const AlauniusDetailHeaderTemplate = require('./alaunius-detail-header.template');

module.exports = AlauniusDetailHeader = {

  render(app, data) {
    document.querySelector('.alaunius-header').innerHTML = AlauniusDetailHeaderTemplate(app, data);
  },

  attachEvents(app, data) {

    document.getElementById('alaunius-form-back-button')
            .addEventListener('click', (e) => {

              // data.parentmod.alaunius.active = "inbox";
              data.parentmod.active = "alaunius_list";
              data.parentmod.selected_alaunius = {};

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });

    document.getElementById('alaunius-delete-icon')
            .addEventListener('click', (e) => {
              // delete the alaunius from the alauniuslist
              data.parentmod.deleteTransaction(data.parentmod.selected_alaunius);

              data.parentmod.alaunius.active = "inbox";
              data.parentmod.active = "alaunius_list";
              data.parentmod.selected_alaunius = {};

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });

    document.getElementById('alaunius-detail-reply')
            .addEventListener('click', (e) => {
              let { from } = data.parentmod.selected_alaunius.transaction;
              data.parentmod.previous_state = data.parentmod.active;
              data.parentmod.active = "alaunius_form";
              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
              document.getElementById('alaunius-to-address').value = from[0].add;
            });

    document.getElementById('alaunius-detail-forward')
            .addEventListener('click', (e) => {
              let { msg } = data.parentmod.selected_alaunius.transaction;
              data.parentmod.previous_state = data.parentmod.active;
              data.parentmod.active = "alaunius_form";
              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
              document.querySelector('.alaunius-title').value = msg.title;
              document.querySelector('.alaunius-text').value = msg.message;
            });
  }
}
