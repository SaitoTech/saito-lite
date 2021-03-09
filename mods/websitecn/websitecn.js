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
  webServer(app, expressapp, express) {
    expressapp.use("/", express.static(`${__dirname}/../../mods/${this.dirname}/web/CN`));
    super.webServer(app, expressapp, express);
  }
}
module.exports = WebsiteCN;
