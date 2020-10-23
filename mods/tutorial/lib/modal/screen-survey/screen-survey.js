const ScreenSurveyTemplate = require('./screen-survey.template.js');
const UAParser = require('ua-parser-js');

module.exports = ScreenSurvey = {
  render(app, data) {
    if (document.querySelector('#screen-survey-modal-content')) {
      //document.querySelector('.document-modal-content').innerHTML = ScreenSurveyTemplate();

     //borrowed from: https://codepen.io/oferw/pen/YzzJvLY
        var infoSections = [];
        var parser = new UAParser();
        var userOs = parser.getOS();
        var userDevice = parser.getDevice();
        var userBrowser = parser.getBrowser();
        var debugContainer = document.querySelector('.agent-data');
      
        if (userOs && userOs.name && userOs.version) {
          infoSections.push({ name: 'OS', value: userOs.name + ' ' + userOs.version});
        }
      
        if (userBrowser && userBrowser.name && userBrowser.version) {
          infoSections.push({ name: 'Browser', value: userBrowser.name + ' ' + userBrowser.version});
        }
      
        if (userDevice && userDevice.vendor && userDevice.model) {
          infoSections.push({ name: 'Device', value: userBrowser.vendor + ' ' + userBrowser.model});
        } else {
          infoSections.push({ name: 'Device', value: 'N/A'});
        }
      
        if (window) {
          if (window.screen) {
            infoSections.push({ name: 'Screen resolution', value: window.screen.width + 'x' + window.screen.height});
            infoSections.push({ name: 'Available screen space', value: window.screen.availWidth + 'x' + window.screen.availHeight});
          }
      
          infoSections.push({ name: 'Browser window size', value: window.innerWidth + 'x' + window.innerHeight});
          infoSections.push({ name: 'Device pixel ratio', value: window.devicePixelRatio });
        }
      
        //Old-school JS without jQuery or another framework, just for fun
        while (debugContainer.hasChildNodes()) {
          debugContainer.removeChild(debugContainer.lastChild);
        }
      
        for (var i = 0; i < infoSections.length; i++) {
          var debugName = document.createElement("div");
          debugName.setAttribute("class", "debug-name");
          debugName.appendChild(document.createTextNode(infoSections[i].name));
          var debugValue = document.createElement("input");
          debugValue.setAttribute("class", "debug-value");
          debugValue.setAttribute("type", "text");
          debugValue.setAttribute("id", infoSections[i].name);
          debugValue.setAttribute("name", infoSections[i].name);
          debugValue.value = infoSections[i].value; 

          debugContainer.appendChild(debugName);
          debugContainer.appendChild(debugValue);
        }
     

      //document.querySelector('#empty_form_data').innerHTML = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#screen-survey_form'))));
    }
  },

  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {
      data.modal.destroy();
    }

    document.querySelector('#screen-survey-modal-button').onclick = () => {

      let screenSurveyData = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#screen-survey_form'))));

      if(screenSurveyData != document.querySelector('#empty_form_data').innerHTML) {
        let subs = {
          key: app.wallet.returnPublicKey(),
          survey_data: screenSurveyData,
          time: Date.now()
        };
        app.network.sendRequest('screen survey', subs);
        console.log('user screen-survey complete');
        data.modal.destroy();
      } else {
        salert('Please fill in some data, or cancel.')
      }
    }
  }
}