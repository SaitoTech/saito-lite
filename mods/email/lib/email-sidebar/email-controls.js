const EmailControlsTemplate = require('./email-controls.template');
const EmailChatTemplate = require('./email-chat.template');

module.exports = EmailControls = {

    render(app, data) {

      document.querySelector(".email-sidebar").innerHTML += EmailControlsTemplate();

      let email_apps = document.querySelector(".email-apps");
      for (let i = 0; i < data.mods.length; i++) {
	email_apps.innerHTML += `<li class="email-navigator-item">${data.mods[i].name***REMOVED***</li>`;
  ***REMOVED***
      this.attachEvents(app);
***REMOVED***,


    attachEvents(app) {
alert("EVENT ATTACHED");
try {
      let elements = document.getElementsByClassName('email-navigator-item')
      Array.from(elements).forEach(elem => {
alert("EVENT ATTACHED 2");
        elem.addEventListener('click', (e) => {
	  alert("TEST CLICK");
	***REMOVED***);
  ***REMOVED***);

alert("successfully attached event listeners!");

***REMOVED*** catch (err) {
  alert("ERROR ATTACHING EVENT: " + err);
***REMOVED***
***REMOVED***

***REMOVED***
