module.exports = AlauniusFormTemplate = () => {
  return `
  <div class="alaunius-compose">
  <div class="grid-2">
      <div>From:</div>
      <div>
          <input id="alaunius-from-address" class="alaunius-address" type="text" readonly>
      </div>
      <div>To:</div>
      <div>
          <input id="alaunius-to-address" class="alaunius-address" type="text" placeholder="Address">
      </div>
  </div>
  <div>
      <input class="alaunius-title" type="text" placeholder="Subject">
  </div>
  <textarea class="alaunius-text" placeholde="Message"></textarea>
  </div>
  <div>
      <button class="alaunius-submit">Send</button>
      <div id="alaunius-form-options">
          <i class="icon-med fas fa-paperclip"></i>
          <i class="icon-med fas fa-image"></i>
          <i class="icon-med fas fa-dollar-sign"></i>
      </div>
  </div>
  `
};
