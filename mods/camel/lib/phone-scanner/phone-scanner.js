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
    alert("Callback = " + data.scanCallback);
    
    /*
    try {
      document.querySelector('.phone-scanner').addEventListener('message', function(e) {
        data.scanCallback(e);
      });
    } catch (err) {
      alert(err);
    }*/
    
    window.addEventListener('message', function(e) {
      //alert("message is: " + e.data);
      data.scanCallback(JSON.stringify(e.data));
    }, false);
    
  }

}