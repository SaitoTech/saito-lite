const AddContactModalTemplate = require('./add-contact-modal.template');

const AddContactModalQR = require('./add-contact-qr/add-contact-modal-qr');
const AddContactModalText = require('./add-contact-text/add-contact-modal-text');

function stopVideo() {
  let video = document.querySelector('video')
  if (video)
    video.srcObject.getTracks().forEach(track => track.stop());
}

module.exports = AddContactModal = {

  render(app, data) {
    let {el_parser} = data.helpers;
    document.querySelector(".email-chat").append(el_parser(AddContactModalTemplate()));
    data.renderView = this.renderView;
  },

  attachEvents(app, data) {
    let {el_parser} = data.helpers;
    var modal = document.getElementById('add-contact-modal');

    document.getElementById('email-chat-add-contact').onclick = () => {
      try {
        app.modules.returnModule("Tutorial").inviteFriendsModal();
      } catch (err) {
        this.renderView(app, data);

        modal.style.display = "block";
      }
    }

    document.getElementsByClassName("close")[0]
            .onclick = () => {
              stopVideo();
              data.contact_view = 'qr';
              data.selected_key = '';
              modal.style.display = "none";
            }

    document.addEventListener('keydown', (e) => {
      if (e.keyCode == '27') { modal.style.display = "none"; }
    });
  },

  renderView(app, data) {
    let {el_parser} = data.helpers;
    stopVideo();
    document.querySelector(".add-contact-modal-body").innerHTML = '';

    if (data.contact_view == 'qr') {
      AddContactModalQR.render(app, data);
      AddContactModalQR.attachEvents(app, data);
      document.querySelector(".add-contact-modal-body")
                .append(el_parser(
                  `<div class="add-contact-toggle" id="key" style="
                  text-align: right;
                  text-decoration: underline;
                  color: blue;
                  cursor: pointer">Add By Key</div>`
                ));
      document.querySelector('.add-contact-toggle')
        .onclick = () => {
          if (!document.querySelector('.add-contact-text')) {
            stopVideo();
            document.querySelector(".add-contact-modal-body").innerHTML = '';
            AddContactModalText.render(app, data);
            AddContactModalText.attachEvents(app, data);
          }
        }
    } else {
      AddContactModalText.render(app, data);
      AddContactModalText.attachEvents(app, data);
    }
  }
}
