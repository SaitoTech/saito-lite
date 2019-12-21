const ModalTemplate = require('./modal-template.js');
const ModalBlankTemplate = require('./modal-blank-template.js');
const elParser = require('../../helpers/el_parser');

class Modal {
  constructor(app, { id, title, content ***REMOVED***) {
    this.app = app;

    this.id = id;
    this.title = title;
    this.content = content;
  ***REMOVED***

  render(type="") {
    switch(type){
      case "":
        document.querySelector('body').append(elParser(ModalTemplate(this)));
        this.attachEvents();
      case "blank":
        document.querySelector('body').append(elParser(ModalBlankTemplate(this)));
***REMOVED***
    document.getElementById(`${this.id***REMOVED***-modal`).style.display = 'unset';
  ***REMOVED***

  destroy() {
    document.querySelector('body')
            .removeChild(document.getElementById(`${this.id***REMOVED***-modal`))
  ***REMOVED***

attachEvents(callback=null) {
    var modal = document.getElementById(`${this.id***REMOVED***-modal`);

    document.getElementById("modal-close")
            .onclick = () => modal.style.display = "none";

    document.addEventListener('keydown', (e) => {
      if (e.keyCode == '27') { modal.style.display = "none"; ***REMOVED***
***REMOVED***);

    if (callback) callback();
  ***REMOVED***
***REMOVED***

module.exports = Modal;