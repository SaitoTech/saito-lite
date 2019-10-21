const EmailControlsTemplate = require('./email-controls.template');
const EmailForm = require('../email-main/email-form/email-form');
const EmailAppspace = require('../email-main/email-appspace/email-appspace');

module.exports = EmailControls = {

    render(app, data) {

        document.querySelector(".email-sidebar").innerHTML += EmailControlsTemplate();

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

		    }
		  }
              });

              Array.from(document.getElementsByClassName('email-apps-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");
		    }
		  }
              });


	      data.parentmod.header = 0;
	      data.parentmod.header_title = "";

    	      EmailHeader.render(app, data);
	      EmailHeader.attachEvents(app, data);

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


	      data.parentmod.header = 1;
	      data.parentmod.header_title = "Application";
	      data.parentmod.appspace_mod_idx = e.currentTarget.id;

              EmailHeader.render(app, data);
	      EmailHeader.attachEvents(app, data);

    	      EmailAppspace.render(app, data);
	      EmailAppspace.attachEvents(app, data);
	  }


	}));


        document.getElementById('email-navigator')
                .addEventListener('click', (e) => {
                    if (e.target && e.target.nodeName == "LI") {
                        console.log(e.target.id + " was clicked");
                    }
                })

        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {
                // let id = e.currentTarget.id;
                // console.log(id);
                // alert("CLICKED");
                EmailForm.render(app, data);
                EmailForm.attachEvents(app, data);
            });
    }

}
