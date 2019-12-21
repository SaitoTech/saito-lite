const EmailBarsMenuTemplate = require('./email-bars-menu.template');

module.exports = EmailBarsMenu = {

  module_application_loaded: 0,

  render(app, data) {

    document.querySelector('.email-bars-menu').innerHTML = EmailBarsMenuTemplate();

    let email_apps = document.querySelector(".email-apps");
    for (let i = 0; i < data.mods.length; i++) {
      if (data.mods[i].respondTo("email-appspace") != null) {
        email_apps.innerHTML += `<li class="email-apps-item email-apps-item-${i***REMOVED***" id="${i***REMOVED***">${data.mods[i].name***REMOVED***</li>`;
  ***REMOVED***
***REMOVED***

  ***REMOVED***,

  attachEvents(app, data) {

    //
    // inbox / sent / trash
    //
    Array.from(document.getElementsByClassName('email-navigator-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        if (e.currentTarget.classList.contains("active-navigator-item")) {
  ***REMOVED*** user clicks already-active item
    ***REMOVED*** else {

          Array.from(document.getElementsByClassName('email-navigator-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");

                  if (e.currentTarget.id == "inbox") {
                    data.email.emails.active = "inbox";
              ***REMOVED***
                  if (e.currentTarget.id == "sent") {
                    data.email.emails.active = "sent";
              ***REMOVED***
                  if (e.currentTarget.id == "trash") {
                    data.email.emails.active = "trash";
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
                    data.email.emails.active = "inbox";
              ***REMOVED***
                  if (e.currentTarget.id == "sent") {
                    data.email.emails.active = "sent";
              ***REMOVED***
                  if (e.currentTarget.id == "trash") {
                    data.email.emails.active = "trash";
              ***REMOVED***

            ***REMOVED***
          ***REMOVED***
      ***REMOVED***);

          data.email.appspace_mod = null;
          data.email.active = "email_list";
          data.email.header_title = "";

          data.email.main.render(app, data);
          data.email.main.attachEvents(app, data);

    ***REMOVED***
***REMOVED***));



    Array.from(document.getElementsByClassName('email-apps-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        if (e.currentTarget.classList.contains("active-navigator-item")) {
  ***REMOVED*** user clicks already-active item
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

          data.email.active = "email_appspace";
          data.email.previous_state = "email_list";
          data.email.header_title = "Application";
          data.email.appspace_mod = data.email.mods[e.currentTarget.id];
          data.email.appspace_mod_idx = e.currentTarget.id;

          data.email.main.render(app, data)
          data.email.main.attachEvents(app, data)

    ***REMOVED***
***REMOVED***));



    //
    // load first app
    //
    if (this.module_application_loaded == 0) { 

      this.module_application_loaded = 1; 

      if (app.browser.returnURLParameter("module") != "") {

	let modname = app.browser.returnURLParameter("module"); 
        for (let i = 0; i < data.mods.length; i++) {
          if (data.mods[i].returnSlug() == modname) {

            let modobj = document.querySelector(`.email-apps-item-${i***REMOVED***`);

// 	    data.email.active	    = "email_appspace";
// 	    data.email.previous_state   = "email_list";
//    	    data.email.header_title     = "Saito AppStore";
//    	    data.email.appspace_mod     = data.email.mods[i];
//   	    data.email.appspace_mod_idx = i;

	    setTimeout(function () { 
	      modobj.click();
        ***REMOVED***, 500);

	  ***REMOVED***
	***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***
