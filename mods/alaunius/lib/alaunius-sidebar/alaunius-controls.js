const AlauniusControlsTemplate = require('./alaunius-controls.template');
const AlauniusHeader = require('../alaunius-main/alaunius-header/alaunius-header');
const AlauniusBarsMenu = require('./alaunius-bars-menu');

module.exports = AlauniusControls = {

    render(app, data) {
        document.querySelector(".alaunius-controls").innerHTML = AlauniusControlsTemplate();
        AlauniusBarsMenu.render(app, data);
***REMOVED***,

    attachEvents(app, data) {
        AlauniusBarsMenu.attachEvents(app, data);

        let compose_button = document.getElementById('alaunius-compose-btn');
            compose_button.addEventListener('click', (e) => {

                data.parentmod.active = "alaunius_form";
                data.parentmod.previous_state = "alaunius_list";
                data.parentmod.header_title = "Compose Alaunius";

                data.parentmod.main.render(app, data);
                data.parentmod.main.attachEvents(app, data);
        ***REMOVED***);
***REMOVED***

***REMOVED***
