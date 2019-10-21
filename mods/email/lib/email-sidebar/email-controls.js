const EmailControlsTemplate = require('./email-controls.template');
const EmailHeader = require('../email-main/email-header/email-header');
const EmailBody = require('../email-main/email-body/email-body');
const EmailForm = require('../email-main/email-body/email-form/email-form');

module.exports = EmailControls = {

    render(app, data) {

        document.querySelector(".email-controls").innerHTML = EmailControlsTemplate();

        let email_apps = document.querySelector(".email-apps");
        for (let i = 0; i < data.mods.length; i++) {
            email_apps.innerHTML += `<li class="email-apps-item" id="${i}">${data.mods[i].name}</li>`;
        }

    },


    attachEvents(app, data) {

	//
	// inbox / sent / trash
	//
        Array.from(document.getElementsByClassName('email-navigator-item'))
	  .forEach(item => item.addEventListener('click', (e) => {

            if (e.currentTarget.classList.contains("active-navigator-item")) {
	      // user clicks already-active item
	    } else {

              Array.from(document.getElementsByClassName('email-navigator-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");

		      if (e.currentTarget.id == "inbox") {
			data.parentmod.emails.active = "inbox";
		      }
		      if (e.currentTarget.id == "sent") {
			data.parentmod.emails.active = "sent";
		      }
		      if (e.currentTarget.id == "trash") {
			data.parentmod.emails.active = "trash";
		      }


		    }
		  }
              });

              Array.from(document.getElementsByClassName('email-apps-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");

		      if (e.currentTarget.id == "inbox") {
			data.parentmod.emails.active = "inbox";
		      }
		      if (e.currentTarget.id == "sent") {
			data.parentmod.emails.active = "sent";
		      }
		      if (e.currentTarget.id == "trash") {
			data.parentmod.emails.active = "trash";
		      }

		    }
		  }
              });

	      data.parentmod.appspace = 0;
	      data.parentmod.header_active = 0;
	      data.parentmod.header_active_title = "";

    	      EmailHeader.render(app, data);
	      EmailHeader.attachEvents(app, data);

    	      EmailBody.render(app, data);
	      EmailBody.attachEvents(app, data);

	    }

	}));


	//
	// apps
	//
        Array.from(document.getElementsByClassName('email-apps-item'))
	  .forEach(item => item.addEventListener('click', (e) => {

            if (e.currentTarget.classList.contains("active-navigator-item")) {
	      // user clicks already-active item
	    } else {

              Array.from(document.getElementsByClassName('email-apps-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");
		    }
		  }
              });

              Array.from(document.getElementsByClassName('email-navigator-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");
		    }
		  }
              });


            data.parentmod.active = "email_appspace";
            data.parentmod.header_title = "Application";
            data.parentmod.appspace_mod_idx = e.currentTarget.id;

            data.parentmod.main.render(app, data)
            data.parentmod.main.attachEvents(app, data)

	  }


	}));


        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {

                data.parentmod.active = "email_form";
                data.parentmod.previous_state = "email_list";
                data.parentmod.header_title = "Compose Email";

                data.parentmod.main.render(app, data);
                data.parentmod.main.attachEvents(app, data);
            });
    }

}
