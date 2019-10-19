const EmailMainTemplate = require('./email-main.template');
const EmailList = require('../email-list/email-list');
const EmailSidebar = require('../email-sidebar/email-sidebar');

module.exports = EmailMain = {

  render(app, data) {

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; }
    email_main.innerHTML = EmailMainTemplate();

    EmailList.render(app, data);
    EmailSidebar.render(app, data);

    // let email_sidebar_container = document.querySelector(".email-sidebar-container");
    // if (!email_sidebar_container) {
    //   alert("THERE IS NO SIDEBAR CONTAINER THERE");
    //   return;
    // }
    // email_sidebar_container.innerHTML = EmailSidebarTemplate();

    this.attachEvents(app);
  },

  attachEvents(app) {
    document.getElementById('email-select-icon')
            .addEventListener('click', (e) => {
              Array.from(document.getElementsByClassName('email-selected')).forEach(checkbox => {
                checkbox.checked = e.currentTarget.checked;
              });
            });

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
              let email_list = document.querySelector('.email-list');
              Array.from(document.getElementsByClassName('email-message')).forEach(mail => {
                let is_checked = mail.children[0].checked;

                // remove from DOM
                if (is_checked) {
                  email_list.removeChild(mail);
                }

                // get index to remove from Array

              });
            });
  }

}
