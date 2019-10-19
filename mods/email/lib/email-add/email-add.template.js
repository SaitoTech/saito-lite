module.exports = EmailAddTemplate = () => {
  return `
      <div class="email-form">
        <input class="email-title" type="text" placeholder="Title">
        <input class="email-fee" type="number" default="2.0" placeholder="Fee">
        <input class="email-address" type="text" placeholder="Address">
        <input class="email-amount" type="number" default="0.0" placeholder="Amount"/>
        <div class="email-text-wrapper">
          <textarea class="email-text" placeholde="Message"></textarea>
          <div class="raw-switch">Raw Message</div>
          <textarea class="raw-message" contenteditable="true"></textarea>
        </div>
        <button class="email-submit">SUBMIT</button>
      </div>
  `};
