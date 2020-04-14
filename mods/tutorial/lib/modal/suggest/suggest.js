const SuggestTemplate = require('./suggest.template.js');

module.exports = Suggest = {
  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = SuggestTemplate();
      document.querySelector('#empty_form_data').innerHTML = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#suggest_form'))));
    }
  },

  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {
      data.modal.destroy();
    }

    document.querySelector('#suggest-modal-button').onclick = () => {

      let suggestData = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#suggest_form'))));

      if(suggestData != document.querySelector('#empty_form_data').innerHTML) {
        let subs = {
          key: app.wallet.returnPublicKey(),
          suggest_data: suggestData,
          time: Date.now()
        };
        console.log('suggestion sent');
        app.network.sendRequest('user suggest', subs);
        data.modal.destroy();
      } else {
        salert('Please fill in some data, or cancel.')
      }
    }
  }
}