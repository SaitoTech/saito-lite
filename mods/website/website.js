const path = require('path');
const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ModalRegisterEmail = require('../../lib/saito/ui/modal-register-email/modal-register-email');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');
const TokenTemplate = require('./lib/subpage/token/token.template.js');
const TokenBurnTemplate = require('./lib/subpage/token/tokenburn.template.js');
// const PolkadotOverlay = require('../dotarcade/lib/polkadot-overlay');
const PoolsTemplate = require('./lib/subpage/token/pools.template.js');
const Web3Template = require('./lib/subpage/web3.template.js');
const TeamTemplate = require('./lib/subpage/team.template.js');
const FAQTemplate = require('./lib/subpage/faq.template.js');
const HowSaitoWorksTemplate = require('./lib/subpage/howSaitoWorks.template.js');

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
  initializeHompage(app) {
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

  initializeTokenPage(app) {
    document.title = "SAITO ERC-20 Token Contract";
    app.browser.addElementToElement('<link rel="stylesheet" href="/subpagestyle/token/token.style.css" />', document.head);
    document.querySelector("#content").innerHTML = TokenTemplate();
    document.querySelectorAll("#burnlink").forEach(element => {    
      element.onclick = async(event) => {
        event.preventDefault(); // cancel the event
        let result = await sconfirm("WARNING: At this time the Saito Network is under active development and is subject to be reset at the team's discretion. Your Native SAITO balance will be reset in such a case.");
        if(result) {
          result = await sconfirm("WARNING: It is strongly recommended that you do not burn your ERC20 SAITO at this time. If you are in need of tokens on the current SAITO network, please consider reaching out to us before proceeding to burn your ERC20 SAITO.");  
        }
        if(result) {
          result = await sconfirm("Are you absolutely sure you want to know how to burn your ERC20 SAITO?");
        }
        if(result) {
          window.location = document.querySelector("#burnlink").href;
        }
      }
    });
    
  }
  initializeTokenBurnPage(app) {
    document.title = "Burn SAITO Token";
    document.querySelector("#content").innerHTML = TokenBurnTemplate();
  }
  initializePoolsPage(app) {
    document.title = "IDO Pools";
    app.browser.addElementToElement('<link rel="stylesheet" href="/subpagestyle/token/pools.style.css" />', document.head);
    document.querySelector("#content").innerHTML = PoolsTemplate();
  }

  initializeWeb3Page(app) {
    document.title = "Web3.0";
    app.browser.addElementToElement('<link rel="stylesheet" href="/subpagestyle/web3/style.css" />', document.head);
    document.querySelector("#content").innerHTML = Web3Template(app);
  }

  initializeTeamPage(app) {
    document.title = "Our Team";
    app.browser.addElementToElement('<link rel="stylesheet" href="/subpagestyle/team/style.css" />', document.head);
    document.querySelector("#content").innerHTML = TeamTemplate();
  }

  initializeFAQPage(app) {
    document.title = "Frequently Asked Questions";
    app.browser.addElementToElement('<link rel="stylesheet" href="/subpagestyle/faq/style.css" />', document.head);
    document.querySelector("#content").innerHTML = FAQTemplate();
  }

  initializeHowSaitoWorksPage(app) {
    document.title = "Welcome to the Saito Project";
    app.browser.addElementToElement('<link rel="stylesheet" href="/subpagestyle/howSaitoWorks/style.css" />', document.head);
    document.querySelector("#content").innerHTML = HowSaitoWorksTemplate();
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
    if(document.location.pathname.startsWith("/website/tokenburn")){
      this.initializeTokenBurnPage(app);
    } else if(document.location.pathname.startsWith("/website/token")){
      this.initializeTokenPage(app);
    } else if(document.location.pathname.startsWith("/website/pools") || document.location.pathname.startsWith("/website/whitelist")){
      this.initializePoolsPage(app);
    } else if(document.location.pathname.startsWith("/website/web3")){
      this.initializeWeb3Page(app);
    } else if(document.location.pathname.startsWith("/website/team")){
      this.initializeTeamPage(app);
    } else if(document.location.pathname.startsWith("/website/faq")){
      this.initializeFAQPage(app);
    } else if(document.location.pathname.startsWith("/website/how-saito-works")){
      this.initializeHowSaitoWorksPage(app);
    } else {
      this.initializeHompage(app);
    }

    // PolkadotOverlay.render(this.app, this);
    // PolkadotOverlay.attachEvents(this.app, this);

  }
  initialize(app) {
    if(app.BROWSER) {
      this.initializeExpandSideBar();
    }
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
  doExpandSideBar() {
    let expandSidebar = this.app.browser.parseHash(window.location.hash).side_bar;
    if(expandSidebar) {
      document.querySelector("#header-mini-wallet").click();
      document.querySelector('#header-token-select').classList.add('pulsey');
      window.location.hash = this.app.browser.removeFromHash(window.location.hash, "side_bar");
    }
  }
  
  initializeExpandSideBar() {
    window.addEventListener("hashchange", () => {
      this.doExpandSideBar();
    });
    let oldHash = window.location.hash;
    window.location.hash = `#`;
    window.location.hash = oldHash;
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
    expressapp.get('/subpagestyle/:subpage/:stylesheetfile', async (req, res) => {
      console.log(req.params.stylesheetfile);
      res.sendFile(path.join(__dirname + '/web/subpage/'  + req.params.subpage + "/" + req.params.stylesheetfile));
    });
    expressapp.get('/website/*', async (req, res) => {
      // use website/* here so that website.js will be initialized, i.e. we are still operating within the website module
      res.sendFile(path.join(__dirname + '/web/subpage/index.html'));
    });
  }
}
module.exports = Website;
