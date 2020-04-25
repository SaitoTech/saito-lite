module.exports = RewardsSidebarRow = (name, icon, count) => {
    return `
      <span class="tip reward-icon">
        ${icon}
        <span class="tiptext rewards-row-name">${name}</span>
      </span>
    `;
  }


  //<div class="arcade-sidebar-row"></div>