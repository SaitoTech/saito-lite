module.exports = EmailFormTemplate = () => {
  return `
      <div class="email-form">
        <div class="email-form-row">
          <p>From:</p>
          <input id="email-from-address" class="email-address" type="text" readonly>
        </div>
        <div class="email-form-row">
          <p>To:</p>
          <input id="email-to-address" class="email-address" type="text" placeholder="Address">
      </div>
      <div></div>
      <div>
          <input class="email-title" type="text" placeholder="Subject">
      </div>
  </div>
  <div class="email-text-wrapper">
      <textarea class="email-text" placeholde="Message"></textarea>
  </div>
  <div class="email-detail-footer">
      <button class="button-secondary email-submit">SEND</button>
      <div id="email-form-options">
          <i class="icon-med fas fa-paperclip"></i>
          <i class="icon-med fas fa-image"></i>
          <i class="icon-med fas fa-dollar-sign"></i>
      </div>
  </div>
</div>
  `
***REMOVED***;