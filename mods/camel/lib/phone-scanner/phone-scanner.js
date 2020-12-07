const PhoneScannerTemplate = require('./phone-scanner.template');


module.exports = PhoneScanner = {

  render(app, data) {
      if(document.querySelector('.phone-scanner')) {
        document.querySelector('.phone-scanner').destroy();
      }
      app.browser.addElementToDom(PhoneScannerTemplate());
      window.parent.postMessage("scanqr", '*');
  },

  attachEvents(app, data) {
    try {
      document.querySelector('.phone-scanner').addEventListener('change', () => {
//        alert('callback triggered');
//        alert("Callback = " + data.scanCallback);
        data.scanCallback(app, data, document.querySelector('.phone-scanner').value);
      });
    } catch (err) {
      alert(err);
    }
  }
}