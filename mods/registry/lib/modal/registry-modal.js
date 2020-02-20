const RegistryModalTemplate = require('./registry-modal.template');
const RegistrySuccessModalTemplate = require('./registry-modal-success.template');

module.exports = RegistryModal = {
  render(app, data) {
    if (!document.getElementById('registry-modal')) {
      let {el_parser} = data.helpers;
      document.querySelector('body').append(
        el_parser(RegistryModalTemplate())
      )
    }
    document.getElementById('registry-modal').style.display = "block";
  },

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
              //
              // register name
              //
              let identifier = document.getElementById('registry-input').value
              let registry_success = app.modules.returnModule("Registry").registerIdentifier(identifier);

              if (registry_success) {
                Array.from(document.getElementsByClassName('saito-identifier'))
                     .forEach(elem => {
                       elem.innerHTML = `<h3>${identifier}@saito</h3>`
                     })
                //
                // show success modal
                //
                // Add email capture and links to discord and Telegram
                //
                modal.innerHTML = RegistrySuccessModalTemplate();
                this.attachEvents(app, data);
              }

            };

      let email_button = document.getElementById('registry-email-button')
      if (email_button)
        email_button.onclick = async () => {
          // let email_addr = document.getElementById('registry-input').value;
          // if (email_addr) {
          //   let resp = await fetch(`http://saito.tech/success.php?email=${email}`);
          // }

          //
          // send token with reward
          //
        };

      document.addEventListener('keydown', (e) => {
        if (e.keyCode == '27') { modal.style.display = "none"; }
      });
  },
}