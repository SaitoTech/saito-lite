const AlauniusDetailTemplate = require('./alaunius-detail.template');

module.exports = AlauniusDetail = {

  render(app, data) {
    let alaunius_body = document.querySelector('.alaunius-body')
    //alaunius_body.innerHTML = AlauniusDetailTemplate(app, data, data.parentmod.selected_alaunius);
    alaunius_body.innerHTML = AlauniusDetailTemplate(app, data);
  ***REMOVED***,

  attachEvents(app, data) {***REMOVED***

***REMOVED***
