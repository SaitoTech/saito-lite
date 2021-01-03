var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const Data = require('./lib/data');


class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Website";

    this.description = "Module that creates a root website on a Saito node.";
    this.categories = "Utilities Communications";
    this.header = new SaitoHeader(this.app, this);

    return this;
  }



  initializeHTML(app) {


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
    
    //    this.app.modules.respondTo("chat-manager").forEach(mod => {
    //      mod.respondTo('chat-manager').render(this.app, this);
    //    });


  }


  // onConfirmation(blk, tx, conf, app) {
  //   if (this.browser_active == 1) {
  //     try {
  //       if (document.querySelector('.netstats')) {
  //         Data.render(app)
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }

  // shouldAffixCallbackToModule() { return 1; }

}



module.exports = Website;
