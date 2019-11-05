module.exports = EmailChatTemplate = () => {
  return `
      <div style="display: flex;
      align-items: center;
      justify-content: space-between;">
        <h2>Chat</h2>
        <i id="email-chat-add-contact" class="icon-med fas fa-plus"></i>
      </div>
      <div class="chat-list"></div>

      <!-- Add Contact Modal -->

      <div id="add-contact-modal" class="modal">
        <div id="add-contact-modal-content" class="modal-content">
          <span class="close">&times;</span>
          <div style="display: grid; grid-gap: 1em">
            <h1 style="margin: 0">Add Contact</h1>
            <div style="display: grid;grid-gap: 1em;">
              <input id="add-contact-input" type="text" placeholder="Publickey">
              <div style="display: flex;align-items: center;">
                <button id="add-contact-add-button" style="width: 91%;">ADD</button>
                <a id="qr-scanner-icon" href="/qrscanner">
                  <i id="qr-code-icon" class="icon-large fas fa-qrcode"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;
***REMOVED***
