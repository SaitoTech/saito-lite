const RewardsSidebarTemplate = require('./arcade-right-sidebar.template');
const RewardsSidebarRow = require('./arcade-sidebar-row.template')

module.exports = RewardsSidebar = {
  render(app, data) {
    document.querySelector(".arcade-sidebar-notices").innerHTML = RewardsSidebarTemplate(app);
    document.querySelector(".arcade-sidebar-done").innerHTML = "";
    app.network.sendRequestWithCallback("get achievements", app.wallet.returnPublicKey(), (rows) => {
      rows.forEach(row => {
        if (typeof (row.label) != "undefined" || typeof (row.icon) != "undefined") {
          document.querySelector(".arcade-sidebar-done").innerHTML += RewardsSidebarRow(row.label, row.icon, row.count);
        }
      });
  });
  },

  attachEvents(app, data) {},
}

