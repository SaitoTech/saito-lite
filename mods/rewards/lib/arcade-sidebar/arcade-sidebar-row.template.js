module.exports = RewardsSidebarRow = (name, icon, count) => {
    return `
    <div class="arcade-sidebar-row">
      <span>${icon}</span>
      <span class="rewards-row-name">${name}</span>
    </div>
    `;
  }