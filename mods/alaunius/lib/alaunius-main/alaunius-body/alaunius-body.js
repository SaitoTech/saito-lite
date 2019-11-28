const AlauniusForm          = require('./alaunius-form/alaunius-form');
const AlauniusDetail        = require('./alaunius-detail/alaunius-detail');
const AlauniusAppspace         = require('./alaunius-appspace/alaunius-appspace');
const AlauniusAppspaceTemplate = require('./alaunius-appspace/alaunius-appspace.template.js');
const AlauniusListTemplate     = require('./alaunius-list/alaunius-list.template.js');


module.exports = AlauniusBody = {

    app: {***REMOVED***,

    render(app, data={***REMOVED***) {

        data.parentmod.body = this;

        switch(data.parentmod.active) {
            case "alaunius_list":
                AlauniusList.render(app, data);
                AlauniusList.attachEvents(app, data);
                break;
            case "alaunius_form":
                AlauniusForm.render(app, data);
                AlauniusForm.attachEvents(app, data);
                break;
            case "alaunius_detail":
                AlauniusDetail.render(app, data);
                AlauniusDetail.attachEvents(app, data);
                break;
            case "alaunius_appspace":
                document.querySelector('.alaunius-body').innerHTML = AlauniusAppspaceTemplate();
                AlauniusAppspace.render(app, data);
                AlauniusAppspace.attachEvents(app, data);
                break;
            default:
                break;
    ***REMOVED***
***REMOVED***,

    attachEvents(app, data) {
        document.querySelector('#alaunius.create-button')
                .addEventListener('click', (e) => {
                    data.parentmod.active = "alaunius_form";
                    data.parentmod.previous_state = "alaunius_list";
                    data.parentmod.main.render(app, data);
                    data.parentmod.main.attachEvents(app, data);
            ***REMOVED*** document.querySelector('#alaunius.create-button').style.display = "none";
            ***REMOVED***);
***REMOVED***
***REMOVED***

