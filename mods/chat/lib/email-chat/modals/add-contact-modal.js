const AddContactModalTemplate = require('./add-contact-modal.template');
const AddContactSuccessModalTemplate = require('./add-contact-modal-success.template');
const elParser = require('../../../../../lib/helpers/el_parser');

module.exports = AddContactModal = {
  render(app, data) {
    document.querySelector(".email-chat").append(elParser(AddContactModalTemplate()));
  ***REMOVED***,

  attachEvents(app, data) {
    var modal = document.getElementById('add-contact-modal');

    document.getElementById('email-chat-add-contact')
            .onclick = () => modal.style.display = "block";

    document.getElementsByClassName("close")[0]
            .onclick = () => modal.style.display = "none";

    document.getElementById('add-contact-add-button')
            .onclick = () => {
              let publickey = document.getElementById('add-contact-input').value;
              let encrypt_mod = app.modules.returnModule('Encrypt');
              encrypt_mod.initiate_key_exchange(publickey);

      ***REMOVED***
      ***REMOVED*** show success modal
      ***REMOVED***


      ***REMOVED*** then hide it
      ***REMOVED***
              modal.style.display = "none";

      ***REMOVED*** document.querySelector(".email-chat").append(elParser(AddContactSuccessModalTemplate()))

        ***REMOVED***;

      document.addEventListener('keydown', (e) => {
        if (e.keyCode == '27') { modal.style.display = "none"; ***REMOVED***
  ***REMOVED***);
  ***REMOVED***,
***REMOVED***