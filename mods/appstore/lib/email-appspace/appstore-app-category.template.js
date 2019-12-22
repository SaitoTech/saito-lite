module.exports = AppStoreAppCategoryTemplate = () => {

  let index = "1132";
  let name = "Games";
  let amt = 4123;
  let icon = "fa-gamepad";

  return `
    <div id="appstore-browse-item-${index}" class="appstore-browse-item">
      <div class="appstore-sort-item-name">${name}</div>
      <div class="appstore-sort-item-amount">${amt}</div>
      <div class="appstore-sort-item-icon"><i class="fas ${icon}"></i></div>
     </div>
  `;
}
