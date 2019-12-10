const ModalTemplate = require('./modal-template.js');
const elParser = require('../../helpers/el_parser');

class Modal {
  constructor(app, { id, title, content }) {
    this.app = app;

    this.id = id;
    this.title = title;
    this.content = content;
  }

  render() {
    document.querySelector('body').append(elParser(ModalTemplate(this)));
    document.getElementById(`${this.id}-modal`).style.display = 'unset';
    this.attachEvents();
  }

  destroy() {
    document.querySelector('body')
            .removeChild(document.getElementById(`${this.id}-modal`))
  }

attachEvents(callback=null) {
    var modal = document.getElementById(`${this.id}-modal`);

    document.getElementById("modal-close")
            .onclick = () => modal.style.display = "none";

    document.addEventListener('keydown', (e) => {
      if (e.keyCode == '27') { modal.style.display = "none"; }
    });

    if (callback) callback();
  }
}

module.exports = Modal;