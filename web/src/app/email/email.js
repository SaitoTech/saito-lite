import { EmailList} from './email-list/email-list.js';

export default class Email {
    constructor(app) {
        this.app = app;
        this.saito = app.saito;
        return this;
    }
    render() {
       EmailList.render(this);
    //    EmailList.attachEvents(this.saito);
    }
}
