const ModalTemplate = require('./modal-template.js');
const ModalBlankTemplate = require('./modal-blank-template.js');
const elParser = require('../../helpers/el_parser');

class Modal {
  constructor(app, { id, title, content }) {
    this.app = app;

    this.id = id;
    this.title = title;
    this.content = content;
  }

  render(type="") {
    switch(type){
      case "":
        document.querySelector('body').append(elParser(ModalTemplate(this)));
        this.attachEvents();
      case "blank":
        document.querySelector('body').append(elParser(ModalBlankTemplate(this)));
    }
    document.getElementById(`${this.id}-modal`).style.display = 'unset';
  }

  destroy() {
    try {
      document.querySelector('body').removeChild(document.getElementById(`${this.id}-modal`))
    } catch (e) {
      console.log(e);
    }
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