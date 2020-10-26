var ModTemplate = require('../../lib/templates/modtemplate');
class Tutorial0 extends ModTemplate {
  constructor(app) {
    super(app);
    //
    // this.name will form the "slug" in the url of your module. If it matches
    // the filename, Saito's Lite Client will detect this browser and fire your
    // initializeHTML() method.
    //
    this.name            = "Tutorial0";
    this.description     = "Hello World!";
    this.categories      = "Tutorials";
    //
    // Setting default_html to 1 will cause the Lite Client to serve a basic
    // HTML file which you can then manipulate however you wish.
    //
    this.default_html = 1;
    return this;
  }

  initialize(app) {
    if (this.app.BROWSER == 0) { return; };
    super.initialize(app);
  }

  initializeHTML(app) {
    if (this.app.BROWSER == 0) { return; };
    console.log("tut0 initializeHTML")
    document.querySelector("#content .main").innerHTML = "<div id='greeting'>Hello World!</div>"
    addCss();
  }
}

function addCss() {
  var style = document.createElement("style");
  style.innerHTML = `
    #greeting {
      font-size: 24px;
      text-align: center;
      margin: 10px 10px 10px 10px;
    }
  `;
  document.head.appendChild(style);
}

module.exports = Tutorial0;
