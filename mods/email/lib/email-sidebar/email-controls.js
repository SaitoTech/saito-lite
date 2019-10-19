
module.exports = EmailControls = {

    render(app, data=[]) {

      let apps_menu = document.querySelector(".email_apps");
      if (!apps_menu) { return; ***REMOVED***

      for (let i = 0; i < data.length; i++) {
	apps_menu.innerHTML += `<li class="email-navigator-item">${data[i].name***REMOVED***</li>`;
  ***REMOVED***

      this.attachEvents(app);

***REMOVED***,


    attachEvents(app) {
    
      document.querySelector('.email-navigator-item')
      	    .addEventListener('click', (e) => {

	      var elements = document.getElementsByClassName('email-navigator-active');
	      for (let i = elements.length-1; i >= 0; i++) {
   		elements[i].classList.remove('email-navigator-active');
	  ***REMOVED***

alert("removed the css class");

        ***REMOVED***);

***REMOVED***

***REMOVED***
