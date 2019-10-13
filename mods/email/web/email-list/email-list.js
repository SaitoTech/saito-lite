import { EmailAdd  ***REMOVED*** from '../email-add/email-add.js';
import { EmailListTemplate ***REMOVED*** from './email-list.template.js';

export const EmailList = {
    render(mod) {
        let main = document.querySelector(".main");
        main.innerHTML = EmailListTemplate();
        this.attachEvents(mod);
***REMOVED***,

    attachEvents(mod) {
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                EmailAdd.render(mod);
        ***REMOVED***);
***REMOVED***
***REMOVED***
