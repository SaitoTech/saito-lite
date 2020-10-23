const ModTemplate = require('../../lib/templates/modtemplate');

class ApiCore extends ModTemplate {

  constructor(app) {
    super(app);
    this.app = app;
    this.name = "Api";
    this.description = "API for off-chain server-client JSON querues";
    this.categories = "Utilities Dev";
    this.alwaysRun = 1;
  }

  webServer(app, expressapp) {

    var api_self = app.modules.returnModule("Api");

    ///////////////////
    // web resources //
    ///////////////////
    expressapp.get('/api/', function (req, res) {
      res.setHeader('Content-type', 'text/html');
      res.charset = 'UTF-8';
      res.write(api_self.returnIndexHTML(app));
      res.end();
      return;
    });

    ///////////////////
    // json requests //
    ///////////////////
    expressapp.get('/api/balance/:address', async (req, res) => {

      let address = req.params.address;

      if (address == null) {

        res.setHeader('Content-type', 'text/json');
        res.charset = 'UTF-8';
        res.write("Please provide a block hash.");
        res.end();
        return;

      } else {

        res.setHeader('Content-type', 'text/html');
        res.charset = 'UTF-8';
        res.write(api_self.returnBlockHTML(app, hash));
        res.end();
        return;

      }
    });
    
  }
}

module.exports = ApiCore;


