module.exports = AlauniusInboxHeaderTemplate = (app, data) => {
  return `
    <div class="alaunius-icons">
      <input id="alaunius-select-icon" type="checkbox">
      <i id="alaunius-delete-icon" class="icon-med far fa-trash-alt"></i>
      <i id="alaunius-bars-icon" class="icon-med fas fa-bars"></i>
    </div>
    <div class="detail alaunius-balance"></div>
  `;
}
