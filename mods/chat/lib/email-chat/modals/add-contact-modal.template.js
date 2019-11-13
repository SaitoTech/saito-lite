module.exports = AddContactModalTemplate = () => {
  return `
    <div id="add-contact-modal" class="modal">
      <div id="add-contact-modal-content" class="modal-content">
        <div style="display: grid; grid-gap: 1em">
          <div style="display: grid; grid-template-columns: auto 1em">
            <h1 style="margin: 0">Add Contact</h1>
            <i class="close fas fa-times" style="justify-self: end;"></i>
          </div>
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