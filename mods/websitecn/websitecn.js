const Website = require('../website/website');

class WebsiteCN extends Website {

  constructor(app) {
    super(app);
    this.app = app;
    this.name = "WebsiteCN";
    this.description = "Module that creates a root website for China on a Saito node.";
    this.categories = "Utilities Communications";
    return this;
  }
  respondTo(type) {
    // we don't want to respond to things twice, website.js will still be installed on the client side.
  }
  webServer(app, expressapp, express) {
    //all we do is tell express to serve this index.html before the one in mods/website.
    expressapp.use("/", express.static(`${__dirname}/../../mods/${this.dirname}/web/`));
    super.webServer(app, expressapp, express);
  }
}
module.exports = WebsiteCN;
