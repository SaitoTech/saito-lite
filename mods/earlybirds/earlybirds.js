const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const fetch = require('node-fetch');

class EarlyBirds extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "EarlyBirds";

    this.description = "VIP Token Registration and Early Bird Bonuses";
    this.categories = "Utilities Communications";
    return this;
  }

  initializeHTML(app) {
    this.header = new SaitoHeader(app, this);
    this.header.render(app, this);
    this.header.attachEvents(app, this);
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  attachEvents(app) {

    document.querySelector(".submit-button").onclick = (e) => {

      let emailobj = document.getElementById("email_address");
      if (!this.validateEmail(emailobj.value)) {
	salert("Email Tests Invalid - if this is really your email address please write us at info@saito.tech");
	return;
      }

      let url = "https://saito.io/earlybirds/register/" + emailobj.value + "/" + app.wallet.returnPublicKey();

      document.querySelector(".rewards_container").innerHTML = "Submitting: please wait...";

      fetch(url, {}).then(response => {
        if (response.status !== 200) {
          console.log('ERROR FETCHING BLOCK 11111. Status Code: ', response.status);
          reject(200);
        } else {
          response.text().then(data => {
            document.querySelector(".rewards_container").innerHTML = "Submission Succeeded<p></p>We will contact you in the next week or so with details on your allocation.";
          });
        }
      });
    }
  }


  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

    const fs = app.storage.returnFileSystem();
    const path = require('path');

    if (fs != null) {
      expressapp.get('/earlybirds/register/:email/:pkey', async (req, res) => {

        let email = req.params.email;
        let pkey  = req.params.pkey;

        let sql = "INSERT INTO users (email, publickey) VALUES ($email, $pkey)";
        let params = { $email: email , $pkey : pkey };

        await app.storage.executeDatabase(sql, params, "earlybirds");

        res.setHeader('Content-type', 'text/html');
        res.charset = 'UTF-8';
        res.write("Success");
        res.end();
        return;

      });
    }
  }

}

module.exports = EarlyBirds;

