const AlauniusInboxHeader = require('./alaunius-inbox-header/alaunius-inbox-header');
const AlauniusDetailHeader = require('./alaunius-detail-header/alaunius-detail-header');
const AlauniusFormHeader = require('./alaunius-form-header/alaunius-form-header');
const AlauniusAppspaceHeader = require('./alaunius-appspace-header/alaunius-appspace-header');

module.exports = AlauniusHeader = {

  render(app, data) {

    data.parentmod.header = this;

    switch(data.parentmod.active) {
      case "alaunius_list":
        AlauniusInboxHeader.render(app, data);
        AlauniusInboxHeader.attachEvents(app, data);
        break;
      case "alaunius_detail":
        AlauniusDetailHeader.render(app, data);
        AlauniusDetailHeader.attachEvents(app, data);
        break;
      case "alaunius_form":
        AlauniusFormHeader.render(app, data);
        AlauniusFormHeader.attachEvents(app, data);
        break;
      case "alaunius_appspace":
        AlauniusAppspaceHeader.render(app, data);
        AlauniusAppspaceHeader.attachEvents(app, data);
        break;
      default:
        break;
***REMOVED***

    data.parentmod.updateBalance();

  ***REMOVED***,

  attachEvents(app, data) {***REMOVED***,

***REMOVED***
