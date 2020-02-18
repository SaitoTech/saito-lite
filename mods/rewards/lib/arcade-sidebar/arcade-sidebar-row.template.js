module.exports = RewardsSidebarRow = (name, icon, count) => {
    return `
    <div class="arcade-sidebar-row">
      <i class="${icon}"><span>${count}</span></i>
      <span class="rewards-row-name">${name}</span>
    </div>
    `;
  }