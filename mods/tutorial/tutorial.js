var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


const Modal = require('../../lib/ui/modal/modal');
const WelcomeBackupTemplate = require('./lib/modal/welcome-backup.template');
const WelcomeBackup = require('./lib/modal/welcome-backup.js');



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
        this.tutorialModal();
      }
    }

  }






  tutorialModal() {

    let modal = new Modal(this.app, {
      id: 'faucet',
      title: 'Welcome to Saito',
      content: WelcomeBackupTemplate()
    });

    let data = {};
        data.faucet = this;
        data.modal = modal;

    modal.render("blank");

    WelcomeBackup.attachEvents(this.app, data);

  }


}







module.exports = Tutorial;


