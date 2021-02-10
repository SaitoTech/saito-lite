var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
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

    if(document.querySelector('.header-icon-links')) {
      app.browser.prependElementToDom(document.querySelector("#header-icon-links-hidden").innerHTML, document.querySelector('.header-icon-links'));
    }
    if(document.querySelector('.header-dropdown')) {
      app.browser.prependElementToDom(document.querySelector("#header-dropdown-hidden").innerHTML, document.querySelector('.header-dropdown'));
    }
    document.querySelectorAll('#weixin-link').forEach((element) => {
      element.onclick = (event) => {
        // This QR comes from msng.link at this location:
        // https://msng.link/o/?https%3A%2F%2Fweixin.qq.com%2Fg%2FAQYAAP6SZ8iLZ2exjHm6K1gcYvsqSuHGGzD6yDgHy_Axy6fXAJHA6NV7117FliL-=wc
        // The QR codes generated by wechat directly expire after 7 days and only allow 100 or 200 people to use them.
        // msng.link claims to solve this problem.
        // I don't want to put an iframe if not necessary so I copied the QR code from msng.link instead...
        // If this stops working, we'll have to make another plan.
        this.overlay.showOverlay(app, this, "<div id='weixinqr-overlay'><img src='data:image/png;base64,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'/></div>", () => {})
      }
    });
    document.querySelectorAll('#whitepaperLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEventAndNavigate("/saito-whitepaper.pdf", "Navigation", "HomepageNavigationClick", "HomepageWhitepaperLink");
      }
    });
    document.querySelectorAll('#litepaperLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEventAndNavigate("/saito-litepaper.pdf", "Navigation", "HomepageNavigationClick", "HomepageLitepaperLink");
      }
    });
    document.querySelectorAll('#arcadeLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEventAndNavigate("/arcade", "Navigation", "HomepageNavigationClick", "HomepageArcadeLink");
      }
    });
    document.querySelectorAll('#developersLink').forEach((element) => {
      element.onclick = (event) => {
        app.browser.logMatomoEventAndNavigate("https://org.saito.tech/developers", "Navigation", "HomepageNavigationClick", "HomepageDevelopersLink");
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
}
module.exports = Website;
