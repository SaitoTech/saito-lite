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


    let html = `
    <div class="left desktop">
    <a class="logo" href="/"><img class="logoImage" alt="icon" src="/website/img/top_logo.png"></img></a>
    <a alt="the Saito Arcade" href="https://saito.io/arcade">Arcade</a>
    <a alt="developer resources" href="https://org.saito.tech/developers">Developers</a>
    <a alt="links to get involved" href="#getinvolved">Community</a>
    <a alt="blog" href="https://org.saito.tech/blog">Blog</a>
    <a class="language-info" alt="中文" href="website/CN" href="/website/CN">中文 
    <!--img class="language-image" alt="icon" src="/website/img/cn_Icon.png"></img-->
    </a>
  </div>
  <div class="right">
    <!--div class="header-mobile-menu">⋮</div-->
  </div>
  `;
    if(document.querySelector('.header-icon-links')) {
      app.browser.prependElementToDom(html, document.querySelector('.header-icon-links'));
    }

    html = `
    <div class="mobile-menu mobile">
     <a alt="developer resources" href="https://org.saito.tech/developers">Developers</a>
     <a alt="links to get involved" href="#getinvolved">Community</a>
     <a alt="blog" href="https://org.saito.tech/blog">Blog</a>
     <a class="language-info" alt="中文" href="website/CN" href="/website/CN">中文</a> 
    </div>
    <hr/>
    `;
    
    if(document.querySelector('.header-dropdown')) {
      app.browser.prependElementToDom(html, document.querySelector('.header-dropdown'));
    }


    document.querySelectorAll('website-newsletter-subscribe').forEach((element) => {
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
