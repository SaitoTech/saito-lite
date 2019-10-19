const EmailControlsTemplate = require('./email-controls.template');
// const EmailChatTemplate = require('./email-chat.template');

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
***REMOVED*** let nav_items = document.getElementsByClassName('email-navigator-item')
***REMOVED*** Array.from(nav_items)
***REMOVED***     .forEach(item => item.addEventListener('click', (e) => {
***REMOVED***         let id = e.currentTarget.id;
***REMOVED***         console.log(`${id***REMOVED*** GO CLICKED`);
***REMOVED*** ***REMOVED***)
***REMOVED*** );

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
