module.exports = EmailAddTemplate = () => {
  return `
      <div class="email-content">
          <div id="email-sidebar" class="email-sidebar">
            <ul id="email-mod-buttons">
              <li class="button">Inbox</li>
              <li class="button">Sent</li>
              <li class="button">Pandora</li>
            </ul>
          </div>
          <div class="email-module-title"><h2>Saito Mail</h2></div>
          <div class="email-identifier"></div>
          <div class="email-balance"></div>
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
  `***REMOVED***;
