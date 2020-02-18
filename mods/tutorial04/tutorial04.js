var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Tutorial04 extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Tutorial04";
    this.description     = "Standalone Webpage with Saito Integration";
    this.categories      = "Tutorials";

    return this;

  }




  initializeHTML(app) {
    try {    

      let data = {};

      Header.render(app, data);
      Header.attachEvents(app, data);

      document.querySelector('.main').innerHTML = `
Saito Mystery Button: <input type="button" id="tutorial04_btn" class="tutorial04_btn" value="Click me!" />
      `;
    } catch (err) {}
  }


  attachEvents(app) {
    try {
      document.querySelector('.main').addEventListener('click', function() {
        let address = app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey());
	if (address == "") { alert("You have not registered an address!"); }
	else { alert("You have registered the address: " + address); }
      });
    } catch (err) {}
  }


}

module.exports = Tutorial04;

