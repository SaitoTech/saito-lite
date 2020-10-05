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
        app.network.sendRequestWithCallback("user status", app.wallet.returnPublicKey(), (rows) => {
          rows.forEach(row => this.updateUserRewardsStatus(row));
        });
      }
    } catch (err) {
      console.error(err);
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

    for (let i = 0; i < RewardsActivities.length; i++) {
      document.getElementById(`${RewardsActivities[i].id}-row`)
        .onclick = ()  => RewardsActivities[i].action(app);
    }
  },

  attachEvents(app, data) {
    //document.querySelector('.rewards-back').onclick = () => {data.render}
 
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

  updateUserRewardsStatus(row) {
    var status_grid = document.querySelector('.rewards-status');
    if (!status_grid) { return; }
    let html = `<div>Total Earned: </div><div class="right">${s2Number(Math.floor(row.total_payout))}</div>
      <div>Total Spent: </div><div class="right">${s2Number(Math.floor(row.total_spend))}</div>
      <div>Next Payout Amount: </div><div class="right">${s2Number(Math.floor(row.next_payout_amount))}</div>
      <div>Spend For Next Payout: </div><div class="right">${s2Number(Math.floor(row.next_payout_after))}</div>
    `;
    status_grid.innerHTML = html;
  }

}
