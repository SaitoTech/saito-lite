const AlauniusFormTemplate = require('./alaunius-form.template.js');
const AlauniusFormHeader = require("../../alaunius-header/alaunius-form-header/alaunius-form-header");

module.exports = AlauniusForm = {

    app: {***REMOVED***,
    saito: {***REMOVED***,
    alauniusList: {***REMOVED***,

    render(app, data={ alauniusList: {***REMOVED*** ***REMOVED***) {
        this.app = app;
        this.saito = this.app;

        document.querySelector(".alaunius-body").innerHTML = AlauniusFormTemplate();

        this.addData();
***REMOVED***,

    attachEvents(app, data) {
        document.querySelector('.alaunius-submit')
            .addEventListener('click', (e) => this.sendAlauniusTransaction(app, data));
***REMOVED***,


    addData() {
        document.getElementById('alaunius-from-address').value = `${this.saito.wallet.returnPublicKey()***REMOVED*** (me)`;
***REMOVED***,

    sendAlauniusTransaction(app, data) {

        let alaunius_title = document.querySelector('.alaunius-title').value;
        let alaunius_text = document.querySelector('.alaunius-text').value;
        let alaunius_to = document.getElementById('alaunius-to-address').value;
        let alaunius_from = this.saito.wallet.returnPublicKey();

        let newtx = app.wallet.createUnsignedTransactionWithDefaultFee(alaunius_to, 0.0);
        if (!newtx) {
          alert("Unable to send alaunius. You appear to need more tokens");
	  return
    ***REMOVED***

        newtx.transaction.msg.module   = "Alaunius";
        newtx.transaction.msg.title    = alaunius_title;
        newtx.transaction.msg.message  = alaunius_text;
        newtx = this.saito.wallet.signTransaction(newtx);

        app.network.propagateTransaction(newtx);

        data.parentmod.active = "alaunius_list";
        data.parentmod.main.render(app, data);
        data.parentmod.main.attachEvents(app, data);

        alert("Your message has been sent");

***REMOVED***,

    verifyJSON() {
      var message_input = document.querySelector('.raw-message');
      var str = message_input.value;
      try {
          JSON.parse(str);
  ***REMOVED*** catch (e) {
          message_input.style.background = "#FCC";
          message_input.style.color = "red";
          return false;
  ***REMOVED***
      message_input.style.background = "#FFF";
      message_input.style.color = "#000";
      return true;
***REMOVED***


***REMOVED***
