const PhoneAppTemplate = require('./phone-app.template');
const PhoneScanner = require('../phone-scanner/phone-scanner');


module.exports = PhoneApp = {

  render(app, data) {
    document.querySelector(".main").innerHTML = PhoneAppTemplate();

  },

  attachEvents(app, data) {

    //set the callback we want for this scan
    data.scanCallback = this.handleScanPayload;

    //add event to tell the scaner what to do
    //with the call back attached
    document.querySelector(".scan-now").attachEventListerner("click", () =>{
        //bring up scaner
        PhoneScanner.render(app, data);
        PhoneScanner.attachEvents(app, data);
    });

  },
  //the relevant callback
  handleScanPayload(p) {
    if(document.querySelector('.results')) {
        document.querySelector('.results').innerHTML = p;
    }
  }

}