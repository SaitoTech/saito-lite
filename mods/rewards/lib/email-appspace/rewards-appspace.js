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
      if (document.querySelector(".referral-status")) {
        app.network.sendRequestWithCallback("user referrals", app.wallet.returnPublicKey(), (rows) => {
          try {
            var referral_grid = document.querySelector('.referral-status');
            var total_earn = 0;
            if (rows.length > 0) {
              referral_grid.innerHTML = `<div class="table-head">User</div><div class="table-head right">Total Rewards</div><div class="table-head right">Referral Date</div>`;
              rows.forEach((row) => {
                this.updateUserreferralStatus(app, row);
                total_earn += row.total_payout;
              }); 
              document.querySelector('.total-earned').innerHTML += `<div class="total-earned-content"><h3>Total Bonus: ${Math.floor(total_earn/10)} SAITO</h3></div>`;
            } else {
              referral_grid.innerHTML = "<p>Click 'Refer Friends' below to get your personal referral link and start earning today.</p>";
            }
          } catch (err) {
            console.log(err);
          }
          document.querySelector('.invite-link').innerHTML = `
          Your referral link: <input class="invite-link-input" type="text" value="${app.browser.returnInviteLink()}" /><i class="fas fa-copy"></i>
          `;
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
        .onclick = () => RewardsActivities[i].action(app);
    }
  },

  attachEvents(app, data) {
    //document.querySelector('.rewards-back').onclick = () => {data.render}
    document.querySelector('.invite-link').addEventListener('click', (e) => {
      let text = document.querySelector('.invite-link-input');
      text.select();
      document.execCommand('copy');
    });

  },

  updateRewardsGridRow(row) {
    const event = row.event;
    var grid = document.querySelectorAll(".rewards-grid-row");
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
  },

  updateUserreferralStatus(app, row) {
    var referral_grid = document.querySelector('.referral-status');
    
    let html =
      `
     <div>${app.keys.returnIdentifierByPublicKey(row.address, true)}</div>
      <div class="right">${s2Number(Math.floor(row.total_payout))}</div>
      <div class="right">${new Date(row.first_tx).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false })}</div>
    `;
    referral_grid.innerHTML += html;
  }

}
