const SurveyTemplate = require('./survey.template.js');

module.exports = Survey = {
  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = SurveyTemplate();
      document.querySelector('#empty_form_data').innerHTML = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#survey_form'))));
    }
  },

  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {
      data.modal.destroy();
    }

    document.querySelector('#survey-modal-button').onclick = () => {

      let surveyData = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#survey_form'))));

      if(surveyData != document.querySelector('#empty_form_data').innerHTML) {
        let subs = {
          key: app.wallet.returnPublicKey(),
          survey_data: surveyData,
          time: Date.now()
        };
        app.network.sendRequest('user survey', subs);
        console.log('user survey complete');
        data.modal.destroy();
      } else {
        salert('Please fill in some data, or cancel.')
      }
    }
  }
}