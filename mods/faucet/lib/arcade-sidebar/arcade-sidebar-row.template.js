module.exports = FaucetSidebarRow = (name, icon, count) => {

    return `
    <div class="arcade-sidebar-row">
      <i class="${icon}"><span>${count}</span></i>
      <span class="faucet-row-name">${name}</span>
    </div>
    `;
  }