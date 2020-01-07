const FaucetAppspaceTemplate = require('./faucet-appspace.template.js');
const FaucetGridRow = require('./faucet-appspace-row.template');
const FaucetActivities = require('./activities')

module.exports = FaucetAppspace = {

  async render(app, data) {
    document.querySelector(".email-main").innerHTML = FaucetAppspaceTemplate(app);
    for (let i = 0; i < FaucetActivities.length; i++) {
      document.querySelector(".faucet-grid").innerHTML += FaucetGridRow(FaucetActivities[i]);
    }
    try {
      if (document.querySelector(".faucet-grid")) {
        await app.network.sendRequestWithCallback("update activities", app.wallet.returnPublicKey(), (rows) => {
          rows.forEach(row => this.updateFaucetGridRow(row));
        });
      }
    } catch (err) {
      console.error(err);
    }

  },

  attachEvents(app, data) {
    for (let i = 0; i < FaucetActivities.length; i++) {
      document.querySelector("#" + FaucetActivities[i].id + "-row").addEventListener('click', function () {
        FaucetActivities[i].action(app);
      });
    }
  },

  updateFaucetGridRow(row) {
    const event = row.event;
    var grid = document.querySelectorAll(".faucet-grid div");
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].dataset.event == event) {
        grid[i].querySelector(".faucet-grid-completed").innerHTML = '<i class="fas fa-check-circle"></i>';
      }
    }
  },

}
