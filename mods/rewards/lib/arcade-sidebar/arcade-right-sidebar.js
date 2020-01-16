const RewardsSidebarTemplate = require('./arcade-right-sidebar.template');
const RewardsSidebarRow = require('./arcade-sidebar-row.template')

module.exports = RewardsSidebar = {
  render(app, data) {
    document.querySelector(".arcade-sidebar-notices").innerHTML = RewardsSidebarTemplate(app);
  },

  attachEvents(app, data) {},
}

