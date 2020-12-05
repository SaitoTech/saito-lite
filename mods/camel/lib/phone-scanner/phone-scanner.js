const PhoneScannerTemplate = require('./phone-scanner.template');


module.exports = PhoneScanner = {

  render(app, data) {
      if(document.querySelector('.phone-scanner')) {
        document.querySelector('.phone-scanner').destroy();
      }
      app.browser.addElementToDom(PhoneScannerTemplate());
  },


  attachEvents(app, data) {

    try {
      document.querySelector('.phone-scanner').addEventListener('message', function(e) {
        data.scanCallback(e);
      });
    } catch (err) {}

  }

}