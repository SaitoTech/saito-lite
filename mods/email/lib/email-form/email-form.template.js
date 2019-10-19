module.exports = EmailFormTemplate = () => {
  return `
      <div class="email-form">
        <input id="email-from-address" class="email-address" type="text" placeholder="" readonly>
        <input id="email-to-address" class="email-address" type="text" placeholder="TO Address">
          <input class="email-title" type="text" placeholder="Title">
          <div class="email-text-wrapper">
            <textarea class="email-text" placeholde="Message"></textarea>
            <div id="email-form-options">
              <i class="fas fa-paperclip"></i>
              <i class="fas fa-image"></i>
              <i class="fas fa-dollar-sign"></i>
            </div>
          </div>
          <button class="email-submit">SUBMIT</button>
      </div>
  `
};

  // <div class="raw-switch">Raw Message</div>
  // <textarea class="raw-message" contenteditable="true"></textarea>