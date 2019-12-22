module.exports = EmailFormTemplate = () => {
  return `
  <div class="email-compose">
  <div class="grid-2">
      <div>From:</div>
      <div>
          <input id="email-from-address" class="email-address" type="text" readonly>
      </div>
      <div>To:</div>
      <div>
          <input id="email-to-address" class="email-address" type="text" placeholder="Address">
      </div>
  </div>
  <div>
      <input class="email-title" type="text" placeholder="Subject">
  </div>
  <textarea class="email-text" placeholde="Message"></textarea>
  </div>
  <div>
      <button class="email-submit">Send</button>
      <div id="email-form-options">
          <i class="icon-med fas fa-paperclip"></i>
          <i class="icon-med fas fa-image"></i>
          <i class="icon-med fas fa-dollar-sign"></i>
      </div>
  </div>
  `
};