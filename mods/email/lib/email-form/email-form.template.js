module.exports = EmailAddTemplate = () => {
  return `
      <div class="email-form">
        <input id="email-from-address" class="email-address" type="text" placeholder="FROM Address">
        <input id="email-to-address" class="email-address" type="text" placeholder="TO Address">
          <input class="email-title" type="text" placeholder="Title">
          <div class="email-text-wrapper">
            <textarea class="email-text" placeholde="Message"></textarea>
            <div class="raw-switch">Raw Message</div>
            <textarea class="raw-message" contenteditable="true"></textarea>
          </div>
          <button class="email-submit">SUBMIT</button>
      </div>
  `***REMOVED***;
