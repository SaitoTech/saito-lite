const FaucetAppspaceTemplate = require('./faucet-appspace.template.js');
const FaucetGridRow = require('./faucet-appspace-row.template');
const FaucetActivities = require('./activities')

module.exports = FaucetAppspace = {

    render(app, data) {
      document.querySelector(".email-main").innerHTML = FaucetAppspaceTemplate(app);
      //FaucetActivities.forEach(act => FaucetGridRow(act));
      //FaucetActivities.forEach(function(act) { FaucetGridRow(act) });
      for (let i = 0; i < FaucetActivities.length; i++) {
        document.querySelector(".faucet-grid").innerHTML += FaucetGridRow(FaucetActivities[i]);
    }
    },

    attachEvents(app, data) {

    },

}
