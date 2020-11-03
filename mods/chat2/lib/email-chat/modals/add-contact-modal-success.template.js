module.exports = AddContactModalSuccessTemplate = () => {
  return `
    <div id="add-contact-modal-success" class="modal">
      <div id="add-contact-modal-success-content" class="modal-content">
        <div style="display: grid; grid-gap: 1em">
          <div style="display: grid; grid-template-columns: auto 1em">
            <h1 style="margin: 0">Success</h1>
            <i class="close fas fa-times" style="justify-self: end;"></i>
          </div>
          <div style="display: grid;grid-gap: 1em;">
            <p>Key has been added to contact list, key exchange will be completed in a moment</p>
          </div>
        </div>
      </div>
    </div>
  `;
}