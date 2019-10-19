
module.exports = EmailControls = {

    render(app, data) {

      // data.mods = active modules

alert("A");
      let email_apps = document.querySelector(".email-apps");
alert("AB: ");
      if (!email_apps) {
alert("apps_menu undefined");
	return;
  ***REMOVED***

alert("B: " + data.mods.length);

      for (let i = 0; i < data.mods.length; i++) {
	email_apps.innerHTML += `<li class="email-navigator-item">${data.mods[i]name***REMOVED***</li>`;
  ***REMOVED***

alert("C");
      this.attachEvents(app);

***REMOVED***,


    attachEvents(app) {

console.log("attaching events to email navigator item");

alert("attach events in email controls");   

      document.querySelector('.email-navigator-item')
      	    .addEventListener('click', (e) => {

alert("testing add click event!");

	      var elements = document.getElementsByClassName('email-navigator-active');
	      for (let i = elements.length-1; i >= 0; i++) {
   		elements[i].classList.remove('email-navigator-active');
	  ***REMOVED***

alert("removed the css class");

        ***REMOVED***);

***REMOVED***

***REMOVED***
