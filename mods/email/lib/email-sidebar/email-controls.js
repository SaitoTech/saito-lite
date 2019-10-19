const EmailControlsTemplate = require('./email-controls.template');
// const EmailChatTemplate = require('./email-chat.template');

module.exports = EmailControls = {

    render(app, data) {

        document.querySelector(".email-sidebar").innerHTML += EmailControlsTemplate();

        let email_apps = document.querySelector(".email-apps");
        for (let i = 0; i < data.mods.length; i++) {
            email_apps.innerHTML += `<li class="email-navigator-item">${data.mods[i].name***REMOVED***</li>`;
    ***REMOVED***

***REMOVED***,


    attachEvents(app, data) {

        Array.from(document.getElementsByClassName('email-navigator-item'))
	  .forEach(item => item.addEventListener('click', (e) => {

            if (e.currentTarget.classList.contains("active-navigator-item")) {
	      // user clicks already-active item
	***REMOVED*** else {

              Array.from(document.getElementsByClassName('email-navigator-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");
		***REMOVED***
		  ***REMOVED***
         ***REMOVED***);

	  ***REMOVED***

          if (e.target.id === "inbox") { 
	    data.parentmod.emails.active = 0;
	    EmailList.render(app, data);
	    EmailList.attachEvents(app, data);
	  ***REMOVED***
          if (e.target.id === "sent") {
	    data.parentmod.emails.active = 1;
	    EmailList.render(app, data);
	    EmailList.attachEvents(app, data);
      ***REMOVED***
          if (e.target.id === "trash") { 
	    data.parentmod.emails.active = 2; 
	    EmailList.render(app, data);
	    EmailList.attachEvents(app, data);
      ***REMOVED***


   ***REMOVED***));
    

        document.getElementById('email-navigator')
                .addEventListener('click', (e) => {
                    if (e.target && e.target.nodeName == "LI") {
                        console.log(e.target.id + " was clicked");
                ***REMOVED***
            ***REMOVED***)

        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {
                let id = e.currentTarget.id;
                console.log(id);
                alert("CLICKED");
        ***REMOVED***);
***REMOVED***

***REMOVED***
