const AddLogTemplate = require('./add-log.template');

module.exports = AddLog = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AddLogTemplate();

    data.covid19.returnFormFromPragma("covid19", "log", function (res) {
      document.querySelector('.modal-form').innerHTML = res;

      document.getElementById('ts').value = new Date().getTime();
      data.covid19.treatHide(document.getElementById('ts'));

      document.getElementById('author').value = app.wallet.returnPublicKey();
      data.covid19.treatHide(document.getElementById('author'));

      document.getElementById('order_id').value = data.order_id;
      data.covid19.treatHide(document.getElementById('order_id'));

      if (data.covid19.isAdmin()) {
        data.covid19.treatBoolean(document.getElementById('public'));
      } else {
        data.covid19.treatHide(document.getElementById('public'));
      }

      document.getElementById('type').value = 'html';
      data.covid19.treatHide(document.getElementById('type'));

      data.covid19.treatTextArea(document.getElementById('body'));
      document.getElementById('body').parentElement.previousElementSibling.innerHTML = "Message";

    });


  },

  attachEvents(app, data) {

    document.getElementById('add-log').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.log-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-log').addEventListener('click', (e) => {
      document.querySelector('.log-template').destroy();
    });

  }
}