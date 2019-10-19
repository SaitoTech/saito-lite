
module.exports = EmailControls = {

    render(app, data) {

      // data.mods = active modules

alert("A");
      let apps_menu = document.querySelector(".email_apps");
alert("AB: ");
      if (!apps_menu) {
alert("apps_menu undefined");
	return;
  ***REMOVED***

alert("B");

      apps_menu.innerHTML += '<ul>';
      for (let i = 0; i < data.mods.length; i++) {
	apps_menu.innerHTML += `<li class="email-navigator-item">${data[i].name***REMOVED***</li>`;
  ***REMOVED***
      apps_menu.innerHTML += '</ul>';

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
