const FaucetSidebarTemplate = require('./arcade-right-sidebar.template');
const FaucetSidebarRow = require('./arcade-sidebar-row.template')

module.exports = FaucetSidebar = {
  render(app, data) {
    document.querySelector(".arcade-sidebar-notices").innerHTML = FaucetSidebarTemplate(app);
  },

  attachEvents(app, data) {},
}

