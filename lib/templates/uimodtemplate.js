const ModTemplate = require('./modtemplate');

class UIModTemplate extends ModTemplate {

  constructor(app, path) {

    super(app);

    //
    // ui components are always visible by definition
    //
console.log("constructing this " + this.name);
    if (this.browser_active == 0) { this.browser_active = 1; }
    if (this.name == "") { this.name = "UI Component"; };

  }

  initialize(app) {

console.log("initializing this " + this.name);
    //
    // all other modules have been initialized and added
    // to app.modules by the time that we get around to 
    // creating UI components (render), so when we are 
    // creating these UI components we manually add the 
    // modules and initialize them here.
    //
    if (!app.modules.uimods.includes(this)) {
console.log("pushing this onto our uimods... - " + this.name);
      app.modules.uimods.push(this);
    }
    super.initialize(app);

  }

}

module.exports = UIModTemplate;

