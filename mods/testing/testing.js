const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Testing extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Testing";

  }

  initialize(app) {

    super.initialize(app);

console.log("about to try and archive data...");
setTimeout(function() {
console.log("\n\n\n\nRUNNING SAVE TX!");
app.storage.saveTransaction("this is our transaction");
}, 3500);

  }
}


module.exports = Testing;

