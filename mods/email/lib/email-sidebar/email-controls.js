const EmailControlsTemplate = require('./email-controls.template');
// const EmailChatTemplate = require('./email-chat.template');

module.exports = EmailControls = {

    render(app, data) {

        document.querySelector(".email-sidebar").innerHTML += EmailControlsTemplate();

        let email_apps = document.querySelector(".email-apps");
        for (let i = 0; i < data.mods.length; i++) {
            email_apps.innerHTML += `<li class="email-navigator-item">${data.mods[i].name}</li>`;
        }

        this.attachEvents(app);
    },


    attachEvents(app) {
        // let nav_items = document.getElementsByClassName('email-navigator-item')
        // Array.from(nav_items)
        //     .forEach(item => item.addEventListener('click', (e) => {
        //         let id = e.currentTarget.id;
        //         console.log(`${id} GO CLICKED`);
        //     })
        // );

        document.getElementById('email-navigator')
                .addEventListener('click', (e) => {
                    if (e.target && e.target.nodeName == "LI") {
                        console.log(e.target.id + " was clicked");
                    }
                })

        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {
                let id = e.currentTarget.id;
                console.log(id);
                alert("CLICKED");
            });
    }

}
