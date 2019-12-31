var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


const Modal = require('../../lib/ui/modal/modal');

const WelcomeBackupTemplate = require('./lib/modal/welcome-backup.template');
const WelcomeBackup = require('./lib/modal/welcome-backup.js');

const RegisterUsernameTemplate = require('./lib/modal/register-username.template');
const RegisterUsername = require('./lib/modal/register-username.js');

const InviteFriendsTemplate = require('./lib/modal/invite-friends.template');
const InviteFriends = require('./lib/modal/invite-friends.js');





class Tutorial extends ModTemplate {

  constructor(app) {

    super(app);

    this.app            = app;
    this.name           = "Tutorial";

    //
    // we want this running in all browsers
    //
    if (app.BROWSER == 1) {
      this.browser_active = 1;
    }

    return this;

  }



  initializeHTML(app) {

    //
    // run on load (or dom ready)
    //
    window.onload = () => {
      if (typeof window.localStorage !== "undefined" && !localStorage.getItem('visited')) {
        localStorage.setItem('visited', true);
        this.welcomeBackupModal();
      }
    }

  }





  inviteFriendsModal() {

    let modal = new Modal(this.app, {
      id: 'friends',
      title: 'Invite Friends',
      content: InviteFriendsTemplate()
    });

    let data = {};
        data.modal = modal;

    modal.render("blank");

    InviteFriends.attachEvents(this.app, data);

  }


  welcomeBackupModal() {

    let modal = new Modal(this.app, {
      id: 'faucet',
      title: 'Welcome to Saito',
      content: WelcomeBackupTemplate()
    });

    let data = {};
        data.modal = modal;

    modal.render("blank");

    WelcomeBackup.attachEvents(this.app, data);

  }


  registerIdentifierModal() {

    let modal = new Modal(this.app, {
      id: 'register-username',
      title: 'Register a Saito Username',
      content: RegisterUsernameTemplate()
    });

    let data = {};
        data.modal = modal;

    modal.render("blank");

    RegisterUsername.attachEvents(this.app, data);

  }


}







module.exports = Tutorial;


