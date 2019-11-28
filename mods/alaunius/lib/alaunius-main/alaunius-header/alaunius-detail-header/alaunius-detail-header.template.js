module.exports = AlauniusDetailHeaderTempkate = (app, data) => {
  return `
    <div class="alaunius-detail-left-options">
      <i id="alaunius-form-back-button" class="icon-med fas fa-arrow-left"></i>
      <h4>${data.parentmod.header_title***REMOVED***</h4>
    </div>
    <div class="alaunius-detail-right-options">
    <div class="alaunius-icons">
      <i id="alaunius-delete-icon" class="icon-med far fa-trash-alt"></i>
      <i id="alaunius-detail-reply" class="icon-med fas fa-reply"></i>
      <i id="alaunius-detail-forward" class="icon-med fas fa-share"></i>
    </div>
    <div class="alaunius-balance"></div>
    </div>
  `;
***REMOVED***
