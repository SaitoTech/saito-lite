const RewardsAppspaceTemplate = require('./rewards-appspace.template');
const RewardsGridRow = require('./rewards-appspace-row.template');
const RewardsActivities = require('./activities')

module.exports = RewardsAppspace = {

  render(app, data) {
    document.querySelector(".email-appspace").innerHTML = RewardsAppspaceTemplate(app);

    for (let i = 0; i < RewardsActivities.length; i++) {
      document.querySelector(".rewards-grid").innerHTML += RewardsGridRow(RewardsActivities[i]);
    }
    try {
      if (document.querySelector(".rewards-grid")) {
        app.network.sendRequestWithCallback("update activities", app.wallet.returnPublicKey(), (rows) => {
          rows.forEach(row => this.updateRewardsGridRow(row));
        });
      }
    } catch (err) {
      console.error(err);
    }

  },

  attachEvents(app, data) {
    //document.querySelector('.rewards-back').onclick = () => {data.render}
    for (let i = 0; i < RewardsActivities.length; i++) {
      document.getElementById(`${RewardsActivities[i].id}-row`)
        .onclick = ()  => RewardsActivities[i].action(app);
    }
  },

  updateRewardsGridRow(row) {
    const event = row.event;
    var grid = document.querySelectorAll(".rewards-grid div");
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].dataset.event == event) {
        grid[i].querySelector(".rewards-grid-completed").innerHTML = '<i class="fas fa-check-circle"></i>';
      }
    }
  },

}