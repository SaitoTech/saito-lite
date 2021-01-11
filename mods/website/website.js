var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const ModalRegisterEmail = require('../../lib/saito/ui/modal-register-email/modal-register-email');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const Data = require('./lib/data');


class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Website";

    this.description = "Module that creates a root website on a Saito node.";
    this.categories = "Utilities Communications";
    this.header = null;

    return this;
  }



  initializeHTML(app) {

    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }

    this.header.render(app, this);
    this.header.attachEvents(app, this);

    var el = document.querySelector('.all');
    var head = document.querySelector('.header-home');
    var head_nav = document.querySelector('.header-nav');
    head.classList.add('small-head');
    head_nav.classList.add('small-head');
    el.addEventListener('scroll', () => {
      if (el.scrollTop > 100) {
        head.classList.remove('small-head');
        head_nav.classList.remove('small-head');
      } else {
        head.classList.add('small-head');
        head_nav.classList.add('small-head');
      }
    });
    
    document.getElementById("website-newsletter-subscribe").onclick = (e) => {
      this.mre = new ModalRegisterEmail(app);
      this.mre.render(app, this);
      this.mre.attachEvents(app, this);
    }


  }


  onConfirmation(blk, tx, conf, app) {

    //
    // newsletter signups and email registration
    //
    if (conf == 0) {

      let txmsg = tx.returnMessage();
      console.log("TX: " + JSON.stringify(txmsg));

    }

   }

  // shouldAffixCallbackToModule() { return 1; }

}



module.exports = Website;
