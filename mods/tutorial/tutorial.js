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

    this.app = app;
    this.name = "Tutorial";

    this.username_registered = 0;

    //
    // we want this running in all browsers
    //
    if (app.BROWSER == 1) {
      this.browser_active = 1;
    }

    return this;

  }



  initialize(app) {
    if (app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey())) {
      this.username_registered = 1;
    }
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


  async handlePeerRequest(app, message, peer, callback) {

    if (message.request == "user subscription") {
      try {
        
        let sql = "INSERT OR IGNORE INTO subscribers (publickey, email, unixtime) VALUES ($publickey, $email, $unixtime);"
        
        let params = {
          $publickey: message.data.key,
          $email: message.data.email,
          $unixtime: message.data.time,
        }
        
       await this.app.storage.executeDatabase(sql, params, "tutorial");

        return;

      } catch (err) {
        console.error(err);
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
    data.tutorial = this;
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
    data.tutorial = this;
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
    data.tutorial = this;
    data.modal = modal;

    modal.render("blank");

    RegisterUsername.attachEvents(this.app, data);

  }

  shouldAffixCallbackToModule() { return 1; }

}

module.exports = Tutorial;


