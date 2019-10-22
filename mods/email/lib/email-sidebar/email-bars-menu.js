const EmailBarsMenuTemplate = require('./email-bars-menu.template');

module.exports = EmailBarsMenu = {
  render(app, data) {
    document.querySelector('.email-bars-menu').innerHTML = EmailBarsMenuTemplate();
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
  ***REMOVED*** user clicks already-active item
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

          data.parentmod.appspace_mod = null;
          data.parentmod.active = "email_list";
          data.parentmod.header_title = "";

          data.parentmod.main.render(app, data);
          data.parentmod.main.attachEvents(app, data);

    ***REMOVED***

***REMOVED***));


    //
    // apps
    //
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


        data.parentmod.active = "email_appspace";
        data.parentmod.header_title = "Application";
        data.parentmod.appspace_mod = data.parentmod.mods[e.currentTarget.id];
        data.parentmod.appspace_mod_idx = e.currentTarget.id;

        data.parentmod.main.render(app, data)
        data.parentmod.main.attachEvents(app, data)

  ***REMOVED***


***REMOVED***));
  ***REMOVED***
***REMOVED***