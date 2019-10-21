const EmailControlsTemplate = require('./email-controls.template');
const EmailHeader = require('../email-main/email-header/email-header');
const EmailBody = require('../email-main/email-body/email-body');

module.exports = EmailControls = {

    render(app, data) {

        document.querySelector(".email-controls").innerHTML = EmailControlsTemplate();

        let email_apps = document.querySelector(".email-apps");
        for (let i = 0; i < data.mods.length; i++) {
            email_apps.innerHTML += `<li class="email-apps-item" id="${i***REMOVED***">${data.mods[i].name***REMOVED***</li>`;
    ***REMOVED***

***REMOVED***,


    attachEvents(app, data) {

	//
	// inbox / sent / trash
	//
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

		      if (e.currentTarget.id == "inbox") {
			data.parentmod.emails.active = "inbox";
		  ***REMOVED***
		      if (e.currentTarget.id == "sent") {
			data.parentmod.emails.active = "sent";
		  ***REMOVED***
		      if (e.currentTarget.id == "trash") {
			data.parentmod.emails.active = "trash";
		  ***REMOVED***


		***REMOVED***
		  ***REMOVED***
          ***REMOVED***);

              Array.from(document.getElementsByClassName('email-apps-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");

		      if (e.currentTarget.id == "inbox") {
			data.parentmod.emails.active = "inbox";
		  ***REMOVED***
		      if (e.currentTarget.id == "sent") {
			data.parentmod.emails.active = "sent";
		  ***REMOVED***
		      if (e.currentTarget.id == "trash") {
			data.parentmod.emails.active = "trash";
		  ***REMOVED***

		***REMOVED***
		  ***REMOVED***
          ***REMOVED***);

	      data.parentmod.appspace = 0;
	      data.parentmod.header = 0;
	      data.parentmod.header_title = "";

    	      EmailHeader.render(app, data);
	      EmailHeader.attachEvents(app, data);

    	      EmailBody.render(app, data);
	      EmailBody.attachEvents(app, data);

	***REMOVED***

	***REMOVED***));


	//
	// apps
	//
        Array.from(document.getElementsByClassName('email-apps-item'))
	  .forEach(item => item.addEventListener('click', (e) => {

            if (e.currentTarget.classList.contains("active-navigator-item")) {
	      // user clicks already-active item
	***REMOVED*** else {

              Array.from(document.getElementsByClassName('email-apps-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");
		***REMOVED***
		  ***REMOVED***
          ***REMOVED***);

              Array.from(document.getElementsByClassName('email-navigator-item'))
                .forEach(item2 => {
                  if (item2.classList.contains("active-navigator-item")) {
		    if (item2 != e.currentTarget) {
		      item2.classList.remove("active-navigator-item");
	              e.currentTarget.classList.add("active-navigator-item");
		***REMOVED***
		  ***REMOVED***
          ***REMOVED***);


	      data.parentmod.appspace = 1;
	      data.parentmod.header = 1;
	      data.parentmod.header_title = "Application";
	      data.parentmod.appspace_mod_idx = e.currentTarget.id;

              EmailHeader.render(app, data);
	      EmailHeader.attachEvents(app, data);

    	      EmailAppspace.render(app, data);
	      EmailAppspace.attachEvents(app, data);

	  ***REMOVED***


	***REMOVED***));


        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {

	      data.parentmod.appspace = 1;
	      data.parentmod.header = 1;
	      data.parentmod.header_title = "Compose Email";

              EmailForm.render(app, data);
              EmailForm.attachEvents(app, data);
        ***REMOVED***);
***REMOVED***

***REMOVED***
