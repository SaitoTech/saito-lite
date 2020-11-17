module.exports = ArcadeCreateGameOverlayTemplate = (tabs, gameCreator) => {
  let tabButtonsHtml = "";
  for (let i = 0; i < tabs.buttonNames.length; i++) {
    tabButtonsHtml += `<div id="tab-${i}-button" class="create-game-tab-button">${tabs.buttonNames[i]}</div>`;
  }
  let tabContentsHtml = "";
  for (let j = 0; j < tabs.tabContents.length; j++) {
    tabContentsHtml += `<div id="create-game-tab-${j}" class="create-game-tab">${tabs.tabContents[j]}</div>`;
  }
  
  return `
  <div id="background-shim" class="background-shim" style="background-image: url('/${gameCreator.slug}/img/arcade.jpg')">
    <div class="create-game-wizard">
      <div class="return-to-arcade" id="return-to-arcade">
        <i class="icon-large fas fa-times-circle"></i>
      </div>
      <div id="prev-tab-button">
        prev
      </div>
      <div id="next-tab-button">
        next
      </div>
      <div class="create-game-tabs-buttons">
        ${tabButtonsHtml}
      </div>
      <form class="create-game-tabs">
        ${tabContentsHtml}
      </form>
    </div>
  </div>
  `;
}
