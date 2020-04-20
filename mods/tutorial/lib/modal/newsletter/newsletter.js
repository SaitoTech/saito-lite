const NewsletterTemplate = require('./newsletter.template.js');

module.exports = Suggest = {
  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = NewsletterTemplate();
      document.querySelector('#empty_form_data').innerHTML = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#newsletter_form'))));
    }
  },

  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {
      data.modal.destroy();
    }

    document.querySelector('#newsletter-modal-button').onclick = () => {

      let newsletterData = JSON.stringify(Object.fromEntries(new FormData(document.querySelector('#newsletter_form'))));

      if(newsletterData != document.querySelector('#empty_form_data').innerHTML) {
        let subs = {
          key: app.wallet.returnPublicKey(),
          email_data: newsletterData,
          time: Date.now()
        };

        app.network.sendRequest('user newsletter', subs);
        data.modal.destroy();
      } else {
        salert('Please fill in some data, or cancel.')
      }
    }
  }
}
