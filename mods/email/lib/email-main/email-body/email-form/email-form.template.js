module.exports = EmailFormTemplate = () => {
  return `
      <div class="email-form">
        <div class="email-form-row">
          <p>FROM:</p>
          <input id="email-from-address" class="email-address" type="text" readonly>
        </div>
        <div class="email-form-row">
          <p>TO:</p>
          <input id="email-to-address" class="email-address" type="text" placeholder="Address">
        </div>
        <input class="email-title" type="text" placeholder="Subject">
        <div class="email-text-wrapper">
          <textarea class="email-text" placeholde="Message"></textarea>
        </div>
        <div class="email-detail-footer">
            <button class="email-submit">SUBMIT</button>
            <div id="email-form-options">
              <i class="icon-med fas fa-paperclip"></i>
              <i class="icon-med fas fa-image"></i>
              <i class="icon-med fas fa-dollar-sign"></i>
            </div>
        </div>
      </div>
  `
***REMOVED***;