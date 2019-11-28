const AlauniusSidebarTemplate 	= require('./alaunius-sidebar.template.js');
const AlauniusControls 		= require('./alaunius-controls.js');
const AlauniusChat 		= require('./alaunius-chat.js');


module.exports = AlauniusSidebar = {

    render(app, data) {
      document.querySelector(".alaunius-sidebar").innerHTML = AlauniusSidebarTemplate();
      AlauniusControls.render(app, data);
      AlauniusChat.render(app, data);
***REMOVED***,

    attachEvents(app, data) {
      AlauniusControls.attachEvents(app, data);
      AlauniusChat.attachEvents(app, data);
***REMOVED***

***REMOVED***



