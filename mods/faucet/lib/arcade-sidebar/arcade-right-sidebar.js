const FaucetSidebarTemplate = require('./arcade-right-sidebar.template');
const FaucetSidebarRow = require('./arcade-sidebar-row.template')

module.exports = FaucetSidebar = {

  async render(app, data) {
    document.querySelector(".arcade-sidebar-notices").innerHTML = FaucetSidebarTemplate(app);
    try {
      if (document.querySelector(".arcade-sidebar-done")) {
        await this.app.network.sendRequestWithCallback("get achievements", this.app.wallet.returnPublicKey(), (rows) => {
          rows.forEach(row => this.renderAchievmentRow(row));
        });
      }
    } catch (err) {
      console.error(err);
    }

  },

  attachEvents(app, data) {

  },

}

