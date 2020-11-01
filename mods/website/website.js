var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');

class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Website";

    this.description = "Investor information frontend";
    this.categories = "Utilities Communications";

    return this;
  }


  /*
    initialize(app){
  
      x = this.app.modules.respondTo("email-chat");
      for (let i = 0; i < x.length; i++) {
        this.mods.push(x[i]);
      }
    }
  */

  initializeHTML(app) {
    console.log("Website initializeHTML")
    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);


    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(this.app, this);
    });

    var html = `
    <a class="header-icon-fullscreen tip" target="_blank" href="https://org.saito.tech/blog">
    <i id="blog" class="header-icon icon-med fas fa-rss-square">
    <div class="redicon"></div></i>
    <div class="tiptext headertip">Saito Blog</div>
    </a>
    `;
    var iconlist = document.querySelector('.header-icon-links');
    iconlist.insertBefore(app.browser.htmlToElement(html), iconlist.firstChild);

    this.updatePage(app);

  }

  async onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {
      this.updatePage(app);
    }
  }

  updatePage(app) {
    if (document.querySelector('.frontpage-balance')) {
      try {
        //let balance = this.app.wallet.returnBalance();
        let balance = this.app.wallet.returnBalance();
        document.querySelector('.frontpage-balance').innerHTML = balance + " SAITO";
      } catch (err) { }
    }

    if (document.querySelector('.frontpage-address')) {
      let publickey = app.wallet.returnPublicKey();
      let id = app.keys.returnIdentifierByPublicKey(publickey, true);
      document.querySelector('.frontpage-address').innerHTML = id;
    }

    if (document.querySelector('.register_username')) {
      let id = "";
      let publickey = app.wallet.returnPublicKey();
      if (app.keys.returnIdentifierByPublicKey(publickey)) {
        document.querySelector('.register_username').innerHTML = "Welcome Back";
      } else {
        document.querySelector('.register_username')
          .onclick = async () => {
            var requested_id = await sprompt("Pick a handle or nickname. <br /><sub>Alphanumeric characters only - Do not include an @</sub.>");
            let register_success = app.modules.returnModule('Registry').registerIdentifier(requested_id);
            if (register_success) {
              id = `"${requested_id}@saito" requested.`;
              document.querySelector('.register_username').innerHTML = id;
            }
          };
      }
    }
  }

  shouldAffixCallbackToModule() { return 1; }

}



module.exports = Website;
