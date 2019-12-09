const axios = require('axios');

const RegistryModalTemplate = require('./registry-modal.template');
const RegistrySuccessModalTemplate = require('./registry-modal-success.template');
const elParser = require('../../../../lib/helpers/el_parser');

module.exports = RegistryModal = {
  render(app, data) {
    if (!document.getElementById('registry-modal')) {
      document.querySelector('body').append(
        elParser(RegistryModalTemplate())
      )
***REMOVED***
    document.getElementById('registry-modal').style.display = "block";
  ***REMOVED***,

  attachEvents(app, data) {
    var modal = document.getElementById('registry-modal');

    document.getElementById("modal-close")
            .onclick = () => modal.style.display = "none";

    let registry_input = document.getElementById('registry-input')
    registry_input.onfocus = () => registry_input.placeholder = '';
    registry_input.onblur = () => registry_input.placeholder = 'Username';


    let registry_button = document.getElementById('registry-add-button');
    if (registry_button)
      registry_button.onclick = () => {
      ***REMOVED***
      ***REMOVED*** register name
      ***REMOVED***
              let identifier = document.getElementById('registry-input').value
              let registry_success = app.modules.returnModule("Registry").registerIdentifier(identifier);

              if (registry_success) {
                Array.from(document.getElementsByClassName('saito-identifier'))
                     .forEach(elem => {
                       elem.innerHTML = `<h3>${identifier***REMOVED***@saito</h3>`
                 ***REMOVED***)
        ***REMOVED***
        ***REMOVED*** show success modal
        ***REMOVED***
        ***REMOVED*** Add email capture and links to discord and Telegram
        ***REMOVED***
                modal.innerHTML = RegistrySuccessModalTemplate();
                this.attachEvents(app, data);
          ***REMOVED***

        ***REMOVED***;

      let email_button = document.getElementById('registry-email-button')
      if (email_button)
        email_button.onclick = async () => {
  ***REMOVED*** let email_addr = document.getElementById('registry-input').value;
  ***REMOVED*** if (email_addr) {
  ***REMOVED***   let resp = await axios.get(`http://saito.tech/success.php?email=${email***REMOVED***`);
  ***REMOVED*** ***REMOVED***

  ***REMOVED***
  ***REMOVED*** send token with faucet
  ***REMOVED***
    ***REMOVED***;

      document.addEventListener('keydown', (e) => {
        if (e.keyCode == '27') { modal.style.display = "none"; ***REMOVED***
  ***REMOVED***);
  ***REMOVED***,
***REMOVED***