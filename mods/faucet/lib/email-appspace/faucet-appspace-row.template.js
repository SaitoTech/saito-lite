module.exports = FaucetGridRow = (data) => {
    return `
    <div id="${data.id}-row" data-event="${data.event}" class="faucet-grid-row">
        <div id="${data.id}-icon" class="faucet-grid-icon">${data.icon}</i></div>
        <div id="${data.id}-reward" class="faucet-grid-reward">${data.reward}</div> 
        <div id="${data.id}-main" class="faucet-grid-main">
          <h3>${data.title}</h3>
          <div class="faucet-grid-description">${data.description}</div>
        </div>
        <div id="${data.id}-completed" class="faucet-grid-completed"><i class="fas fa-times-circle"></i></div>    
    </div>
    `;
  }