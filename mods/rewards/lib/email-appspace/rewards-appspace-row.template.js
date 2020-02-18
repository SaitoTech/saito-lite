module.exports = RewardsGridRow = (data) => {
    return `
      <div id="${data.id}-row" data-event="${data.event}" class="rewards-grid-row">
        <div id="${data.id}-icon" class="rewards-grid-icon">${data.icon}</i></div>
        <div id="${data.id}-reward" class="rewards-grid-reward">${data.reward}</div> 
        <div id="${data.id}-main" class="rewards-grid-main">
          <h3>${data.title}</h3>
          <div class="rewards-grid-description">${data.description}</div>
        </div>
        <div id="${data.id}-completed" class="rewards-grid-completed"><i class="fas fa-times-circle"></i></div>
      </div>
    `;
  }