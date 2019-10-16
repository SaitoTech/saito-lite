const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Testing extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Testing";

  }

  initialize(app) {

    super.initialize(app);

console.log("\n\n\n\nabout to try and archive data...");
setTimeout(function() {
  console.log("\n\n\n\nRUNNING SAVE TX!");
  app.storage.saveTransaction("this is our transaction");
  console.log("\n\n\n\nRUNNING LOAD TX!");
  app.storage.loadTransactions("all", 50, function(data) {

    console.log("RECEIVED DATA BACK FROM LOAD TRANSACTIONS");
    console.log(JSON.stringify(data));

  });
}, 4000);

  }
}


module.exports = Testing;

