var ModTemplate = require('../../lib/templates/modtemplate');

//////////////////
// CONSTRUCTOR  //
//////////////////
class Tutorial03 extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Tutorial03";
    this.description     = "Standalone Webpage Application";
    this.categories      = "Tutorials";

    return this;

  }




  initializeHTML(app) {
    try {    
      document.querySelector('.main').innerHTML = `
Saito Mystery Button: <input type="button" id="tutorial03_btn" class="tutorial03_btn" value="Click me!" />
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

module.exports = Tutorial03;

