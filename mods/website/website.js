const path = require('path');
const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ModalRegisterEmail = require('../../lib/saito/ui/modal-register-email/modal-register-email');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');
const Data = require('./lib/data');


class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Website";

    this.description = "Module that creates a root website on a Saito node.";
    this.categories = "Utilities Communications";
    this.header = null;
    this.overlay = new SaitoOverlay(app, this);
    return this;
  }

  initializeHTML(app) {
    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }

    this.header.render(app, this);
    this.header.attachEvents(app, this);

    if (document.querySelector('.header-icon-links')) {
      app.browser.prependElementToDom(document.querySelector("#header-icon-links-hidden").innerHTML, document.querySelector('.header-icon-links'));
    }
    if (document.querySelector('.header-dropdown')) {
      app.browser.prependElementToDom(document.querySelector("#header-dropdown-hidden").innerHTML, document.querySelector('.header-dropdown'));
    }

    document.querySelectorAll('#weixin-link').forEach((element) => {
      element.onclick = (event) => {
        // To generate QR code, take the qr from wechat, decode it and extract the url.
        // https://zxing.org/w/decode
        // Then recreate a clear QR code and replace mods/website/web/img/wechat/weixin.png
        // https://www.the-qrcode-generator.com/
        this.overlay.showOverlay(app, this, `<div id='weixinqr-overlay'><img src="/img/wechat/weixin.png" style="display: block;">
        </div>`, () => {})
      }
    });

    document.querySelectorAll('#whitepaperLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEvent("Navigation", "HomepageNavigationClick", "HomepageWhitepaperLink");
      }
    });
    document.querySelectorAll('#litepaperLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEvent("Navigation", "HomepageNavigationClick", "HomepageLitepaperLink");
      }
    });
    document.querySelectorAll('#arcadeLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEvent("Navigation", "HomepageNavigationClick", "HomepageArcadeLink");
      }
    });
    document.querySelectorAll('#developersLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEvent("Navigation", "HomepageNavigationClick", "HomepageDevelopersLink");
      }
    });
    document.querySelectorAll('.left.desktop .logo').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEvent("Navigation", "HomepageNavigationClick", "HeaderLogoHomepageLink");
      }
    });
    
    document.querySelectorAll('.website-newsletter-subscribe').forEach((element) => {
      element.onclick = (e) => {
        this.mre = new ModalRegisterEmail(app);
        this.mre.render(this.app, this, ModalRegisterEmail.MODES.NEWSLETTER);
        this.mre.attachEvents(this.app, this);
      }
    });
    this.initializePrivateSaleOverlay();
  }
  
  doPrivateSaleOverlay() {
    let doPrivsaleSignup = this.app.browser.parseHash(window.location.hash).private_sale;
    if(doPrivsaleSignup) {
      this.mre = new ModalRegisterEmail(this.app);
      this.mre.render(this.app, this, ModalRegisterEmail.MODES.PRIVATESALE);
      this.mre.attachEvents(this.app, this);
      window.location.hash = this.app.browser.removeFromHash(window.location.hash, "private_sale");
    }
  }
  initializePrivateSaleOverlay() {
    window.addEventListener("hashchange", () => {
      this.doPrivateSaleOverlay();
    });
    let oldHash = window.location.hash;
    window.location.hash = `#`;
    window.location.hash = oldHash;
  }
  triggerPrivateSaleOverlay() {
    window.location.hash = this.app.browser.modifyHash(window.location.hash, {private_sale: "1"});
  }
  respondTo(type) {
    if (type == "private_sale_overlay") {
      let obj = {};
      obj.initializePrivateSaleOverlay = this.initializePrivateSaleOverlay.bind(this);
      obj.triggerPrivateSaleOverlay = this.triggerPrivateSaleOverlay.bind(this);
      return obj;
    }
  }
  webServer(app, expressapp, express) {
    expressapp.use("/", express.static(`${__dirname}/../../mods/website/web`));
    // TODO: change every reference in the site from /website/* to /* and remove this line
    expressapp.use("/website/", express.static(`${__dirname}/../../mods/website/web`));
    expressapp.get('/l/:campaign/:channel/:subchannel', async (req, res) => {
      res.sendFile(path.join(__dirname + '/web/marketing/marketing.html'));
    });
    expressapp.get('/l/matomohelpers.js', async (req, res) => {
      res.sendFile(path.join(__dirname + "../../../mods/matomo/matomoHelpers.js"));
    });
    expressapp.get('/l/maketrackinglink', async (req, res) => {
      res.sendFile(path.join(__dirname + '/web/marketing/linkmakerform.html'));
    });
    expressapp.get('/weixin', async (req, res) => {
      res.sendFile(path.join(__dirname + '/web/weixininvite.html'));
    });
  }
}
module.exports = Website;
