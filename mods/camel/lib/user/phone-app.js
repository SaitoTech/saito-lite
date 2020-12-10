const PhoneAppTemplate = require('./phone-app.template');
const PhoneScanner = require('../phone-scanner/phone-scanner');
const PhoneScanReturn = require('./phone-scan-return');


module.exports = PhoneApp = {

  render(app, data) {
    document.querySelector(".main").innerHTML = PhoneAppTemplate();

  },

  attachEvents(app, data) {
    console.log('attaching event to scan button');
    //set the callback we want for this scan
    data.scanCallback = this.handleScanPayload;

    //add event to tell the scaner what to do
    //with the call back attached
    document.querySelector("#scan-now").addEventListener("click", () => {
      //alert('imma gunna scan');
      //bring up scaner
      PhoneScanner.render(app, data);
      PhoneScanner.attachEvents(app, data);
    });

  },
  //the relevant callback
  handleScanPayload(app, data, p) {
    //alert("handleScanPayload running");
    data.query = JSON.parse('{"' + p.split("?")[1].replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) });
    //alert("rendering: " + JSON.stringify(data.query));
    PhoneScanReturn.render(app, data);
    PhoneScanReturn.attachEvents(app, data);
  }
}